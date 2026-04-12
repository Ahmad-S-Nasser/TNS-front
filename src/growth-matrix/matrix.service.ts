// ─── Growth Matrix Service Layer ─────────────────────────────────────────────
// Mock implementation with API-ready signatures.
// Replace internals with fetch/axios calls when backend is available.

import type {
  AgeGroup,
  GrowthCategory,
  Skill,
  ExpectedRule,
  OverallScore,
  CategoryScore,
  SkillEvaluation,
  ChildEvaluationRequest,
  MatrixExport,
  ProgressLabel,
  SkillStatus,
  AgeGroupFormData,
  CategoryFormData,
  SkillFormData,
  RuleFormData,
} from "./types";

// ─── Helper ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

// ─── Demo Data: Age Groups ──────────────────────────────────────────────────

let ageGroups: AgeGroup[] = [
  { id: "ag-1", label: { en: "0–3 months", ar: "٠-٣ أشهر" }, monthStart: 0, monthEnd: 3, status: "active", description: "Newborn phase", createdAt: now(), updatedAt: now() },
  { id: "ag-2", label: { en: "3–6 months", ar: "٣-٦ أشهر" }, monthStart: 3, monthEnd: 6, status: "active", description: "Early motor development", createdAt: now(), updatedAt: now() },
  { id: "ag-3", label: { en: "6–12 months", ar: "٦-١٢ شهر" }, monthStart: 6, monthEnd: 12, status: "active", description: "Exploration and attachment", createdAt: now(), updatedAt: now() },
  { id: "ag-4", label: { en: "12–18 months", ar: "١٢-١٨ شهر" }, monthStart: 12, monthEnd: 18, status: "active", description: "Early walking and words", createdAt: now(), updatedAt: now() },
  { id: "ag-5", label: { en: "18–24 months", ar: "١٨-٢٤ شهر" }, monthStart: 18, monthEnd: 24, status: "active", description: "Language explosion", createdAt: now(), updatedAt: now() },
  { id: "ag-6", label: { en: "2–3 years", ar: "٢-٣ سنوات" }, monthStart: 24, monthEnd: 36, status: "active", description: "Social play begins", createdAt: now(), updatedAt: now() },
  { id: "ag-7", label: { en: "3–5 years", ar: "٣-٥ سنوات" }, monthStart: 36, monthEnd: 60, status: "draft", description: "School readiness", createdAt: now(), updatedAt: now() },
];

// ─── Demo Data: Categories ──────────────────────────────────────────────────

let categories: GrowthCategory[] = [
  { id: "cat-1", name: { en: "Physical Growth", ar: "النمو الجسدي" }, description: { en: "Height, weight, head circumference tracking", ar: "متابعة الطول والوزن ومحيط الرأس" }, iconKey: "ruler", color: "#3B82F6", sortOrder: 1, createdAt: now(), updatedAt: now() },
  { id: "cat-2", name: { en: "Motor Skills", ar: "المهارات الحركية" }, description: { en: "Gross and fine motor development", ar: "تطور المهارات الحركية الكبرى والدقيقة" }, iconKey: "hand", color: "#8B5CF6", sortOrder: 2, createdAt: now(), updatedAt: now() },
  { id: "cat-3", name: { en: "Cognitive Growth", ar: "النمو المعرفي" }, description: { en: "Problem solving, memory, attention", ar: "حل المشكلات والذاكرة والانتباه" }, iconKey: "brain", color: "#F59E0B", sortOrder: 3, createdAt: now(), updatedAt: now() },
  { id: "cat-4", name: { en: "Language & Communication", ar: "اللغة والتواصل" }, description: { en: "Speech, vocabulary, comprehension", ar: "النطق والمفردات والفهم" }, iconKey: "messageCircle", color: "#10B981", sortOrder: 4, createdAt: now(), updatedAt: now() },
  { id: "cat-5", name: { en: "Social & Emotional", ar: "الاجتماعي والعاطفي" }, description: { en: "Attachment, empathy, emotional regulation", ar: "التعلق والتعاطف وتنظيم المشاعر" }, iconKey: "heart", color: "#EF4444", sortOrder: 5, createdAt: now(), updatedAt: now() },
];

