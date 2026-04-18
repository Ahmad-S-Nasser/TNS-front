import React from "react";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IntelligenceFilters } from "./intelligence.types";
import { useI18n } from "@/i18n/i18n.context";
import { FileDown, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: IntelligenceFilters;
}

export function ReportBuilder({ open, onOpenChange, filters }: Props) {
  const { t } = useI18n();
  const [generating, setGenerating] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8 border-none shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
            <FileDown className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-black text-[#0f172a]">
             {t("intel_report_builder")}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-slate-500">
            {t("intel_report_desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {done ? (
            <div className="py-8 space-y-6 text-center animate-in zoom-in duration-300">
               <div className="h-20 w-20 rounded-[2.5rem] bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#0f172a]">{t("intel_report_ready")}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("intel_report_filename")}: TS_INTEL_REPT_{new Date().getFullYear()}.pdf</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t("intel_report_summary")}</p>
                  <ul className="text-[11px] font-bold text-slate-600 space-y-1">
                     <li className="flex justify-between"><span>{t("intel_report_scope")}:</span> <span className="text-teal-600">{filters.governorates.length || t("intel_report_national")}</span></li>
                     <li className="flex justify-between"><span>{t("intel_report_signals")}:</span> <span className="text-teal-600">4,250+</span></li>
                     <li className="flex justify-between"><span>{t("intel_report_privacy")}:</span> <span className="text-teal-600">{t("intel_report_enforced")}</span></li>
                  </ul>
               </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                 <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("intel_report_metrics")}</Label>
                 <div className="grid grid-cols-2 gap-4">
                    {["vaccine_effect", "symptom", "availability", "access"].map((cat) => (
                      <div key={cat} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                        <Checkbox id={`report-${cat}`} defaultChecked />
                        <Label htmlFor={`report-${cat}`} className="text-xs font-bold text-slate-700 capitalize">
                          {t(`intel_cat_${cat}` as any)}
                        </Label>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                 <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                 <div className="space-y-1">
                    <p className="text-[11px] font-black text-emerald-900 uppercase tracking-wide">{t("intel_report_sync_title")}</p>
                    <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">
                       {t("intel_report_sync_desc")}
                    </p>
                 </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-3 sm:justify-start">
          <Button 
            onClick={handleGenerate}
            disabled={generating}
            className={`flex-1 h-12 rounded-2xl font-black uppercase tracking-widest transition-all ${
              done ? "bg-emerald-600 hover:bg-emerald-600" : "bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-900/10"
            }`}
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("intel_report_aggregating")}
              </span>
            ) : done ? (
              <span className="flex items-center gap-2">
                <FileDown className="h-4 w-4" /> {t("intel_report_download")}
              </span>
            ) : (
              t("intel_report_generate")
            )}
          </Button>
          {!done && (
            <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="h-12 rounded-2xl font-black text-slate-400"
            >
                {t("cancel")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
