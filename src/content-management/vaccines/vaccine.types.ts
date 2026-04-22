import { BaseContent, CMSContent } from "../cms.types";

export type VaccineType = "FREE" | "PAID";

export type AgeMilestone = 
  | "at-birth" 
  | "2m" 
  | "4m" 
  | "6m" 
  | "9m" 
  | "12m" 
  | "18m" 
  | "2y" 
  | "4-6y";

export interface SideEffect {
  id: string;
  effect_ar: string;
  effect_en: string;
  handling_ar: string;
  handling_en: string;
  is_serious: boolean;
}

export interface VaccineContent extends BaseContent {
  section: "vaccines";
  vaccine_type: VaccineType;
  dose_count: number;
  age_schedule: AgeMilestone[];
  dose_info_ar: string;
  dose_info_en: string;
  importance_ar: string;
  importance_en: string;
  prevented_diseases_ar: string[];
  prevented_diseases_en: string[];
  risks_of_missing_ar: string;
  risks_of_missing_en: string;
  side_effects: SideEffect[];
  warning_signs_ar: string[];
  warning_signs_en: string[];
  price?: number;
  currency?: string;
  available_places?: string[]; // IDs of HospitalContent or HealthUnitContent
  medical_review_required: boolean;
}

export function isVaccineContent(content: CMSContent): content is VaccineContent {
  return content.section === "vaccines";
}