// ─── Demo Data: Skills ──────────────────────────────────────────────────────

let skills: Skill[] = [
  // Physical Growth
  { id: "sk-1", categoryId: "cat-1", title: { en: "Weight tracking", ar: "متابعة الوزن" }, description: { en: "Child's weight in kilograms", ar: "وزن الطفل بالكيلوجرام" }, metricType: "numeric", unit: "kg", weight: 8, improvementTips: [{ en: "Ensure regular breastfeeding/formula", ar: "تأكدي من الرضاعة المنتظمة" }], createdAt: now(), updatedAt: now() },
  { id: "sk-2", categoryId: "cat-1", title: { en: "Height tracking", ar: "متابعة الطول" }, description: { en: "Child's height in centimeters", ar: "طول الطفل بالسنتيمتر" }, metricType: "numeric", unit: "cm", weight: 8, improvementTips: [{ en: "Nutrition is key for growth", ar: "التغذية السليمة ضرورية للنمو" }], createdAt: now(), updatedAt: now() },
  { id: "sk-3", categoryId: "cat-1", title: { en: "Head circumference", ar: "محيط الرأس" }, description: { en: "Head circumference in centimeters", ar: "محيط رأس الطفل بالسنتيمتر" }, metricType: "numeric", unit: "cm", weight: 7, improvementTips: [{ en: "Monitor at regular checkups", ar: "تابعي في الفحوصات الدورية" }], createdAt: now(), updatedAt: now() },

  // Motor Skills
  { id: "sk-4", categoryId: "cat-2", title: { en: "Holds head up", ar: "يرفع رأسه" }, description: { en: "Can hold head steady without support", ar: "يستطيع رفع رأسه بثبات دون مساعدة" }, metricType: "boolean", weight: 6, improvementTips: [{ en: "Tummy time exercises help strengthen neck muscles", ar: "تمارين وقت البطن تساعد على تقوية عضلات الرقبة" }], createdAt: now(), updatedAt: now() },
  { id: "sk-5", categoryId: "cat-2", title: { en: "Rolls over", ar: "يتقلب" }, description: { en: "Can roll from tummy to back and vice versa", ar: "يستطيع التقلب من بطنه إلى ظهره والعكس" }, metricType: "boolean", weight: 6, improvementTips: [{ en: "Place toys slightly to the side during tummy time", ar: "ضعي الألعاب بعيدًا قليلًا أثناء وقت البطن" }], createdAt: now(), updatedAt: now() },
  { id: "sk-6", categoryId: "cat-2", title: { en: "Sits without support", ar: "يجلس بدون مساعدة" }, description: { en: "Can sit upright independently", ar: "يستطيع الجلوس منتصبًا بمفرده" }, metricType: "boolean", weight: 7, improvementTips: [{ en: "Use pillows for support while practicing", ar: "استخدمي الوسائد للدعم أثناء التمرين" }], createdAt: now(), updatedAt: now() },
  { id: "sk-7", categoryId: "cat-2", title: { en: "Walks independently", ar: "يمشي بمفرده" }, description: { en: "Takes steps without holding anything", ar: "يخطو خطوات دون التمسك بشيء" }, metricType: "boolean", weight: 9, improvementTips: [{ en: "Encourage by holding hands and walking together", ar: "شجعيه بمسك يديه والمشي معًا" }], createdAt: now(), updatedAt: now() },
  { id: "sk-8", categoryId: "cat-2", title: { en: "Grasps objects", ar: "يمسك الأشياء" }, description: { en: "Can grab and hold small objects", ar: "يستطيع الإمساك بالأشياء الصغيرة" }, metricType: "boolean", weight: 5, improvementTips: [{ en: "Offer toys of different textures", ar: "قدمي ألعابًا بملمسات مختلفة" }], createdAt: now(), updatedAt: now() },

  // Cognitive
  { id: "sk-9", categoryId: "cat-3", title: { en: "Recognizes familiar faces", ar: "يتعرف على الوجوه المألوفة" }, description: { en: "Shows recognition of parents and caregivers", ar: "يُظهر تعرفه على الوالدين ومقدمي الرعاية" }, metricType: "boolean", weight: 6, improvementTips: [{ en: "Spend face-to-face time daily", ar: "خصصي وقتًا يوميًا وجهًا لوجه" }], createdAt: now(), updatedAt: now() },
  { id: "sk-10", categoryId: "cat-3", title: { en: "Object permanence", ar: "استمرارية الأشياء" }, description: { en: "Understands objects exist when hidden", ar: "يفهم أن الأشياء موجودة حتى عند إخفائها" }, metricType: "boolean", weight: 7, improvementTips: [{ en: "Play peek-a-boo regularly", ar: "العبي لعبة الاختباء بانتظام" }], createdAt: now(), updatedAt: now() },
  { id: "sk-11", categoryId: "cat-3", title: { en: "Attention span", ar: "مدة الانتباه" }, description: { en: "Duration of focused attention in minutes", ar: "مدة التركيز المستمر بالدقائق" }, metricType: "numeric", unit: "minutes", weight: 6, improvementTips: [{ en: "Limit screen time, engage with interactive play", ar: "قللي وقت الشاشة وشاركي باللعب التفاعلي" }], createdAt: now(), updatedAt: now() },
  { id: "sk-12", categoryId: "cat-3", title: { en: "Follows simple instructions", ar: "يتبع التعليمات البسيطة" }, description: { en: "Can follow one-step commands", ar: "يستطيع اتباع أوامر من خطوة واحدة" }, metricType: "boolean", weight: 7, improvementTips: [{ en: "Give clear, simple instructions during play", ar: "أعطي تعليمات واضحة وبسيطة أثناء اللعب" }], createdAt: now(), updatedAt: now() },

  // Language
  { id: "sk-13", categoryId: "cat-4", title: { en: "Babbles", ar: "يناغي" }, description: { en: "Makes consonant-vowel combinations", ar: "يصدر أصوات حروف متحركة وساكنة" }, metricType: "boolean", weight: 5, improvementTips: [{ en: "Talk and sing to your baby frequently", ar: "تحدثي وغنّي لطفلك بشكل متكرر" }], createdAt: now(), updatedAt: now() },
  { id: "sk-14", categoryId: "cat-4", title: { en: "First words", ar: "الكلمات الأولى" }, description: { en: "Says mama, baba, or other meaningful words", ar: "يقول ماما، بابا، أو كلمات ذات معنى" }, metricType: "boolean", weight: 8, improvementTips: [{ en: "Name objects and actions throughout the day", ar: "سمّي الأشياء والأفعال طوال اليوم" }], createdAt: now(), updatedAt: now() },
  { id: "sk-15", categoryId: "cat-4", title: { en: "Vocabulary size", ar: "حجم المفردات" }, description: { en: "Number of words the child can say", ar: "عدد الكلمات التي يستطيع الطفل نطقها" }, metricType: "numeric", unit: "words", weight: 8, improvementTips: [{ en: "Read books together every day", ar: "اقرأي الكتب معًا كل يوم" }], createdAt: now(), updatedAt: now() },
  { id: "sk-16", categoryId: "cat-4", title: { en: "Sentence formation", ar: "تكوين الجمل" }, description: { en: "Ability to form sentences", ar: "القدرة على تكوين جمل" }, metricType: "scale", scaleOptions: [{ id: "s1", label: { en: "None", ar: "لا يوجد" }, numericValue: 0 }, { id: "s2", label: { en: "2-word phrases", ar: "عبارات من كلمتين" }, numericValue: 1 }, { id: "s3", label: { en: "Simple sentences", ar: "جمل بسيطة" }, numericValue: 2 }, { id: "s4", label: { en: "Complex sentences", ar: "جمل مركبة" }, numericValue: 3 }], weight: 9, improvementTips: [{ en: "Model correct sentence structure", ar: "استخدمي جملاً صحيحة كنموذج" }], createdAt: now(), updatedAt: now() },

  // Social & Emotional
  { id: "sk-17", categoryId: "cat-5", title: { en: "Social smile", ar: "الابتسامة الاجتماعية" }, description: { en: "Smiles in response to faces and voices", ar: "يبتسم استجابة للوجوه والأصوات" }, metricType: "boolean", weight: 5, improvementTips: [{ en: "Smile and talk to your baby often", ar: "ابتسمي وتحدثي مع طفلك كثيرًا" }], createdAt: now(), updatedAt: now() },
  { id: "sk-18", categoryId: "cat-5", title: { en: "Stranger anxiety", ar: "قلق الغرباء" }, description: { en: "Shows wariness of unfamiliar people", ar: "يُظهر حذرًا من الأشخاص غير المألوفين" }, metricType: "boolean", weight: 4, improvementTips: [{ en: "Gradual exposure to new people in safe settings", ar: "التعرض التدريجي لأشخاص جدد في بيئة آمنة" }], createdAt: now(), updatedAt: now() },
  { id: "sk-19", categoryId: "cat-5", title: { en: "Plays with others", ar: "يلعب مع الآخرين" }, description: { en: "Engages in cooperative or parallel play", ar: "يشارك في اللعب التعاوني أو المتوازي" }, metricType: "scale", scaleOptions: [{ id: "s1", label: { en: "Solitary only", ar: "فردي فقط" }, numericValue: 0 }, { id: "s2", label: { en: "Parallel play", ar: "لعب متوازي" }, numericValue: 1 }, { id: "s3", label: { en: "Interactive play", ar: "لعب تفاعلي" }, numericValue: 2 }, { id: "s4", label: { en: "Cooperative play", ar: "لعب تعاوني" }, numericValue: 3 }], weight: 7, improvementTips: [{ en: "Arrange playdates with other children", ar: "رتبي لقاءات لعب مع أطفال آخرين" }], createdAt: now(), updatedAt: now() },
  { id: "sk-20", categoryId: "cat-5", title: { en: "Emotional regulation", ar: "تنظيم المشاعر" }, description: { en: "Ability to manage emotions appropriately", ar: "القدرة على إدارة المشاعر بشكل مناسب" }, metricType: "scale", scaleOptions: [{ id: "s1", label: { en: "Poor", ar: "ضعيف" }, numericValue: 1 }, { id: "s2", label: { en: "Developing", ar: "في تطور" }, numericValue: 2 }, { id: "s3", label: { en: "Good", ar: "جيد" }, numericValue: 3 }, { id: "s4", label: { en: "Excellent", ar: "ممتاز" }, numericValue: 4 }], weight: 8, improvementTips: [{ en: "Validate feelings, teach coping strategies", ar: "صادقي مشاعره وعلميه طرق التعامل" }], createdAt: now(), updatedAt: now() },
];

