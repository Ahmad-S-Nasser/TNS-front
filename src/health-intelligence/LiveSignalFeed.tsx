import React from "react";
import { HealthSignal, SignalCategory } from "./intelligence.types";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, Syringe, Pill, MapPin } from "lucide-react";
import { useI18n } from "@/i18n/i18n.context";

interface Props {
  signals: HealthSignal[];
}

const iconMap: Record<string, any> = {
  vaccine_effect: Syringe,
  symptom: Activity,
  availability: Pill,
  access: MapPin,
};

export function LiveSignalFeed({ signals }: Props) {
  const { t, isRTL } = useI18n();
  const [activeTab, setActiveTab] = React.useState<"all" | SignalCategory>("all");

  const filteredSignals = signals.filter(s => activeTab === "all" || s.category === activeTab);

  const TABS: { id: "all" | SignalCategory; labelKey: string }[] = [
    { id: "all", labelKey: "intel_feed_all" },
    { id: "vaccine_effect", labelKey: "intel_feed_safety" },
    { id: "symptom", labelKey: "intel_feed_symptoms" },
    { id: "access", labelKey: "intel_feed_access" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div>
          <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">{t("intel_liveFeed")}</h3>
          <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Anonymized Real-time Monitoring</p>
        </div>
        <div className="flex gap-2">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      <div className="px-5 py-2 border-b border-slate-50 flex items-center gap-1 overflow-x-auto no-scrollbar">
         {TABS.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight whitespace-nowrap transition-all ${
               activeTab === tab.id ? "bg-teal-600 text-white" : "text-slate-400 hover:text-slate-600"
             }`}
           >
             {t(tab.labelKey as any)}
           </button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px] no-scrollbar">
        {filteredSignals.map((signal) => {
          const Icon = iconMap[signal.category] || Activity;
          return (
            <div 
              key={signal.id} 
              className={`p-3 bg-white border rounded-2xl transition-all hover:shadow-md group relative ${
                signal.is_serious ? "border-red-100 bg-red-50/10" : "border-slate-100 hover:border-teal-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                  signal.is_serious ? "bg-red-100 text-red-600 shadow-sm" : "bg-teal-50 text-teal-600"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-black truncate ${signal.is_serious ? "text-red-700" : "text-[#334155]"}`}>
                      {t(`sig_${signal.subcategory}` as any)}
                    </p>
                    <span className="text-[9px] text-slate-300 font-medium whitespace-nowrap">
                      {new Date(signal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" /> {t(`gov_${signal.governorate.charAt(0).toLowerCase() + signal.governorate.slice(1)}` as any)}
                    </p>
                    <div className="h-1 w-1 rounded-full bg-slate-200" />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                      {t(`cat_${signal.age_group}` as any)}
                    </p>
                  </div>
                  
                  {/* Source Attribution */}
                  <div className="mt-2 flex items-center gap-1.5">
                     <div className="h-3 w-3 rounded-full bg-slate-100 flex items-center justify-center">
                        <Activity className="h-2 w-2 text-slate-400" />
                     </div>
                     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{signal.source}</span>
                  </div>
                </div>
              </div>
              
              {signal.is_serious && (
                <div className="absolute -top-1 -right-1">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-emerald-50/30 border-t border-emerald-50">
         <p className="text-[9px] text-emerald-700 font-bold text-center">
            {t("intel_disclaimer")}
         </p>
      </div>
    </div>
  );
}
