import { VaccineContent } from "./vaccines/vaccine.types";
// ─── Advanced CMS Type System ─────────────────────────────────────────────────
// Tips & Steps — Multi-section content management for mobile app consumption.
// All types are API-ready and serializable.

// ─── Core Enums ──────────────────────────────────────────────────────────────

export type CMSSection =
  | "behavioral"
  | "psychological"
  | "nutrition"
  | "sexual-education"
  | "educational-games"
  | "hospitals"
  | "health-units"
  | "emergency"
  | "vaccines"
  | "questionnaires"
  | "faqs";

export type ContentStatus = "draft" | "review" | "approved" | "published" | "archived";

export type ContentRole = "SUPER_ADMIN" | "MARKETING" | "DOCTOR" | "CONTENT_REVIEWER" | "IT_SUPPORT";

export type SeverityLevel = "mild" | "moderate" | "severe" | "critical";

export type AgeCategory =
  | "infant"       // 0–2 years
  | "toddler"      // 2–4 years
  | "preschool"    // 4–6 years
  | "school-age"   // 6–12 years
  | "adolescent"   // 12–18 years
  | "all";

export type GameCategory = "cognitive" | "motor" | "social" | "language" | "creative";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "supplement";

export type EmergencyType = "ambulance" | "fire" | "police" | "poison-control" | "child-protection" | "mental-health-crisis";

// ─── Base Content Model ───────────────────────────────────────────────────────

export interface BaseContent {
  id: string;
  section: CMSSection;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  status: ContentStatus;
  visibility: {
    age_categories: AgeCategory[];
    requires_login: boolean;
  };
  requires_doctor_approval: boolean;
  requires_admin_approval: boolean;
  created_by: string;
  reviewed_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  tags?: string[];
}

// ─── Section 1 & 2: Behavioral & Psychological Problems ──────────────────────

export interface BehavioralContent extends BaseContent {
  section: "behavioral" | "psychological";
  problem_type_ar: string;
  problem_type_en: string;
  symptoms_ar: string[];
  symptoms_en: string[];
  age_range: { min_months: number; max_months: number };
  severity: SeverityLevel;
  causes_ar: string[];
  causes_en: string[];
  recommended_actions_ar: string[];
  recommended_actions_en: string[];
  seek_help_when_ar: string;
  seek_help_when_en: string;
  is_psychological?: boolean;
}

// ─── Section 3: Healthy Nutrition ────────────────────────────────────────────

export interface NutritionContent extends BaseContent {
  section: "nutrition";
  age_group: AgeCategory;
  meal_type: MealType;
  recommended_foods_ar: string[];
  recommended_foods_en: string[];
  restricted_foods_ar: string[];
  restricted_foods_en: string[];
  tips_ar: string[];
  tips_en: string[];
  has_images: boolean;
  image_url?: string;
  nutritional_notes_ar?: string;
  nutritional_notes_en?: string;
}

// ─── Section 4: Sexual Education ─────────────────────────────────────────────

export interface SexualEducationContent extends BaseContent {
  section: "sexual-education";
  age_category: AgeCategory;
  education_level: "basic" | "intermediate" | "advanced";
  is_sensitive: boolean;
  parent_explanation_ar: string;
  parent_explanation_en: string;
  child_appropriate_language_ar: string;
  child_appropriate_language_en: string;
  professional_review_required: boolean;
}

// ─── Section 5: Educational Games ────────────────────────────────────────────

export interface EducationalGameContent extends BaseContent {
  section: "educational-games";
  target_age: AgeCategory;
  game_category: GameCategory;
  instructions_ar: string;
  instructions_en: string;
  materials_ar: string[];
  materials_en: string[];
  duration_minutes: number;
  educational_outcomes_ar: string[];
  educational_outcomes_en: string[];
  difficulty: "easy" | "medium" | "hard";
  can_play_solo: boolean;
  players_min: number;
  players_max: number;
}

// ─── Section 6: Hospitals ────────────────────────────────────────────────────