// ─── Demo Data: Rules ───────────────────────────────────────────────────────

let rules: ExpectedRule[] = [
  // 0–3 months rules
  { id: "r-1", skillId: "sk-1", ageGroupId: "ag-1", expectedMonth: 1, minValue: 3.0, optimalMin: 3.5, optimalMax: 5.5, maxValue: 6.5, createdAt: now(), updatedAt: now() },
  { id: "r-2", skillId: "sk-2", ageGroupId: "ag-1", expectedMonth: 1, minValue: 48, optimalMin: 50, optimalMax: 56, maxValue: 60, createdAt: now(), updatedAt: now() },
  { id: "r-3", skillId: "sk-3", ageGroupId: "ag-1", expectedMonth: 1, minValue: 33, optimalMin: 34, optimalMax: 38, maxValue: 40, createdAt: now(), updatedAt: now() },
  { id: "r-4", skillId: "sk-4", ageGroupId: "ag-1", expectedMonth: 2, expectedBoolean: true, createdAt: now(), updatedAt: now() },
  { id: "r-5", skillId: "sk-8", ageGroupId: "ag-1", expectedMonth: 3, expectedBoolean: true, createdAt: now(), updatedAt: now() },
  { id: "r-6", skillId: "sk-9", ageGroupId: "ag-1", expectedMonth: 2, expectedBoolean: true, createdAt: now(), updatedAt: now() },
  { id: "r-7", skillId: "sk-13", ageGroupId: "ag-1", expectedMonth: 3, expectedBoolean: true, createdAt: now(), updatedAt: now() },
  { id: "r-8", skillId: "sk-17", ageGroupId: "ag-1", expectedMonth: 2, expectedBoolean: true, createdAt: now(), updatedAt: now() },

  // 3–6 months rules
  { id: "r-9", skillId: "sk-1", ageGroupId: "ag-2", expectedMonth: 4, minValue: 5.0, optimalMin: 5.5, optimalMax: 8.0, maxValue: 9.0, createdAt: now(), updatedAt: now() },
  { id: "r-10", skillId: "sk-2", ageGroupId: "ag-2", expectedMonth: 4, minValue: 58, optimalMin: 60, optimalMax: 66, maxValue: 70, createdAt: now(), updatedAt: now() },
  { id: "r-11", skillId: "sk-5", ageGroupId: "ag-2", expectedMonth: 4, expectedBoolean: true, createdAt: now(), updatedAt: now() },
  { id: "r-12", skillId: "sk-6", ageGroupId: "ag-2", expectedMonth: 6, expectedBoolean: true, createdAt: now(), updatedAt: now() },
  { id: "r-13", skillId: "sk-10", ageGroupId: "ag-2", expectedMonth: 5, expectedBoolean: true, createdAt: now(), updatedAt: now() },
  { id: "r-14", skillId: "sk-18", ageGroupId: "ag-2", expectedMonth: 6, expectedBoolean: true, createdAt: now(), updatedAt: now() },

  // 6–12 months rules
  { id: "r-15", skillId: "sk-1", ageGroupId: "ag-3", expectedMonth: 9, minValue: 7.0, optimalMin: 7.5, optimalMax: 10.5, maxValue: 12.0, createdAt: now(), updatedAt: now() },
  { id: "r-16", skillId: "sk-2", ageGroupId: "ag-3", expectedMonth: 9, minValue: 66, optimalMin: 68, optimalMax: 76, maxValue: 80, createdAt: now(), updatedAt: now() },
  { id: "r-17", skillId: "sk-11", ageGroupId: "ag-3", expectedMonth: 9, minValue: 1, optimalMin: 2, optimalMax: 5, maxValue: 8, createdAt: now(), updatedAt: now() },
  { id: "r-18", skillId: "sk-14", ageGroupId: "ag-3", expectedMonth: 10, expectedBoolean: true, createdAt: now(), updatedAt: now() },

  // 12–18 months rules
  { id: "r-19", skillId: "sk-7", ageGroupId: "ag-4", expectedMonth: 14, expectedBoolean: true, createdAt: now(), updatedAt: now() },
  { id: "r-20", skillId: "sk-12", ageGroupId: "ag-4", expectedMonth: 15, expectedBoolean: true, createdAt: now(), updatedAt: now() },
  { id: "r-21", skillId: "sk-15", ageGroupId: "ag-4", expectedMonth: 15, minValue: 3, optimalMin: 5, optimalMax: 20, maxValue: 50, createdAt: now(), updatedAt: now() },

  // 18–24 months rules
  { id: "r-22", skillId: "sk-15", ageGroupId: "ag-5", expectedMonth: 21, minValue: 10, optimalMin: 20, optimalMax: 100, maxValue: 200, createdAt: now(), updatedAt: now() },
  { id: "r-23", skillId: "sk-16", ageGroupId: "ag-5", expectedMonth: 21, minScaleValue: 1, optimalScaleValue: 2, createdAt: now(), updatedAt: now() },
  { id: "r-24", skillId: "sk-19", ageGroupId: "ag-5", expectedMonth: 20, minScaleValue: 1, optimalScaleValue: 2, createdAt: now(), updatedAt: now() },
  { id: "r-25", skillId: "sk-20", ageGroupId: "ag-5", expectedMonth: 22, minScaleValue: 2, optimalScaleValue: 3, createdAt: now(), updatedAt: now() },

  // 2–3 years rules
  { id: "r-26", skillId: "sk-16", ageGroupId: "ag-6", expectedMonth: 30, minScaleValue: 2, optimalScaleValue: 3, createdAt: now(), updatedAt: now() },
  { id: "r-27", skillId: "sk-19", ageGroupId: "ag-6", expectedMonth: 28, minScaleValue: 2, optimalScaleValue: 3, createdAt: now(), updatedAt: now() },
  { id: "r-28", skillId: "sk-20", ageGroupId: "ag-6", expectedMonth: 30, minScaleValue: 3, optimalScaleValue: 4, createdAt: now(), updatedAt: now() },
];

