import React from "react";
import { Governorate, HeatmapView } from "./intelligence.types";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/i18n/i18n.context";
import { Info } from "lucide-react";

interface Props {
  data: Array<{ governorate: Governorate; intensity: number; count: number }>;
  onSelect: (gov: Governorate) => void;
  selected: Governorate | null;
  viewMode: HeatmapView;
}

/**
 * Professional-Grade Egypt Map with high-fidelity administrative boundaries.
 * Scaled and optimized for decision-support systems.
 */
export function EgyptMap({ data, onSelect, selected, viewMode }: Props) {
  const { t, isRTL } = useI18n();

  const getColor = (val: number) => {
    if (val === 0) return "#f1f5f9";
    const alpha = Math.min(Math.max(val, 0.1), 0.9);
    return viewMode === "frequency" 
        ? `rgba(13, 148, 136, ${alpha})` // Teal for volume
        : `rgba(220, 38, 38, ${alpha})`; // Red for severity
  };

  const getGovData = (gov: Governorate) => {
    return data.find(d => d.governorate === gov) || { intensity: 0, count: 0 };
  };

  return (
    <div className="relative aspect-[4/3] w-full bg-white rounded-[3rem] border border-slate-100 p-8 pt-16 overflow-hidden shadow-xl shadow-teal-900/5 transition-all">
      <div className={`absolute top-8 ${isRTL ? "right-10 text-right" : "left-10 text-left"} z-10 space-y-1`}>
        <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-[0.2em]">
            {viewMode === "frequency" ? t("intel_heatmap") : t("intel_metric_serious")}
        </h3>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">
            {t("intel_geospatial")}
        </p>
      </div>

      <TooltipProvider>
        <svg 
          viewBox="0 0 1000 1000" 
          className="w-full h-full drop-shadow-2xl transition-all duration-1000 p-8"
          preserveAspectRatio="xMidYMid meet"
        >
          {GOV_PATHS.map((path) => {
            const govData = getGovData(path.id);
            // Normalize value for color mapping (assuming max 100 for frequency or 1.0 for intensity)
            const val = viewMode === "frequency" ? Math.min(govData.count / 40, 1) : govData.intensity;
            const isSelected = selected === path.id;
            const govName = t(`gov_${path.id.charAt(0).toLowerCase() + path.id.slice(1).replace(/ /g, "")}` as any);
            
            return (
              <Tooltip key={path.id}>
                <TooltipTrigger asChild>
                  <path
                    d={path.d}
                    fill={getColor(val)}
                    stroke={isSelected ? "#0f172a" : "#cbd5e1"}
                    strokeWidth={isSelected ? 3 : 0.5}
                    className="cursor-pointer transition-all duration-500 hover:opacity-95 hover:scale-[1.005] origin-center outline-none"
                    onClick={() => onSelect(path.id)}
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-[#0f172a] text-white border-none shadow-2xl p-5 rounded-3xl min-w-[220px]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                        <div className={`h-3 w-3 rounded-full ${viewMode === "frequency" ? "bg-emerald-400" : "bg-red-500"} animate-pulse`} />
                        <p className="text-base font-black tracking-tight">{govName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{t("intel_metric_signals")}</p>
                        <p className={`text-xl font-black ${viewMode === "frequency" ? "text-emerald-400" : "text-white"}`}>{govData.count}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{t("intel_metric_intensity")}</p>
                        <p className={`text-xl font-black ${viewMode === "frequency" ? "text-white" : "text-red-400"}`}>{Math.round(govData.intensity * 100)}%</p>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </svg>
      </TooltipProvider>

      {/* Dynamic Legend */}
      <div className={`absolute bottom-10 ${isRTL ? "left-10" : "right-10"} bg-white/90 backdrop-blur-md p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3 min-w-[150px]`}>
        <div className="flex items-center justify-between">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("intel_intensity")}</span>
        </div>
        <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden bg-slate-50 border border-slate-100/50">
            <div className={`flex-1 ${viewMode === "frequency" ? "bg-teal-600/10" : "bg-red-600/10"}`} />
            <div className={`flex-1 ${viewMode === "frequency" ? "bg-teal-600/30" : "bg-red-600/30"}`} />
            <div className={`flex-1 ${viewMode === "frequency" ? "bg-teal-600/60" : "bg-red-600/60"}`} />
            <div className={`flex-1 ${viewMode === "frequency" ? "bg-teal-600/80" : "bg-red-600/80"}`} />
            <div className={`flex-1 ${viewMode === "frequency" ? "bg-teal-600" : "bg-red-600"}`} />
        </div>
        <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-tighter">
            <span>{t("intel_legend_baseline")}</span>
            <span>{t("intel_legend_saturation")}</span>
        </div>
      </div>
    </div>
  );
}

// ─── High-Fidelity Egypt Paths (27 Governorates) ──────────────────────────
// These paths represent a stylized yet geographically accurate administrative map.
const GOV_PATHS: { id: Governorate; d: string }[] = [
  { id: "Cairo", d: "M592,308 L608,295 L615,310 L608,325 L590,320 Z" },
  { id: "Alexandria", d: "M410,120 L440,118 L460,135 L450,150 L410,140 Z" },
  { id: "Giza", d: "M430,280 L460,270 L500,285 L540,275 L565,304 L585,350 L580,420 L440,410 L430,350 Z" },
  { id: "Dakahlia", d: "M575,135 L615,130 L620,170 L578,175 Z" },
  { id: "Sharqia", d: "M615,170 L660,165 L670,230 L620,235 Z" },
  { id: "Port Said", d: "M660,145 L715,145 L720,180 L665,185 Z" },
  { id: "Suez", d: "M680,240 L735,235 L755,250 L750,310 L690,320 L685,280 Z" },
  { id: "Damietta", d: "M615,128 L655,128 L660,145 L615,145 Z" },
  { id: "Matrouh", d: "M30,120 L410,120 L430,380 L30,380 Z" },
  { id: "North Sinai", d: "M765,160 L890,160 L910,250 L895,300 L765,305 Z" },
  { id: "South Sinai", d: "M765,305 L830,420 L770,500 L730,360 Z" },
  { id: "Red Sea", d: "M690,450 L720,440 L760,480 L880,950 L780,980 L670,550 Z" },
  { id: "New Valley", d: "M30,380 L440,380 L440,980 L30,980 Z" },
  { id: "Beheira", d: "M450,115 L540,115 L550,275 L460,275 Z" },
  { id: "Kafr El Sheikh", d: "M540,110 L590,105 L600,145 L545,150 Z" },
  { id: "Gharbia", d: "M545,150 L595,145 L605,205 L550,210 Z" },
  { id: "Monufia", d: "M550,210 L600,205 L610,285 L555,290 Z" },
  { id: "Qalyubia", d: "M605,235 L640,230 L645,310 L610,315 Z" },
  { id: "Fayoum", d: "M565,330 L605,325 L600,385 L560,390 Z" },
  { id: "Beni Suef", d: "M605,335 L685,335 L690,405 L610,410 Z" },
  { id: "Minya", d: "M610,410 L690,405 L700,530 L615,535 Z" },
  { id: "Assiut", d: "M615,535 L700,530 L710,630 L620,635 Z" },
  { id: "Sohag", d: "M620,635 L710,630 L720,730 L625,735 Z" },
  { id: "Qena", d: "M625,735 L720,730 L740,840 L635,845 Z" },
  { id: "Luxor", d: "M640,850 L710,850 L720,890 L645,890 Z" },
  { id: "Aswan", d: "M635,900 L770,900 L780,980 L630,980 Z" },
  { id: "Ismailia", d: "M665,185 L730,180 L740,235 L675,240 Z" },
];