export interface HospitalContent extends BaseContent {
  section: "hospitals";
  hospital_name_ar: string;
  hospital_name_en: string;
  city_ar: string;
  city_en: string;
  address_ar: string;
  address_en: string;
  coordinates?: { lat: number; lng: number };
  specializations_ar: string[];
  specializations_en: string[];
  is_24_7: boolean;
  contact_numbers: string[];
  services_ar: string[];
  services_en: string[];
  has_children_ward: boolean;
  has_emergency: boolean;
  distance_km?: number;
  working_hours_ar?: string;
  working_hours_en?: string;
  website?: string;
}

// ─── Section 7: Health Units ──────────────────────────────────────────────────

export interface HealthUnitContent extends BaseContent {
  section: "health-units";
  unit_name_ar: string;
  unit_name_en: string;
  city_ar: string;
  city_en: string;
  address_ar: string;
  address_en: string;
  coordinates?: { lat: number; lng: number };
  services_offered_ar: string[];
  services_offered_en: string[];
  is_free: boolean;
  has_vaccination: boolean;
  vaccination_types?: string[];
  working_hours_ar: string;
  working_hours_en: string;
  working_days_ar: string;
  working_days_en: string;
  contact_number?: string;
}

// ─── Section 8: Emergency ────────────────────────────────────────────────────

export interface EmergencyContent extends BaseContent {
  section: "emergency";
  emergency_type: EmergencyType;
  phone_number: string;
  is_24_7: boolean;
  notes_for_parents: string;
  icon: string;             // lucide icon key
  color: string;            // hex color for app display
  region?: string;          // national vs. regional
  when_to_call: string;     // brief guidance
}

// ─── Union Type ───────────────────────────────────────────────────────────────

export type CMSContent =
  | BehavioralContent
  | NutritionContent
  | SexualEducationContent
  | EducationalGameContent
  | HospitalContent
  | HealthUnitContent
  | EmergencyContent
  | VaccineContent
  | QuestionnaireContent
  | FAQContent;

// ─── Section 9: Questionnaires ──────────────────────────────────────────────

export type QuestionnaireType = "post-vax" | "monthly-check" | "missed-followup" | "symptom-monitor" | "availability";
export type TriggerType = "age" | "vaccine" | "time" | "event";

export interface QuestionnaireQuestion {
  id: string;
  text_ar: string;
  text_en: string;
  type: "yes-no" | "multiple-choice" | "scale";
  options?: { value: string; label_ar: string; label_en: string; signal_type?: string }[];
  is_required: boolean;
  linked_signal_type?: string; 
}

export interface QuestionnaireContent extends BaseContent {
  section: "questionnaires";
  type: QuestionnaireType;
  trigger: {
    type: TriggerType;
    value: string; // Age in months, Vaccine ID, etc.
  };
  questions: QuestionnaireQuestion[];
  is_active: boolean;
}

// ─── Section 10: FAQs ────────────────────────────────────────────────────────

export interface FAQContent extends BaseContent {
  section: "faqs";
  category: string;
  links: {
    vaccine_ids?: string[];
    age_groups?: AgeCategory[];
    symptoms?: string[];
  };
  is_reassurance: boolean;
  is_warning: boolean;
}

// ─── Form Data Types ─────────────────────────────────────────────────────────

export interface BaseContentFormData {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  status: ContentStatus;
  visibility: {
    age_categories: AgeCategory[];
    requires_login: boolean;
  };
  tags?: string[];
}

// ─── Section Config (UI metadata) ────────────────────────────────────────────

export interface SectionConfig {
  key: CMSSection;
  label_ar: string;
  label_en: string;
  description_ar: string;
  description_en: string;
  icon: string;             // lucide icon key
  color: string;            // hex color
  gradient: string;         // tailwind gradient classes
  requires_doctor_approval: boolean;
  requires_admin_approval: boolean;
  allowed_roles: ContentRole[];
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface SectionStats {
  section: CMSSection;
  total: number;
  published: number;
  draft: number;
  review: number;
  approved: number;
  archived: number;
}

// ─── Export payload ───────────────────────────────────────────────────────────

export interface CMSExportPayload {
  version: string;
  generated_at: string;
  section: CMSSection;
  content: CMSContent[];
  meta: {
    total: number;
    published_only: boolean;
  };
}
