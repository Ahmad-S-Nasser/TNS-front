// ─── Growth Matrix Configuration Layer ─────────────────────────────────────────
// This file now only contains scoring logic and helper functions.
// All data fetching is handled via TanStack Query hooks in @/hooks/queries/useMatrix.ts

import type {
  Skill,
  ExpectedRule,
  OverallScore,
  CategoryScore,
  SkillEvaluation,
  ChildEvaluationRequest,
  MatrixExport,
  ProgressLabel,
  SkillStatus,
} from "./types";

// ─── Scoring Thresholds ─────────────────────────────────────────────────────

const SCORING_CONFIG = {
  labelThresholds: {
    excellent: 85,
    good: 65,
    needsAttention: 40,
    critical: 0,
  },
};

// ─── Scoring Engine (Client-side implementation) ──────────────────────────────

function getProgressLabel(percentage: number): ProgressLabel {
  if (percentage >= SCORING_CONFIG.labelThresholds.excellent) return "excellent";
  if (percentage >= SCORING_CONFIG.labelThresholds.good) return "good";
  if (percentage >= SCORING_CONFIG.labelThresholds.needsAttention) return "needs_attention";
  return "critical";
}

function evaluateSkill(
  skill: Skill,
  rule: ExpectedRule,
  inputValue: boolean | number | string | undefined
): { score: number; status: SkillStatus } {
  if (inputValue === undefined || inputValue === null) {
    return { score: 0, status: "not_evaluated" };
  }

  if (skill.metricType === "boolean") {
    const achieved = inputValue === true;
    return {
      score: achieved ? 100 : 0,
      status: achieved ? "achieved" : "delayed",
    };
  }

  if (skill.metricType === "numeric") {
    const val = Number(inputValue);
    if (isNaN(val)) return { score: 0, status: "not_evaluated" };

    if (rule.optimalMin !== undefined && rule.optimalMax !== undefined) {
      if (val >= rule.optimalMin && val <= rule.optimalMax) {
        return { score: 100, status: "achieved" };
      }
      if (rule.minValue !== undefined && val >= rule.minValue && val < rule.optimalMin) {
        const range = rule.optimalMin - rule.minValue;
        const pct = range > 0 ? ((val - rule.minValue) / range) * 50 + 40 : 50;
        return { score: Math.round(pct), status: "pending" };
      }
      if (rule.maxValue !== undefined && val > rule.optimalMax && val <= rule.maxValue) {
        const range = rule.maxValue - rule.optimalMax;
        const pct = range > 0 ? 100 - ((val - rule.optimalMax) / range) * 30 : 70;
        return { score: Math.round(pct), status: "pending" };
      }
    }

    if (rule.minValue !== undefined && val < rule.minValue) {
      return { score: Math.max(0, Math.round((val / rule.minValue) * 30)), status: "delayed" };
    }

    return { score: 50, status: "pending" };
  }

  if (skill.metricType === "scale") {
    const scaleOpt = skill.scaleOptions?.find(
      (o) => o.label.en.toLowerCase() === String(inputValue).toLowerCase() || o.numericValue === Number(inputValue)
    );
    if (!scaleOpt) return { score: 0, status: "not_evaluated" };

    const numVal = scaleOpt.numericValue;
    if (rule.optimalScaleValue !== undefined && numVal >= rule.optimalScaleValue) {
      return { score: 100, status: "achieved" };
    }
    if (rule.minScaleValue !== undefined) {
      if (numVal >= rule.minScaleValue) {
        const maxScale = Math.max(...(skill.scaleOptions?.map((o) => o.numericValue) || [1]));
        return { score: Math.round((numVal / maxScale) * 80 + 10), status: "pending" };
      }
      return { score: Math.round((numVal / rule.minScaleValue) * 30), status: "delayed" };
    }

    return { score: 50, status: "pending" };
  }

  return { score: 0, status: "not_evaluated" };
}

/**
 * Calculates a child's growth score based on provided inputs and rules.
 * This is a client-side utility that requires full skill and rule objects.
 */
export function calculateScore(
  request: ChildEvaluationRequest,
  allSkills: Skill[],
  allRules: ExpectedRule[],
  allCategories: any[]
): OverallScore {
  const ageGroupRules = allRules.filter(r => r.ageGroupId === request.ageGroupId);
  const evalResults: SkillEvaluation[] = [];

  for (const rule of ageGroupRules) {
    const skill = allSkills.find(s => s.id === rule.skillId);
    if (!skill) continue;

    const input = request.inputs.find((i) => i.skillId === rule.skillId);
    const { score, status } = evaluateSkill(skill, rule, input?.value);

    const tip = status === "delayed" || status === "pending"
      ? skill.improvementTips[0]
      : undefined;

    evalResults.push({
      skillId: skill.id,
      skillTitle: skill.title,
      categoryId: skill.categoryId,
      status,
      score,
      rawValue: input?.value,
      expectedRule: rule,
      recommendation: tip,
    });
  }

  // Calculate category scores
  const catScoreMap = new Map<string, { total: number; weightedSum: number; count: number; achieved: number }>();

  for (const ev of evalResults) {
    const skill = allSkills.find(s => s.id === ev.skillId);
    if (!skill) continue;

    if (!catScoreMap.has(ev.categoryId)) {
      catScoreMap.set(ev.categoryId, { total: 0, weightedSum: 0, count: 0, achieved: 0 });
    }
    const cat = catScoreMap.get(ev.categoryId)!;
    cat.total++;
    cat.count++;
    cat.weightedSum += ev.score * skill.weight;
    if (ev.status === "achieved") cat.achieved++;
  }

  const categoryScores: CategoryScore[] = [];
  for (const [catId, data] of catScoreMap) {
    const category = allCategories.find(c => c.id === catId);
    if (!category) continue;

    const totalWeight = evalResults
      .filter((e) => e.categoryId === catId)
      .reduce((sum, e) => {
        const s = allSkills.find(s => s.id === e.skillId);
        return sum + (s?.weight || 1);
      }, 0);

    const score = totalWeight > 0 ? Math.round(data.weightedSum / totalWeight) : 0;

    categoryScores.push({
      categoryId: catId,
      categoryName: category.name,
      color: category.color,
      score,
      totalSkills: data.total,
      evaluatedSkills: data.count,
      achievedSkills: data.achieved,
      label: getProgressLabel(score),
    });
  }

  const overallPct = categoryScores.length > 0
    ? Math.round(categoryScores.reduce((s, c) => s + c.score, 0) / categoryScores.length)
    : 0;

  return {
    percentage: overallPct,
    label: getProgressLabel(overallPct),
    categoryScores,
    skillEvaluations: evalResults,
    evaluatedAt: new Date().toISOString(),
  };
}

// ─── Matrix Export ──────────────────────────────────────────────────────────

export function exportMatrix(data: {
  ageGroups: any[];
  categories: any[];
  skills: any[];
  rules: any[];
}): MatrixExport {
  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    ageGroups: data.ageGroups,
    categories: data.categories,
    skills: data.skills,
    rules: data.rules,
    scoringConfig: SCORING_CONFIG,
  };
}