// ─── Scoring Thresholds ─────────────────────────────────────────────────────

const SCORING_CONFIG = {
  labelThresholds: {
    excellent: 85,
    good: 65,
    needsAttention: 40,
    critical: 0,
  },
};

// ─── Age Group CRUD ─────────────────────────────────────────────────────────

export function getAgeGroups(): AgeGroup[] {
  return [...ageGroups].sort((a, b) => a.monthStart - b.monthStart);
}

export function getAgeGroupById(id: string): AgeGroup | undefined {
  return ageGroups.find((ag) => ag.id === id);
}

export function createAgeGroup(data: AgeGroupFormData): AgeGroup {
  const ag: AgeGroup = { id: `ag-${uid()}`, ...data, createdAt: now(), updatedAt: now() };
  ageGroups.push(ag);
  return ag;
}

export function updateAgeGroup(id: string, data: Partial<AgeGroupFormData>): AgeGroup | undefined {
  const idx = ageGroups.findIndex((ag) => ag.id === id);
  if (idx === -1) return undefined;
  ageGroups[idx] = { ...ageGroups[idx], ...data, updatedAt: now() };
  return ageGroups[idx];
}

export function deleteAgeGroup(id: string): boolean {
  const len = ageGroups.length;
  ageGroups = ageGroups.filter((ag) => ag.id !== id);
  rules = rules.filter((r) => r.ageGroupId !== id);
  return ageGroups.length < len;
}

