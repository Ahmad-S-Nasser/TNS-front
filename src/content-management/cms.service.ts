// ─── CMS Configuration Layer ──────────────────────────────────────────────────
// This file now only contains configuration and helper functions.
// All data fetching is handled via TanStack Query hooks in @/hooks/queries/useContent.ts

import type {
  CMSSection, CMSContent, ContentStatus, SectionConfig, SectionStats,
  CMSExportPayload,
} from "./cms.types";

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
    allowed_roles: ["SUPER_ADMIN", "MARKETING", "DOCTOR", "CONTENT_REVIEWER"],
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
    allowed_roles: ["SUPER_ADMIN", "MARKETING", "DOCTOR", "CONTENT_REVIEWER"],
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
    allowed_roles: ["SUPER_ADMIN", "MARKETING", "DOCTOR", "CONTENT_REVIEWER"],
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
    allowed_roles: ["SUPER_ADMIN", "DOCTOR", "CONTENT_REVIEWER"],
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
    allowed_roles: ["SUPER_ADMIN", "MARKETING", "DOCTOR", "CONTENT_REVIEWER"],
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
    allowed_roles: ["SUPER_ADMIN", "CONTENT_REVIEWER"],
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
    allowed_roles: ["SUPER_ADMIN", "CONTENT_REVIEWER"],
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
    allowed_roles: ["SUPER_ADMIN", "CONTENT_REVIEWER"],
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
    allowed_roles: ["SUPER_ADMIN", "DOCTOR", "CONTENT_REVIEWER"],
  },
  {
    key: "questionnaires",
    label_ar: "الاستبيانات الصحية",
    label_en: "Health Questionnaires",
    description_ar: "إدارة استبيانات جمع البيانات الصحية وتتبع الإشارات",
    description_en: "Manage health data collection and signal tracking questionnaires",
    icon: "clipboard-list",
    color: "#6366F1",
    gradient: "from-indigo-500 to-blue-600",
    requires_doctor_approval: true,
    requires_admin_approval: false,
    allowed_roles: ["SUPER_ADMIN", "DOCTOR", "CONTENT_REVIEWER"],
  },
  {
    key: "faqs",
    label_ar: "الأسئلة الشائعة",
    label_en: "FAQs & Guidance",
    description_ar: "إدارة المحتوى التعليمي والأسئلة الشائعة للأهل",
    description_en: "Manage educational FAQs and guidance for parents",
    icon: "help-circle",
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
    requires_doctor_approval: false,
    requires_admin_approval: false,
    allowed_roles: ["SUPER_ADMIN", "MARKETING", "DOCTOR", "CONTENT_REVIEWER"],
  },
];

export function getSectionConfig(key: CMSSection): SectionConfig {
  return SECTION_CONFIGS.find(s => s.key === key)!;
}

// ─── Status Lifecycle ─────────────────────────────────────────────────────────

const statusFlow: Record<ContentStatus, ContentStatus | null> = {
  draft: "review",
  review: "approved",
  approved: "published",
  published: null,
  archived: null,
};

export function getNextStatus(current: ContentStatus): ContentStatus | null {
  return statusFlow[current];
}

// ─── Export Helper (Client-side only) ──────────────────────────────────────────

export function exportSection(section: CMSSection, content: CMSContent[] = []): CMSExportPayload {
  return {
    version: "1.0.0",
    generated_at: new Date().toISOString(),
    section,
    content,
    meta: { total: content.length, published_only: false },
  };
}
