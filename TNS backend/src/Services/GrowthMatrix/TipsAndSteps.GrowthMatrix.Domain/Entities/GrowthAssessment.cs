using TipsAndSteps.GrowthMatrix.Domain.Enums;

namespace TipsAndSteps.GrowthMatrix.Domain.Entities;

public sealed class GrowthAssessment
{
    public string     Id         { get; set; } = Guid.NewGuid().ToString();
    public string     ChildId    { get; set; } = string.Empty;
    public string     ParentId   { get; set; } = string.Empty;
    public AgeGroup   AgeGroup   { get; set; }
    public List<SkillResponse> Responses { get; set; } = [];

    // Computed scores per category
    public Dictionary<string, decimal> CategoryScores { get; set; } = [];
    public decimal    TotalScore { get; set; }
    public ScoreLevel ScoreLevel { get; set; }

    public DateTime   CompletedAt { get; set; } = DateTime.UtcNow;
}

public sealed class SkillResponse
{
    public string   SkillId    { get; set; } = string.Empty;
    public bool?    YesNoValue { get; set; }
    public decimal? NumericValue { get; set; }
}