// ─── Category CRUD ──────────────────────────────────────────────────────────

export function getCategories(): GrowthCategory[] {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryById(id: string): GrowthCategory | undefined {
  return categories.find((c) => c.id === id);
}

export function createCategory(data: CategoryFormData): GrowthCategory {
  const cat: GrowthCategory = { id: `cat-${uid()}`, ...data, createdAt: now(), updatedAt: now() };
  categories.push(cat);
  return cat;
}

export function updateCategory(id: string, data: Partial<CategoryFormData>): GrowthCategory | undefined {
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  categories[idx] = { ...categories[idx], ...data, updatedAt: now() };
  return categories[idx];
}

// ─── Skill CRUD ─────────────────────────────────────────────────────────────

export function getSkills(): Skill[] {
  return [...skills];
}

export function getSkillsByCategory(categoryId: string): Skill[] {
  return skills.filter((s) => s.categoryId === categoryId);
}

export function getSkillsByAgeGroup(ageGroupId: string): Skill[] {
  const ruleSkillIds = rules.filter((r) => r.ageGroupId === ageGroupId).map((r) => r.skillId);
  return skills.filter((s) => ruleSkillIds.includes(s.id));
}

export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}

export function createSkill(data: SkillFormData): Skill {
  const skill: Skill = { id: `sk-${uid()}`, ...data, createdAt: now(), updatedAt: now() };
  skills.push(skill);
  return skill;
}

