import { CMSSection, BaseContent, AgeCategory } from "@/content-management/cms.types";

export type QuestionnaireType = 
  | "post-vax" 
  | "monthly-check" 
  | "missed-followup" 
  | "symptom-monitor" 
  | "availability";

export type TriggerType = "age" | "vaccine" | "time" | "event";

export type QuestionType = "yes-no" | "multiple-choice" | "scale";

export interface QuestionnaireQuestion {
  id: string;
  text_ar: string;
  text_en: string;
  type: QuestionType;
  options?: { value: string; label_ar: string; label_en: string; signal_type?: string }[];
  is_required: boolean;
  linked_signal_type?: string; 
}

export interface QuestionnaireContent extends BaseContent {
  section: "questionnaires";
  type: QuestionnaireType;
  trigger: {
    type: TriggerType;
    value: string; // Age in months, Vaccine ID, or specific event code
  };
  questions: QuestionnaireQuestion[];
  is_active: boolean;
  requires_doctor_approval: boolean;
}
