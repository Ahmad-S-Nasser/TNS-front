// ─── CMS Service Layer ────────────────────────────────────────────────────────
// Mock implementation with API-ready signatures.
// All functions follow REST semantics — swap internals for fetch/axios calls.

import type {
  CMSSection, CMSContent, ContentStatus, SectionConfig, SectionStats,
  CMSExportPayload, BehavioralContent, NutritionContent,
  SexualEducationContent, EducationalGameContent, HospitalContent,
  HealthUnitContent, EmergencyContent,
} from "./cms.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

// ─── Section Configuration ────────────────────────────────────────────────────

export const SECTION_CONFIGS: SectionConfig[] = [
  {
    key: "behavioral",
    label_ar: "المشكلات السلوكية",
    label_en: "Behavioral Problems",
    description_ar: "إدارة محتوى المشكلات السلوكية عند الأطفال",
    description_en: "Manage behavioral problem content for children",
    icon: "brain",
    color: "#EF4444",
    gradient: "from-red-500 to-rose-600",
    requires_doctor_approval: true,
    requires_admin_approval: false,
    allowed_roles: ["SUPER_ADMIN", "MANAGER", "MARKETING", "DOCTOR"],
  },
  {
    key: "psychological",
    label_ar: "المشكلات النفسية",
    label_en: "Psychological Problems",
    description_ar: "إدارة محتوى الدعم النفسي للأطفال والأسرة",
    description_en: "Manage psychological support content for children and families",
    icon: "heart-handshake",
    color: "#8B5CF6",
    gradient: "from-violet-500 to-purple-600",
    requires_doctor_approval: true,
    requires_admin_approval: false,
    allowed_roles: ["SUPER_ADMIN", "MANAGER", "MARKETING", "DOCTOR"],
  },
  {
    key: "nutrition",
    label_ar: "التغذية السليمة",
    label_en: "Healthy Nutrition",
    description_ar: "إرشادات التغذية السليمة حسب المرحلة العمرية",
    description_en: "Age-specific healthy nutrition guides and meal plans",
    icon: "apple",
    color: "#10B981",
    gradient: "from-emerald-500 to-teal-600",
    requires_doctor_approval: false,
    requires_admin_approval: false,
    allowed_roles: ["SUPER_ADMIN", "MANAGER", "MARKETING", "DOCTOR"],
  },
  {
    key: "sexual-education",
    label_ar: "التثقيف الجنسي",
    label_en: "Sexual Education",
    description_ar: "محتوى تثقيفي حساس مقيد بالفئة العمرية",
    description_en: "Age-gated sensitive educational content for parents and children",
    icon: "shield-check",
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-600",
    requires_doctor_approval: true,
    requires_admin_approval: true,
    allowed_roles: ["SUPER_ADMIN", "MANAGER", "DOCTOR"],
  },
  {
    key: "educational-games",
    label_ar: "ألعاب تعليمية",
    label_en: "Educational Games",
    description_ar: "ألعاب تعليمية وتنموية حسب المرحلة العمرية",
    description_en: "Developmental and educational games by age group",
    icon: "puzzle",
    color: "#3B82F6",
    gradient: "from-blue-500 to-indigo-600",
    requires_doctor_approval: false,
    requires_admin_approval: false,
    allowed_roles: ["SUPER_ADMIN", "MANAGER", "MARKETING", "DOCTOR"],
  },
  {
    key: "hospitals",
    label_ar: "المستشفيات",
    label_en: "Hospitals",
    description_ar: "دليل المستشفيات وتخصصاتها وبيانات الاتصال",
    description_en: "Hospital directory with specializations and contact info",
    icon: "building-2",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-sky-600",
    requires_doctor_approval: false,
    requires_admin_approval: true,
    allowed_roles: ["SUPER_ADMIN", "MANAGER"],
  },
  {
    key: "health-units",
    label_ar: "وحدات صحية",
    label_en: "Health Units",
    description_ar: "الوحدات الصحية والخدمات المقدمة وأوقات العمل",
    description_en: "Health unit locations, services, and working hours",
    icon: "cross",
    color: "#14B8A6",
    gradient: "from-teal-500 to-cyan-600",
    requires_doctor_approval: false,
    requires_admin_approval: true,
    allowed_roles: ["SUPER_ADMIN", "MANAGER"],
  },
  {
    key: "emergency",
    label_ar: "الطوارئ",
    label_en: "Emergency",
    description_ar: "أرقام الطوارئ والإرشادات الفورية للوالدين",
    description_en: "Emergency numbers and immediate guidance for parents",
    icon: "siren",
    color: "#F43F5E",
    gradient: "from-rose-500 to-red-700",
    requires_doctor_approval: false,
    requires_admin_approval: true,
    allowed_roles: ["SUPER_ADMIN", "MANAGER"],
  },
  {
    key: "vaccines",
    label_ar: "اللقاحات",
    label_en: "Vaccines",
    description_ar: "برامج التطعيم الإجبارية والاختيارية للأطفال",
    description_en: "Mandatory and optional childhood vaccination programs",
    icon: "syringe",
    color: "#0D9488",
    gradient: "from-teal-500 to-emerald-600",
    requires_doctor_approval: true,
    requires_admin_approval: false,
    allowed_roles: ["SUPER_ADMIN", "MANAGER", "DOCTOR"],
  },
];