export function updateSkill(id: string, data: Partial<SkillFormData>): Skill | undefined {
  const idx = skills.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  skills[idx] = { ...skills[idx], ...data, updatedAt: now() };
  return skills[idx];
}

export function deleteSkill(id: string): boolean {
  const len = skills.length;
  skills = skills.filter((s) => s.id !== id);
  rules = rules.filter((r) => r.skillId !== id);
  return skills.length < len;
}

// ─── Rules CRUD ─────────────────────────────────────────────────────────────

export function getRules(): ExpectedRule[] {
  return [...rules];
}

export function getRulesByAgeGroup(ageGroupId: string): ExpectedRule[] {
  return rules.filter((r) => r.ageGroupId === ageGroupId);
}

export function getRuleBySkillAndAgeGroup(skillId: string, ageGroupId: string): ExpectedRule | undefined {
  return rules.find((r) => r.skillId === skillId && r.ageGroupId === ageGroupId);
}

export function saveRule(data: RuleFormData): ExpectedRule {
  const existing = rules.findIndex((r) => r.skillId === data.skillId && r.ageGroupId === data.ageGroupId);
  if (existing !== -1) {
    rules[existing] = { ...rules[existing], ...data, updatedAt: now() };
    return rules[existing];
  }
  const rule: ExpectedRule = { id: `r-${uid()}`, ...data, createdAt: now(), updatedAt: now() };
  rules.push(rule);
  return rule;
}

