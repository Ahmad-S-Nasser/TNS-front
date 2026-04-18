import React, { useState, useMemo, useEffect } from "react";
import { EgyptMap } from "./EgyptMap";
import { FiltersPanel } from "./FiltersPanel";
import { TrendsCharts } from "./TrendsCharts";
import { LiveSignalFeed } from "./LiveSignalFeed";
import { ReportBuilder } from "./ReportBuilder";
import { intelligenceService } from "./intelligence.service";
import { 
  IntelligenceFilters, 
  Governorate, 
  HealthSignal, 
  HeatmapView, 
  ProvenanceMetadata 
} from "./intelligence.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, ShieldAlert, Pill, 
  MapPin, TrendingUp, Info, 
  Database, Fingerprint, Lock,
  ChevronUp, ChevronDown, FileText
} from "lucide-react";
import { useI18n } from "@/i18n/i18n.context";

export default function HeatmapDashboard() {
  const { t, lang } = useI18n();
  const [filters, setFilters] = useState<IntelligenceFilters>({
    dateRange: null,
    governorates: [],
    categories: [],
    ageGroups: []
  });

  const [selectedGov, setSelectedGov] = useState<Governorate | null>(null);
  const [viewMode, setViewMode] = useState<HeatmapView>("frequency");
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Sync selectedGov with filters
  useEffect(() => {
    if (selectedGov) {
      setFilters(prev => ({ ...prev, governorates: [selectedGov] }));
    }
  }, [selectedGov]);

  const heatmapData = useMemo(() => intelligenceService.getHeatmapData(filters), [filters]);
  const trendData = useMemo(() => intelligenceService.getTrends(filters), [filters]);
  const liveSignals = useMemo(() => intelligenceService.getLiveFeed(15), []);
  const currentSignals = useMemo(() => intelligenceService.getSignals(filters), [filters]);
  const baselines = useMemo(() => intelligenceService.getKPIBaselines(filters), [filters]);
  const provenance = useMemo(() => intelligenceService.getProvenance(filters), [filters]);

  const seriousCount = currentSignals.filter(s => s.is_serious).length;
  const availCount = currentSignals.filter(s => s.category === "availability").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Privacy & Trust Banner */}
      <div className="bg-teal-600 px-6 py-2.5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-teal-900/10">
          <Lock className="h-3.5 w-3.5 text-teal-200" />
          <p className="text-[10px] font-black text-white uppercase tracking-widest">
            {t("intel_banner_privacy")}
          </p>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">{t("intel_title")}</h2>
            <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] py-0.5 px-2">{t("intel_national_data")}</Badge>
          </div>
          <p className="text-slate-400 font-medium text-sm max-w-xl leading-relaxed">
            {t("intel_subtitle")}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 min-w-[200px] relative">
                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-teal-600">
                    <Activity className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("intel_metric_signals")}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-xl font-black text-[#0f172a]">{baselines.total.current}</p>
                        <div className={`flex items-center text-[9px] font-black ${baselines.total.deltaPercent > 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {baselines.total.deltaPercent > 0 ? <ChevronUp className="h-2 w-2" /> : <ChevronDown className="h-2 w-2" />}
                            {Math.abs(Math.round(baselines.total.deltaPercent))}%
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-1 left-4 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
                    <p className="text-[7px] font-black text-emerald-600 uppercase tracking-tighter">{t("intel_baseline_normal")}</p>
                </div>
            </div>

            <div className="p-4 bg-red-50 rounded-3xl border border-red-100 flex items-center gap-4 min-w-[200px]">
                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-600">
                    <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">{t("intel_metric_serious")}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-xl font-black text-red-700">{baselines.serious.current}</p>
                        <div className="text-[9px] font-black text-red-400 opacity-60">
                           {t("intel_baseline_vs")} ({baselines.serious.previous})
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Map & General Stats */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100 w-fit">
                    <button 
                      onClick={() => setViewMode("frequency")}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "frequency" ? "bg-white text-teal-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      {t("intel_frequency")}
                    </button>
                    <button 
                      onClick={() => setViewMode("severity")}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "severity" ? "bg-white text-teal-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      {t("intel_metric_serious")}
                    </button>
                </div>
                <EgyptMap 
                   data={heatmapData} 
                   onSelect={setSelectedGov} 
                   selected={selectedGov}
                   viewMode={viewMode}
                />
            </div>
            <div className="space-y-6">
                 {/* Selection Summary */}
                <div className="bg-slate-900 text-white p-6 rounded-[2rem] h-[calc(50%-12px)] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <MapPin className="h-24 w-24" />
                   </div>
                   <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{t("intel_filter_scope")}</h4>
                   <p className="text-2xl font-black">
                     {selectedGov ? t(`gov_${selectedGov.charAt(0).toLowerCase() + selectedGov.slice(1)}` as any) : t("intel_filter_national")}
                   </p>
                   {selectedGov && (
                       <button 
                        onClick={() => {setSelectedGov(null); setFilters(f => ({ ...f, governorates: [] }))}}
                        className="mt-4 text-[10px] font-bold underline underline-offset-4 text-emerald-400/80 hover:text-emerald-400"
                       >
                         {t("intel_filter_switchNational")}
                       </button>
                   )}
                </div>

                 <div className="bg-white p-6 rounded-[2rem] border border-slate-100 h-[calc(50%-12px)] flex flex-col justify-between">
                   <div className="space-y-1">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("intel_cat_availability")}</h4>
                      <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-black text-[#0f172a]">{availCount}</p>
                          <span className="text-[10px] font-black text-emerald-600">+4%</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-emerald-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-bold font-mono">+12% vs LW</span>
                   </div>
                </div>

                {/* Data Provenance Box */}
                <div className="bg-teal-50/50 p-6 rounded-[2rem] border border-teal-100/50 space-y-6">
                   <div className="space-y-4 pb-4 border-b border-teal-100/50">
                     <h4 className="text-[10px] font-black text-teal-700 uppercase tracking-widest flex items-center gap-2">
                        <Database className="h-3 w-3" /> {t("intel_prov_title")}
                     </h4>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center group">
                            <span className="text-[10px] font-bold text-slate-500">{t("intel_prov_reports")}</span>
                            <span className="text-xs font-black text-slate-900">{provenance.totalReports.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="text-[10px] font-bold text-slate-500">{t("intel_prov_coverage")}</span>
                            <span className="text-xs font-black text-teal-600">{provenance.coveragePercent}%</span>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="text-[10px] font-bold text-slate-500">{t("intel_prov_freshness")}</span>
                            <span className="text-[9px] font-bold text-slate-400">{new Date(provenance.lastUpdated).toLocaleTimeString()}</span>
                        </div>
                     </div>
                   </div>

                   <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
                        <Fingerprint className="h-3 w-3" /> {t("intel_prov_validity")}
                     </h4>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-500">{t("intel_prov_resp_rate")}</span>
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${provenance.responseRate}%` }} />
                                </div>
                                <span className="text-xs font-black text-slate-900">{provenance.responseRate}%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-500">{t("intel_prov_conf_score")}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-black ${provenance.confidenceScore > 80 ? "text-emerald-600" : "text-amber-600"}`}>
                                    {provenance.confidenceScore}%
                                </span>
                            </div>
                        </div>
                     </div>
                   </div>
                </div>
            </div>
          </div>

          <TrendsCharts data={trendData} />

          {/* Ethics / Disclaimer Footer for analytics */}
          <div className="p-6 bg-slate-900/5 border border-slate-200/50 rounded-3xl flex items-start gap-4">
            <Info className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">{t("intel_protocol_title")}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-2xl">
                {t("intel_protocol_desc")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Filters & Feed */}
        <div className="lg:col-span-4 space-y-6">
          <FiltersPanel 
            filters={filters} 
            onChange={setFilters} 
            onExport={() => setIsReportOpen(true)}
          />
          <LiveSignalFeed signals={liveSignals} />
        </div>
      </div>

      <ReportBuilder 
        open={isReportOpen} 
        onOpenChange={setIsReportOpen}
        filters={filters}
      />
    </div>
  );
}
