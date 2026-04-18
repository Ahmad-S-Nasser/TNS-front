import { 
  HealthSignal, 
  IntelligenceFilters, 
  HeatmapData, 
  TrendData, 
  Governorate, 
  SignalCategory 
} from "./intelligence.types";

const GOVERNORATES: Governorate[] = [
  "Cairo", "Alexandria", "Giza", "Suez", "Port Said",
  "Damietta", "Dakahlia", "Sharqia", "Qalyubia", "Kafr El Sheikh",
  "Gharbia", "Monufia", "Beheira", "Ismailia", "Beni Suef",
  "Fayoum", "Minya", "Assiut", "Sohag", "Qena",
  "Luxor", "Aswan", "Red Sea", "New Valley", "Matrouh",
  "North Sinai", "South Sinai"
];

const CATEGORIES: Record<SignalCategory, string[]> = {
  vaccine_effect: ["fever", "pain", "allergy", "lethargy", "dizziness"],
  symptom: ["cough", "rash", "diarrhea", "vomiting", "respiratory"],
  availability: ["vax_shortage", "drug_shortage", "unit_closed", "wait_times"],
  access: ["distance", "booking", "transport"]
};

const SOURCES: SignalSource[] = [
  "Follow-up Day 3", "Follow-up Month 1", "Routine Monthly Check", "Pharmacy Stock Report"
];

// Generate 500 mock signals
const signals: HealthSignal[] = Array.from({ length: 500 }).map((_, i) => {
  const category = (Object.keys(CATEGORIES) as SignalCategory[])[Math.floor(Math.random() * 4)];
  const subcats = CATEGORIES[category];
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));

  return {
    id: `sig-${i}`,
    category,
    subcategory: subcats[Math.floor(Math.random() * subcats.length)],
    governorate: GOVERNORATES[Math.floor(Math.random() * GOVERNORATES.length)],
    timestamp: date.toISOString(),
    age_group: ["infant", "toddler", "preschool", "schoolAge"][Math.floor(Math.random() * 4)],
    intensity: Math.random(),
    is_serious: Math.random() > 0.9,
    source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
  };
});

export const intelligenceService = {
  getSignals: (filters: IntelligenceFilters): HealthSignal[] => {
    return signals.filter(s => {
      const matchGov = filters.governorates.length === 0 || filters.governorates.includes(s.governorate);
      const matchCat = filters.categories.length === 0 || filters.categories.includes(s.category);
      const matchAge = filters.ageGroups.length === 0 || filters.ageGroups.includes(s.age_group);
      
      let matchDate = true;
      if (filters.dateRange) {
        const start = new Date(filters.dateRange.start);
        const end = new Date(filters.dateRange.end);
        const current = new Date(s.timestamp);
        matchDate = current >= start && current <= end;
      }

      return matchGov && matchCat && matchAge && matchDate;
    });
  },

  getHeatmapData: (filters: IntelligenceFilters): HeatmapData[] => {
    const filtered = intelligenceService.getSignals(filters);
    const result: HeatmapData[] = GOVERNORATES.map(gov => {
      const govSignals = filtered.filter(s => s.governorate === gov);
      const totalIntensity = govSignals.reduce((acc, s) => acc + s.intensity, 0);
      return {
        governorate: gov,
        count: govSignals.length,
        intensity: govSignals.length > 0 ? totalIntensity / govSignals.length : 0
      };
    });
    return result;
  },

  getTrends: (filters: IntelligenceFilters): TrendData[] => {
    const filtered = intelligenceService.getSignals(filters);
    const days: Record<string, TrendData> = {};

    // Last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      days[key] = { date: key, vaccine_effect: 0, symptom: 0, availability: 0, access: 0 };
    }

    filtered.forEach(s => {
      const key = s.timestamp.split("T")[0];
      if (days[key]) {
        (days[key][s.category] as number)++;
      }
    });

    return Object.values(days);
  },

  getLiveFeed: (limit = 10): HealthSignal[] => {
    return [...signals]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },

  getKPIBaselines: (filters: IntelligenceFilters) => {
    const current = intelligenceService.getSignals(filters).length;
    // Mock previous period as roughly 15% different
    const previous = Math.floor(current * (0.8 + Math.random() * 0.4));
    const delta = current - previous;
    const deltaPercent = previous > 0 ? (delta / previous) * 100 : 0;
    
    return {
        total: {
            current,
            previous,
            deltaPercent,
            isNormal: Math.abs(deltaPercent) < 20
        },
        serious: {
            current: Math.floor(current * 0.1),
            previous: Math.floor(previous * 0.11),
            deltaPercent: -10,
            isNormal: true
        }
    };
  },

  getProvenance: (filters: IntelligenceFilters): ProvenanceMetadata => {
    const govCount = filters.governorates.length;
    // Lower confidence if we are filtering by low-density areas
    const confidenceScore = govCount === 0 ? 94 : (70 + Math.random() * 20);
    
    return {
      totalReports: 12450,
      activeUsers: 8900,
      coveragePercent: 92,
      responseRate: 78,
      confidenceScore: Math.round(confidenceScore),
      lastUpdated: new Date().toISOString()
    };
  }
};
