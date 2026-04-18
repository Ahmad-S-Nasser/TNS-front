export type SignalCategory = "vaccine_effect" | "symptom" | "availability" | "access";
export type HeatmapView = "frequency" | "severity";

export type SignalSource = 
  | "Follow-up Day 3" 
  | "Follow-up Month 1" 
  | "Routine Monthly Check" 
  | "Pharmacy Stock Report";

export type Governorate =
  | "Cairo" | "Alexandria" | "Giza" | "Suez" | "Port Said"
  | "Damietta" | "Dakahlia" | "Sharqia" | "Qalyubia" | "Kafr El Sheikh"
  | "Gharbia" | "Monufia" | "Beheira" | "Ismailia" | "Beni Suef"
  | "Fayoum" | "Minya" | "Assiut" | "Sohag" | "Qena"
  | "Luxor" | "Aswan" | "Red Sea" | "New Valley" | "Matrouh"
  | "North Sinai" | "South Sinai";

export interface HealthSignal {
  id: string;
  category: SignalCategory;
  subcategory: string;
  governorate: Governorate;
  timestamp: string;
  age_group: string;
  intensity: number; // 0-1
  is_serious: boolean;
  source: SignalSource;
  metadata?: Record<string, any>;
}

export interface KPIBaseline {
  current: number;
  previous: number;
  deltaPercent: number;
  isNormal: boolean;
  unit?: string;
}

export interface ProvenanceMetadata {
  totalReports: number;
  activeUsers: number;
  coveragePercent: number;
  responseRate: number;
  confidenceScore: number;
  lastUpdated: string;
}

export interface IntelligenceFilters {
  dateRange: { start: string; end: string } | null;
  governorates: Governorate[];
  categories: SignalCategory[];
  ageGroups: string[];
}

export interface HeatmapData {
  governorate: Governorate;
  intensity: number;
  count: number;
}

export interface TrendData {
  date: string;
  [key: string]: string | number;
}