export function deleteRule(id: string): boolean {
  const len = rules.length;
  rules = rules.filter((r) => r.id !== id);
  return rules.length < len;
}

// ─── Scoring Engine ─────────────────────────────────────────────────────────

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

export function calculateScore(request: ChildEvaluationRequest): OverallScore {
  const ageGroupRules = getRulesByAgeGroup(request.ageGroupId);
  const evalResults: SkillEvaluation[] = [];

  for (const rule of ageGroupRules) {
    const skill = getSkillById(rule.skillId);
    if (!skill) continue;

    const input = request.inputs.find((i) => i.skillId === rule.skillId);
    const { score, status } = evaluateSkill(skill, rule, input?.value);

    const tip = status === "delayed" || status === "pending"
      ? skill.improvementTips[0]?.en
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
    const skill = getSkillById(ev.skillId);
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
    const category = getCategoryById(catId);
    if (!category) continue;

    const totalWeight = evalResults
      .filter((e) => e.categoryId === catId)
      .reduce((sum, e) => {
        const s = getSkillById(e.skillId);
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
    evaluatedAt: now(),
  };
}

// ─── Matrix Export ──────────────────────────────────────────────────────────

export function exportMatrix(ageGroupId?: string): MatrixExport {
  const filteredRules = ageGroupId ? rules.filter((r) => r.ageGroupId === ageGroupId) : rules;
  const relatedSkillIds = new Set(filteredRules.map((r) => r.skillId));
  const filteredSkills = skills.filter((s) => relatedSkillIds.has(s.id));
  const relatedCategoryIds = new Set(filteredSkills.map((s) => s.categoryId));
  const filteredCategories = categories.filter((c) => relatedCategoryIds.has(c.id));
  const filteredAgeGroups = ageGroupId
    ? ageGroups.filter((ag) => ag.id === ageGroupId)
    : ageGroups.filter((ag) => ag.status === "active");

  return {
    version: "1.0.0",
    generatedAt: now(),
    ageGroups: filteredAgeGroups,
    categories: filteredCategories,
    skills: filteredSkills,
    rules: filteredRules,
    scoringConfig: SCORING_CONFIG,
  };
}

// ─── Stats Helpers ──────────────────────────────────────────────────────────

export function getMatrixStats() {
  const activeAgeGroups = ageGroups.filter((ag) => ag.status === "active").length;
  const totalSkills = skills.length;
  const totalCategories = categories.length;
  const totalRules = rules.length;

  // Coverage: what % of possible skill×ageGroup combos have rules
  const possibleCombos = totalSkills * activeAgeGroups;
  const coverage = possibleCombos > 0 ? Math.round((totalRules / possibleCombos) * 100) : 0;

  // Skills per category
  const skillsPerCategory = categories.map((cat) => ({
    categoryId: cat.id,
    categoryName: cat.name.en,
    color: cat.color,
    count: skills.filter((s) => s.categoryId === cat.id).length,
  }));

  // Coverage by age group
  const coverageByAgeGroup = ageGroups
    .filter((ag) => ag.status === "active")
    .map((ag) => {
      const agRules = rules.filter((r) => r.ageGroupId === ag.id);
      return {
        ageGroupId: ag.id,
        label: ag.label.en,
        rulesCount: agRules.length,
        coverage: totalSkills > 0 ? Math.round((agRules.length / totalSkills) * 100) : 0,
      };
    });

  return {
    activeAgeGroups,
    totalSkills,
    totalCategories,
    totalRules,
    coverage,
    skillsPerCategory,
    coverageByAgeGroup,
  };
}
