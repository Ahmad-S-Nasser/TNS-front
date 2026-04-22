import React from "react";
import { TriggerType } from "./questionnaire.types";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n.context";
import { Clock, Info, Target, Zap } from "lucide-react";

interface Props {
  trigger: { type: TriggerType; value: string };
  onChange: (t: { type: TriggerType; value: string }) => void;
}

export function TriggerRulesEditor({ trigger, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-4 w-4 text-amber-500" />
        <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{t("que_trigger")}</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-slate-400">Trigger Type</Label>
          <Select 
            value={trigger.type} 
            onValueChange={(val: TriggerType) => onChange({ ...trigger, type: val })}
          >
            <SelectTrigger className="h-10 bg-white border-slate-100 font-bold text-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="age">{t("que_trigger_age")}</SelectItem>
              <SelectItem value="vaccine">{t("que_trigger_vaccine")}</SelectItem>
              <SelectItem value="time">{t("que_monthly")}</SelectItem>
              <SelectItem value="event">Specific Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-slate-400">Trigger Value</Label>
          <div className="relative">
             {trigger.type === "age" && <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />}
             {trigger.type === "vaccine" && <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />}
             
             <Input 
                value={trigger.value}
                onChange={(e) => onChange({ ...trigger, value: e.target.value })}
                placeholder={trigger.type === "age" ? "Months (e.g. 12)" : "Vaccine ID or Code"}
                className={`h-10 bg-white border-slate-100 font-bold ${trigger.type !== "time" ? "pl-9" : ""}`}
             />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 pt-2">
        <Info className="h-3 w-3 text-slate-400 mt-0.5" />
        <p className="text-[10px] text-slate-400 font-medium">
          Triggers determine when the parent receives the questionnaire in their mobile app. Age-based triggers are precise to the day.
        </p>
      </div>
    </div>
  );
}
