import { BaseContent, AgeCategory } from "@/content-management/cms.types";

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

export interface FAQCategory {
  id: string;
  name_ar: string;
  name_en: string;
  icon: string;
}