export function getSectionConfig(key: CMSSection): SectionConfig {
  return SECTION_CONFIGS.find(s => s.key === key)!;
}

// ─── Mock Data Store ──────────────────────────────────────────────────────────

let store: CMSContent[] = [
  // ── Behavioral ──────────────────────────────────────────────────────────────
  {
    id: "beh-1", section: "behavioral", status: "published",
    title_ar: "نوبات الغضب والعدوانية",
    title_en: "Temper Tantrums & Aggression",
    description_ar: "دليل شامل للتعامل مع نوبات الغضب عند الأطفال",
    description_en: "Comprehensive guide for handling children's temper tantrums",
    problem_type: "Aggression", severity: "moderate",
    symptoms: ["الصراخ المفرط", "الضرب", "العض", "رمي الأشياء"],
    age_range: { min_months: 18, max_months: 60 },
    causes: ["الإحباط", "التعب", "الجوع", "عدم القدرة على التعبير اللفظي"],
    recommended_actions: ["الهدوء التام", "تجنب الصراخ", "تحديد الحدود بوضوح", "التعاطف المشروط"],
    seek_help_when: "إذا استمرت النوبات بعد سن 5 سنوات أو اشتملت على إيذاء النفس",
    visibility: { age_categories: ["toddler", "preschool"], requires_login: false },
    requires_doctor_approval: true, requires_admin_approval: false,
    created_by: "Dr. Hana", created_at: now(), updated_at: now(), tags: ["behavior", "tantrums"],
  } as BehavioralContent,
  {
    id: "beh-2", section: "behavioral", status: "draft",
    title_ar: "اضطراب فرط الحركة وتشتت الانتباه (ADHD)",
    title_en: "ADHD – Attention Deficit Hyperactivity Disorder",
    description_ar: "فهم اضطراب ADHD وكيفية التعامل معه في المنزل والمدرسة",
    description_en: "Understanding ADHD and how to handle it at home and school",
    problem_type: "ADHD", severity: "moderate",
    symptoms: ["صعوبة التركيز", "فرط النشاط", "الاندفاعية", "الفوضى التنظيمية"],
    age_range: { min_months: 48, max_months: 144 },
    causes: ["عوامل وراثية", "اختلالات كيميائية في الدماغ"],
    recommended_actions: ["الإدارة البيئية", "برامج التعديل السلوكي", "التنسيق مع المدرسة"],
    seek_help_when: "عند ملاحظة الأعراض بشكل واضح في أكثر من بيئة واحدة",
    visibility: { age_categories: ["preschool", "school-age"], requires_login: false },
    requires_doctor_approval: true, requires_admin_approval: false,
    created_by: "Dr. Khalid", created_at: now(), updated_at: now(), tags: ["ADHD", "attention"],
  } as BehavioralContent,

  // ── Psychological ──────────────────────────────────────────────────────────
  {
    id: "psy-1", section: "psychological", status: "published",
    title_ar: "القلق الاجتماعي عند الأطفال",
    title_en: "Social Anxiety in Children",
    description_ar: "التعرف على القلق الاجتماعي وأساليب المساعدة",
    description_en: "Recognizing social anxiety and helping strategies",
    problem_type: "Social Anxiety", severity: "mild",
    symptoms: ["الخوف من المواقف الاجتماعية", "الانسحاب", "الأعراض الجسدية"],
    age_range: { min_months: 36, max_months: 144 },
    causes: ["الخجل الطبيعي", "تجارب سلبية سابقة", "ضغط الأقران"],
    recommended_actions: ["التعرض التدريجي", "المديح والتشجيع", "لعب الدور"],
    seek_help_when: "إذا أعاق القلق الأنشطة اليومية أو الدراسة",
    visibility: { age_categories: ["preschool", "school-age"], requires_login: false },
    requires_doctor_approval: true, requires_admin_approval: false,
    created_by: "Dr. Hana", created_at: now(), updated_at: now(), tags: ["anxiety", "social"],
  } as BehavioralContent,

  // ── Nutrition ──────────────────────────────────────────────────────────────
  {
    id: "nut-1", section: "nutrition", status: "published",
    title_ar: "وجبات الرضع (0-6 أشهر)",
    title_en: "Infant Feeding (0-6 months)",
    description_ar: "إرشادات الرضاعة والتغذية للرضع في أول 6 أشهر",
    description_en: "Breastfeeding and feeding guidelines for infants in the first 6 months",
    age_group: "infant", meal_type: "supplement",
    recommended_foods: ["حليب الأم", "حليب الأطفال الصناعي"],
    restricted_foods: ["الأطعمة الصلبة", "العسل", "الملح", "السكر"],
    tips: ["الرضاعة الطبيعية مثالية ومحمية صحيًا", "أرضعي كلما طلب الطفل"],
    has_images: false,
    visibility: { age_categories: ["infant"], requires_login: false },
    requires_doctor_approval: false, requires_admin_approval: false,
    created_by: "Marketing", created_at: now(), updated_at: now(), tags: ["infant", "breastfeeding"],
  } as NutritionContent,
  {
    id: "nut-2", section: "nutrition", status: "review",
    title_ar: "الأطعمة المناسبة للطفولة المبكرة (1-3 سنوات)",
    title_en: "Foods for Early Childhood (1-3 years)",
    description_ar: "خطة تغذية متوازنة للأطفال من سنة إلى ثلاث سنوات",
    description_en: "Balanced nutrition plan for children aged 1-3 years",
    age_group: "toddler", meal_type: "lunch",
    recommended_foods: ["الخضار المطبوخة", "الفواكه الطرية", "الحبوب الكاملة", "البروتين الخفيف"],
    restricted_foods: ["الأطعمة المقلية", "مشروبات الطاقة", "الحلوى المصنعة"],
    tips: ["قدمي وجبات صغيرة ومتكررة", "اتركي الطفل يستكشف الطعام"],
    has_images: true,
    visibility: { age_categories: ["toddler"], requires_login: false },
    requires_doctor_approval: false, requires_admin_approval: false,
    created_by: "Marketing", created_at: now(), updated_at: now(), tags: ["toddler", "nutrition"],
  } as NutritionContent,

  // ── Sexual Education ───────────────────────────────────────────────────────
  {
    id: "sex-1", section: "sexual-education", status: "approved",
    title_ar: "الجسم والخصوصية (مرحلة الطفولة)",
    title_en: "Body & Privacy (Early Childhood)",
    description_ar: "تعليم الطفل أجزاء جسمه والفرق بين اللمس الآمن وغير الآمن",
    description_en: "Teaching children about body parts and the difference between safe and unsafe touch",
    age_category: "toddler", education_level: "basic",
    is_sensitive: true,
    parent_explanation: "هذا المحتوى يساعدك على تثقيف طفلك حول جسمه بطريقة مناسبة لعمره",
    child_appropriate_language: "جسمك ملكك وحدك. لا أحد يلمس مناطق المايوه إلا الطبيب بوجود ماما أو بابا.",
    professional_review_required: true,
    visibility: { age_categories: ["toddler", "preschool"], requires_login: true },
    requires_doctor_approval: true, requires_admin_approval: true,
    created_by: "Dr. Hana", created_at: now(), updated_at: now(), tags: ["safety", "body-awareness"],
  } as SexualEducationContent,

  // ── Educational Games ──────────────────────────────────────────────────────
  {
    id: "game-1", section: "educational-games", status: "published",
    title_ar: "لعبة الذاكرة بالصور",
    title_en: "Picture Memory Game",
    description_ar: "لعبة تقوي الذاكرة والتركيز عند الأطفال",
    description_en: "A game that strengthens memory and concentration in children",
    target_age: "preschool", game_category: "cognitive",
    instructions: "اطبعي بطاقات مزدوجة الصور. اقلبيها على الطاولة. يتناوب اللاعبون لقلب بطاقتين ومطابقتهما.",
    materials: ["بطاقات مصورة", "طاولة مستوية"],
    duration_minutes: 20, difficulty: "easy",
    can_play_solo: false, players_min: 2, players_max: 6,
    educational_outcomes: ["تقوية الذاكرة البصرية", "التركيز", "الصبر"],
    visibility: { age_categories: ["preschool", "school-age"], requires_login: false },
    requires_doctor_approval: false, requires_admin_approval: false,
    created_by: "Marketing", created_at: now(), updated_at: now(), tags: ["memory", "cognitive"],
  } as EducationalGameContent,
  {
    id: "game-2", section: "educational-games", status: "draft",
    title_ar: "تمرين التوازن الحركي",
    title_en: "Balance Motor Exercise",
    description_ar: "تمارين بسيطة لتطوير التوازن والتناسق الحركي",
    description_en: "Simple exercises to develop balance and motor coordination",
    target_age: "toddler", game_category: "motor",
    instructions: "رتبي أحجارًا أو مناشف على الأرض. اطلبي من طفلك المشي عليها دون الخروج عنها.",
    materials: ["أحجار ناعمة أو مناشف"],
    duration_minutes: 15, difficulty: "easy",
    can_play_solo: true, players_min: 1, players_max: 4,
    educational_outcomes: ["التوازن", "التناسق الحركي", "الثقة بالنفس"],
    visibility: { age_categories: ["toddler", "preschool"], requires_login: false },
    requires_doctor_approval: false, requires_admin_approval: false,
    created_by: "Marketing", created_at: now(), updated_at: now(), tags: ["motor", "balance"],
  } as EducationalGameContent,

  // ── Hospitals ──────────────────────────────────────────────────────────────
  {
    id: "hosp-1", section: "hospitals", status: "published",
    title_ar: "مستشفى القاهرة التخصصي للأطفال",
    title_en: "Cairo Children's Specialty Hospital",
    description_ar: "مستشفى متخصص في طب الأطفال بكافة التخصصات",
    description_en: "Specialty pediatric hospital covering all children's medical specialties",
    hospital_name_ar: "مستشفى القاهرة التخصصي للأطفال",
    hospital_name_en: "Cairo Children's Specialty Hospital",
    city: "القاهرة", address: "حي مصر الجديدة، القاهرة",
    coordinates: { lat: 30.0902, lng: 31.3361 },
    specializations: ["طب الأطفال", "القلب", "الأعصاب", "جراحة الأطفال"],
    is_24_7: true,
    contact_numbers: ["0222345678", "01001234567"],
    services: ["طوارئ", "عيادات خارجية", "入院", "عمليات جراحية"],
    has_children_ward: true, has_emergency: true, distance_km: 5.2,
    visibility: { age_categories: ["all"], requires_login: false },
    requires_doctor_approval: false, requires_admin_approval: true,
    created_by: "Super Admin", created_at: now(), updated_at: now(), tags: ["cairo", "pediatric"],
  } as HospitalContent,

  // ── Health Units ───────────────────────────────────────────────────────────
  {
    id: "unit-1", section: "health-units", status: "published",
    title_ar: "وحدة صحة الطفل - مدينة نصر",
    title_en: "Child Health Unit – Nasr City",
    description_ar: "وحدة صحية متكاملة تقدم خدمات رعاية الطفل مجانًا",
    description_en: "Integrated health unit providing free child care services",
    unit_name_ar: "وحدة صحة الطفل - مدينة نصر",
    unit_name_en: "Child Health Unit – Nasr City",
    city: "القاهرة", address: "شارع عباس العقاد، مدينة نصر",
    coordinates: { lat: 30.0586, lng: 31.3418 },
    services_offered: ["متابعة نمو الطفل", "تطعيمات", "استشارات تغذية"],
    is_free: true, has_vaccination: true,
    vaccination_types: ["شلل الأطفال", "الكبد الوبائي", "الحصبة"],
    working_hours: "8:00 ص - 2:00 م",
    working_days: "الأحد - الخميس", contact_number: "0224567890",
    visibility: { age_categories: ["all"], requires_login: false },
    requires_doctor_approval: false, requires_admin_approval: true,
    created_by: "Super Admin", created_at: now(), updated_at: now(), tags: ["nasr-city", "free", "vaccination"],
  } as HealthUnitContent,

  // ── Emergency ──────────────────────────────────────────────────────────────
  {
    id: "emg-1", section: "emergency", status: "published",
    title_ar: "إسعاف - الطوارئ الطبية",
    title_en: "Ambulance – Medical Emergency",
    description_ar: "رقم الإسعاف الوطني للطوارئ الطبية على مدار الساعة",
    description_en: "National ambulance number for medical emergencies around the clock",
    emergency_type: "ambulance", phone_number: "123",
    is_24_7: true,
    notes_for_parents: "اتصلي فورًا إذا كان طفلك يعاني من صعوبة في التنفس أو فقدان الوعي أو تشنجات",
    icon: "ambulance", color: "#EF4444",
    region: "مصر",
    when_to_call: "صعوبة التنفس، فقدان الوعي، التشنجات، الحروق الشديدة",
    visibility: { age_categories: ["all"], requires_login: false },
    requires_doctor_approval: false, requires_admin_approval: true,
    created_by: "Super Admin", created_at: now(), updated_at: now(), tags: ["ambulance", "emergency"],
  } as EmergencyContent,
  {
    id: "emg-2", section: "emergency", status: "published",
    title_ar: "خط نجدة الطفل",
    title_en: "Child Protection Hotline",
    description_ar: "خط ساخن لحماية الطفل من الإساءة والإهمال",
    description_en: "Hotline for child protection from abuse and neglect",
    emergency_type: "child-protection", phone_number: "16000",
    is_24_7: true,
    notes_for_parents: "اتصلي إذا شعرت أن طفلك بخطر أو يتعرض لإساءة بأي شكل",
    icon: "shield", color: "#8B5CF6",
    region: "مصر",
    when_to_call: "الإساءة الجسدية أو النفسية، الإهمال، الاستغلال",
    visibility: { age_categories: ["all"], requires_login: false },
    requires_doctor_approval: false, requires_admin_approval: true,
    created_by: "Super Admin", created_at: now(), updated_at: now(), tags: ["child-protection", "abuse"],
  } as EmergencyContent,

  // ── Vaccines ──────────────────────────────────────────────────────────────
  {
    id: "vac-1", section: "vaccines", status: "published",
    title_ar: "لقاح شلل الأطفال (OPV)",
    title_en: "Polio Vaccine (OPV)",
    description_ar: "اللقاح الفموي لشلل الأطفال - إلزامي",
    description_en: "Oral Polio Vaccine - Mandatory government program",
    vaccine_type: "FREE", dose_count: 5,
    age_schedule: ["at-birth", "2m", "4m", "6m", "12m"],
    dose_info_ar: "نقطتان بالفم",
    dose_info_en: "Two drops orally",
    importance_ar: "يقي من مرض شلل الأطفال الذي يسبب إعاقة دائمة",
    importance_en: "Prevents Poliomyelitis which causes permanent paralysis",
    prevented_diseases_ar: ["شلل الأطفال"],
    prevented_diseases_en: ["Polio"],
    risks_of_missing_ar: "خطر الإصابة بالشلل الدائم والمضاعفات الخطيرة",
    risks_of_missing_en: "Risk of lifelong paralysis and severe complications",
    side_effects: [
      { id: "se-1", effect_ar: "حرارة خفيفة", effect_en: "Mild fever", handling_ar: "خافض حرارة عند الحاجة", handling_en: "Antipyretics if needed", is_serious: false }
    ],
    warning_signs_ar: ["صعوبة في التنفس", "قيء مستمر"],
    warning_signs_en: ["Difficulty breathing", "Persistent vomiting"],
    medical_review_required: true,
    visibility: { age_categories: ["infant"], requires_login: false },
    requires_doctor_approval: true, requires_admin_approval: false,
    created_by: "Dr. Hana", created_at: now(), updated_at: now(), tags: ["mandatory", "polio"],
  } as any,
  {
    id: "vac-2", section: "vaccines", status: "draft",
    title_ar: "لقاح الروتا (Rotavirus)",
    title_en: "Rotavirus Vaccine",
    description_ar: "لقاح الروتا الموصى به - اختياري/مدفوع",
    description_en: "Recommended Rotavirus vaccine - Optional/Private",
    vaccine_type: "PAID", price: 450, currency: "EGP", dose_count: 2,
    age_schedule: ["2m", "4m"],
    dose_info_ar: "جرعة فموية",
    dose_info_en: "Oral dose",
    importance_ar: "يقي من النزلات المعوية الشديدة والجفاف الناتج عن فيروس روتا",
    importance_en: "Prevents severe viral gastroenteritis and dehydration caused by Rotavirus",
    prevented_diseases_ar: ["فيروس روتا", "النزلات المعوية"],
    prevented_diseases_en: ["Rotavirus", "Gastroenteritis"],
    risks_of_missing_ar: "النزلات المعوية الحادة والجفاف الشديد والمستمر",
    risks_of_missing_en: "Severe gastroenteritis and chronic dehydration risk",
    side_effects: [
      { id: "se-2", effect_ar: "إسهال خفيف", effect_en: "Mild diarrhea", handling_ar: "متابعة السوائل", handling_en: "Monitor fluid intake", is_serious: false }
    ],
    warning_signs_ar: ["خمول شديد", "آلام بطن حادة"],
    warning_signs_en: ["Excessive lethargy", "Severe abdominal pain"],
    available_places: ["hosp-1"],
    medical_review_required: true,
    visibility: { age_categories: ["infant"], requires_login: false },
    requires_doctor_approval: true, requires_admin_approval: false,
    created_by: "Dr. Hana", created_at: now(), updated_at: now(), tags: ["optional", "rotavirus"],
  } as any,
];

