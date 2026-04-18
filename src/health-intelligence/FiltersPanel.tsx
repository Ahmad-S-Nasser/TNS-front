import React from "react";
import { IntelligenceFilters, SignalCategory, Governorate } from "./intelligence.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, Calendar, Baby, Layers, 
  Map as MapIcon, RotateCcw, Download 
} from "lucide-react";
import { useI18n } from "@/i18n/i18n.context";

interface Props {
  filters: IntelligenceFilters;
  onChange: (filters: IntelligenceFilters) => void;
  onExport: () => void;
}

const CATEGORIES = (t: any): { id: SignalCategory; label: string }[] => [
  { id: "vaccine_effect", label: t("intel_cat_vaccine_effect") },
  { id: "symptom", label: t("intel_cat_symptom") },
  { id: "availability", label: t("intel_cat_availability") },
  { id: "access", label: t("intel_cat_access") }
];

const AGE_GROUPS = (t: any) => [
  { id: "infant", label: t("cat_infant") },
  { id: "toddler", label: t("cat_toddler") },
  { id: "preschool", label: t("cat_preschool") },
  { id: "schoolAge", label: t("cat_schoolAge") }
];

export function FiltersPanel({ filters, onChange, onExport }: Props) {
  const { t } = useI18n();
  const categories = CATEGORIES(t);
  const ages = AGE_GROUPS(t);

  const toggleCategory = (cat: SignalCategory) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  const toggleAge = (age: string) => {
    const next = filters.ageGroups.includes(age)
      ? filters.ageGroups.filter(a => a !== age)
      : [...filters.ageGroups, age];
    onChange({ ...filters, ageGroups: next });
  };

  const reset = () => {
    onChange({
      dateRange: null,
      governorates: [],
      categories: [],
      ageGroups: []
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-8 h-fit">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
          <Filter className="h-4 w-4 text-teal-600" /> {t("intel_filter_query")}
        </h3>
        <Button variant="ghost" size="sm" onClick={reset} className="h-7 text-[10px] gap-1 px-2 text-slate-400 hover:text-teal-600">
          <RotateCcw className="h-3 w-3" /> {t("intel_filter_reset")}
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Layers className="h-3.5 w-3.5" /> {t("intel_metrics")}
        </Label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                filters.categories.includes(cat.id)
                  ? "bg-teal-600 border-transparent text-white shadow-md shadow-teal-100"
                  : "bg-white border-slate-100 text-slate-500 hover:border-teal-200 hover:bg-teal-50/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Age Groups */}
      <div className="space-y-3">
        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Baby className="h-3.5 w-3.5" /> {t("intel_filter_demographics")}
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {ages.map(age => (
            <button
              key={age.id}
              onClick={() => toggleAge(age.id)}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold text-left transition-all border ${
                filters.ageGroups.includes(age.id)
                  ? "bg-slate-900 border-transparent text-white"
                  : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
              }`}
            >
              {age.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" /> {t("intel_filter_horizon")}
        </Label>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">{t("intel_horizon_labels")}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed italic">
              {t("intel_horizon_desc")} {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} to present.
            </p>
        </div>
      </div>

      {/* Locations Summary */}
      <div className="space-y-3">
        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MapIcon className="h-3.5 w-3.5" /> {t("intel_filter_scope")}
        </Label>
        <div className="min-h-[60px] p-3 bg-slate-50 rounded-2xl border border-slate-100 italic">
          {filters.governorates.length === 0 ? (
            <p className="text-[10px] text-slate-400">{t("intel_filter_national")}</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {filters.governorates.map(gov => (
                <Badge key={gov} variant="secondary" className="bg-white border-slate-200 text-teal-700 text-[9px] h-5">
                  {t(`gov_${gov.charAt(0).toLowerCase() + gov.slice(1)}` as any)}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onClick={onExport}
          className="w-full h-12 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest gap-2 shadow-lg shadow-teal-900/10"
        >
          <Download className="h-4 w-4" /> {t("intel_filter_export")}
        </Button>
      </div>
    </div>
  );
}
