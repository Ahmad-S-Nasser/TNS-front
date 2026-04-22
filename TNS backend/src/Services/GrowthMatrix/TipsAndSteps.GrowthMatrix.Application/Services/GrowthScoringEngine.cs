using TipsAndSteps.GrowthMatrix.Domain.Entities;
using TipsAndSteps.GrowthMatrix.Domain.Enums;
using TipsAndSteps.GrowthMatrix.Domain.ValueObjects;

namespace TipsAndSteps.GrowthMatrix.Application.Services;

/// <summary>
/// Core scoring engine for Growth Matrix assessments.
/// Calculates weighted scores per category and overall developmental level.
/// </summary>
public sealed class GrowthScoringEngine
{
    public ScoringResult Calculate(GrowthAssessment assessment, IReadOnlyList<GrowthSkill> skills)
    {
        var categoryScores  = new Dictionary<string, decimal>();
        var skillsById      = skills.ToDictionary(s => s.Id);

        // Group responses by category
        var byCategory = assessment.Responses
            .Where(r => skillsById.ContainsKey(r.SkillId))
            .GroupBy(r => skillsById[r.SkillId].Category);

        foreach (var group in byCategory)
        {
            decimal earned  = 0m;
            decimal maxPossible = 0m;

            foreach (var response in group)
            {
                var skill = skillsById[response.SkillId];
                maxPossible += skill.Weight * (skill.MaxValue ?? 1m);

                earned += skill.SkillType switch
                {
                    SkillType.YesNo   => response.YesNoValue == true ? skill.Weight : 0m,
                    SkillType.Numeric => skill.MaxValue.HasValue
                        ? Math.Min(response.NumericValue ?? 0m, skill.MaxValue.Value) / skill.MaxValue.Value * skill.Weight
                        : 0m,
                    _ => 0m
                };
            }

            var pct = maxPossible > 0 ? (earned / maxPossible) * 100m : 0m;
            categoryScores[group.Key.ToString()] = Math.Round(pct, 1);
        }

        var totalScore = categoryScores.Any()
            ? Math.Round(categoryScores.Values.Average(), 1)
            : 0m;

        var level = totalScore switch
        {
            >= 90m => ScoreLevel.Excellent,
            >= 70m => ScoreLevel.Good,
            >= 50m => ScoreLevel.NeedsAttention,
            _      => ScoreLevel.RequiresIntervention
        };

        var recommendations = BuildRecommendations(level, categoryScores);

        return new ScoringResult(totalScore, level, categoryScores, recommendations);
    }

    private static List<string> BuildRecommendations(
        ScoreLevel level,
        Dictionary<string, decimal> categoryScores)
    {
        var recs = new List<string>();

        if (level == ScoreLevel.RequiresIntervention)
            recs.Add("يُنصح بمراجعة طبيب متخصص في التطور الأطفال");

        if (level == ScoreLevel.NeedsAttention)
            recs.Add("تابع تطور طفلك وراجع قسم الألعاب التعليمية");

        // Add category-specific recommendations for weak areas
        foreach (var (category, score) in categoryScores.Where(c => c.Value < 60))
            recs.Add($"يحتاج تحسين في مجال {category} — تحقق من الأنشطة المقترحة");

        return recs;
    }
}