// ─── Status Lifecycle ─────────────────────────────────────────────────────────

const statusFlow: Record<ContentStatus, ContentStatus | null> = {
  draft: "review",
  review: "approved",
  approved: "published",
  published: null,
  archived: null,
};

// ─── CRUD Operations ──────────────────────────────────────────────────────────

export function getAllContent(section?: CMSSection, status?: ContentStatus): CMSContent[] {
  let result = [...store];
  if (section) result = result.filter(c => c.section === section);
  if (status) result = result.filter(c => c.status === status);
  return result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export function getContentById(id: string): CMSContent | undefined {
  return store.find(c => c.id === id);
}

export function createContent(data: Omit<CMSContent, "id" | "created_at" | "updated_at">): CMSContent {
  const entry = {
    ...data,
    id: `${data.section.slice(0, 3)}-${uid()}`,
    created_at: now(),
    updated_at: now(),
    status: "draft" as ContentStatus,
  } as CMSContent;
  store.push(entry);
  return entry;
}

export function updateContent(id: string, data: Partial<CMSContent>): CMSContent | undefined {
  const idx = store.findIndex(c => c.id === id);
  if (idx === -1) return undefined;
  store[idx] = { ...store[idx], ...data, updated_at: now() } as CMSContent;
  return store[idx];
}

export function deleteContent(id: string): boolean {
  const len = store.length;
  store = store.filter(c => c.id !== id);
  return store.length < len;
}

export function promoteStatus(id: string): CMSContent | undefined {
  const entry = store.find(c => c.id === id);
  if (!entry) return undefined;
  const next = statusFlow[entry.status];
  if (!next) return entry;
  return updateContent(id, {
    status: next,
    published_at: next === "published" ? now() : entry.published_at,
  } as Partial<CMSContent>);
}

export function archiveContent(id: string): CMSContent | undefined {
  return updateContent(id, { status: "archived" } as Partial<CMSContent>);
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getSectionStats(): SectionStats[] {
  return SECTION_CONFIGS.map(cfg => {
    const entries = store.filter(c => c.section === cfg.key);
    return {
      section: cfg.key,
      total: entries.length,
      published: entries.filter(c => c.status === "published").length,
      draft: entries.filter(c => c.status === "draft").length,
      review: entries.filter(c => c.status === "review").length,
      approved: entries.filter(c => c.status === "approved").length,
      archived: entries.filter(c => c.status === "archived").length,
    };
  });
}

export function getOverallStats() {
  return {
    total: store.length,
    published: store.filter(c => c.status === "published").length,
    draft: store.filter(c => c.status === "draft").length,
    review: store.filter(c => c.status === "review").length,
    approved: store.filter(c => c.status === "approved").length,
  };
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function exportSection(section: CMSSection, publishedOnly = true): CMSExportPayload {
  const content = store.filter(c =>
    c.section === section && (!publishedOnly || c.status === "published")
  );
  return {
    version: "1.0.0",
    generated_at: now(),
    section,
    content,
    meta: { total: content.length, published_only: publishedOnly },
  };
}

export function getNextStatus(current: ContentStatus): ContentStatus | null {
  return statusFlow[current];
}
