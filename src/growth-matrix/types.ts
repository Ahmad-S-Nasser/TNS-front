// ─── Growth Matrix Type System ───────────────────────────────────────────────
// Data-driven child development evaluation engine for Tips & Steps.
// All types are designed to be serializable for API transport and
// consumable by both the admin panel and the mobile app.

// ─── Enums & Primitives ─────────────────────────────────────────────────────

export type MetricType = "boolean" | "numeric" | "scale";

export type SkillStatus = "achieved" | "pending" | "delayed" | "not_evaluated";

export type ProgressLabel = "excellent" | "good" | "needs_attention" | "critical";

export type AgeGroupStatus = "active" | "draft" | "archived";

// ─── Bilingual Text ──────────────────────────────────────────────────────────

export interface BilingualText {
  en: string;
  ar: string;
}

// ─── Scale Options (for scale metric type) ───────────────────────────────────

export interface ScaleOption {
  id: string;
  label: BilingualText;
  numericValue: number; // internal mapping, e.g. 1–4
}

// ─── Age Group ───────────────────────────────────────────────────────────────

export interface AgeGroup {
  id: string;
  label: BilingualText;
  monthStart: number;
  monthEnd: number;
  status: AgeGroupStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Growth Category ─────────────────────────────────────────────────────────

export interface GrowthCategory {
  id: string;
  name: BilingualText;
  description: BilingualText;
  iconKey: string; // lucide icon name for UI rendering
  color: string;   // hex color for visual distinction
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Skill / Milestone ──────────────────────────────────────────────────────

export interface Skill {
  id: string;
  categoryId: string;
  title: BilingualText;
  description: BilingualText;
  metricType: MetricType;
  scaleOptions?: ScaleOption[]; // only when metricType === "scale"
  unit?: string;                // only for numeric: "kg", "cm", "words", "minutes"
  weight: number;               // 1–10, importance factor for scoring
  improvementTips: BilingualText[];
  createdAt: string;
  updatedAt: string;
}

// ─── Expected Rule ──────────────────────────────────────────────────────────
// Links a skill to an age group with specific expectations.

export interface ExpectedRule {
  id: string;
  skillId: string;
  ageGroupId: string;
  expectedMonth: number; // at which month within the age group

  // For boolean metrics
  expectedBoolean?: boolean;

  // For numeric metrics
  minValue?: number;
  optimalMin?: number;
  optimalMax?: number;
  maxValue?: number;

  // For scale metrics
  minScaleValue?: number; // minimum numeric value from scale options
  optimalScaleValue?: number;

  createdAt: string;
  updatedAt: string;
}

// ─── Scoring Results ────────────────────────────────────────────────────────

export interface SkillEvaluation {
  skillId: string;
  skillTitle: BilingualText;
  categoryId: string;
  status: SkillStatus;
  score: number;        // 0–100
  rawValue: any;        // the value entered by the mother
  expectedRule: ExpectedRule;
  recommendation?: string;
}

export interface CategoryScore {
  categoryId: string;
  categoryName: BilingualText;
  color: string;
  score: number;         // 0–100 weighted average
  totalSkills: number;
  evaluatedSkills: number;
  achievedSkills: number;
  label: ProgressLabel;
}

export interface OverallScore {
  percentage: number;    // 0–100
  label: ProgressLabel;
  categoryScores: CategoryScore[];
  skillEvaluations: SkillEvaluation[];
  evaluatedAt: string;
}

// ─── Child Input Data (from mobile app) ─────────────────────────────────────

export interface ChildSkillInput {
  skillId: string;
  value: boolean | number | string; // depends on metric type
}

export interface ChildEvaluationRequest {
  childAgeMonths: number;
  ageGroupId: string;
  inputs: ChildSkillInput[];
}

// ─── Matrix Export (consumed by mobile app) ──────────────────────────────────

export interface MatrixExport {
  version: string;
  generatedAt: string;
  ageGroups: AgeGroup[];
  categories: GrowthCategory[];
  skills: Skill[];
  rules: ExpectedRule[];
  scoringConfig: {
    labelThresholds: {
      excellent: number;  // >= this value
      good: number;
      needsAttention: number;
      critical: number;   // below needsAttention
    };
  };
}

// ─── Form Types (for dialogs) ────────────────────────────────────────────────

export interface AgeGroupFormData {
  label: BilingualText;
  monthStart: number;
  monthEnd: number;
  status: AgeGroupStatus;
  description?: string;
}

export interface CategoryFormData {
  name: BilingualText;
  description: BilingualText;
  iconKey: string;
  color: string;
  sortOrder: number;
}

export interface SkillFormData {
  categoryId: string;
  title: BilingualText;
  description: BilingualText;
  metricType: MetricType;
  scaleOptions?: ScaleOption[];
  unit?: string;
  weight: number;
  improvementTips: BilingualText[];
}

export interface RuleFormData {
  skillId: string;
  ageGroupId: string;
  expectedMonth: number;
  expectedBoolean?: boolean;
  minValue?: number;
  optimalMin?: number;
  optimalMax?: number;
  maxValue?: number;
  minScaleValue?: number;
  optimalScaleValue?: number;
}
