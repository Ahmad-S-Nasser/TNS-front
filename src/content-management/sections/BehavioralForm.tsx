import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { BehavioralContent, SeverityLevel } from "../cms.types";
import { useI18n, useT } from "@/i18n/i18n.context";

interface Props {
  data: Partial<BehavioralContent>;
  onChange: (patch: Partial<BehavioralContent>) => void;
}

function TagInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const { isRTL } = useI18n();
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim();
    if (val && !values.includes(val)) { onChange([...values, val]); }
    setInput("");
  };
  return (
    <div className="space-y-2">
      <Label className="text-[10px] uppercase text-slate-400 font-bold">{label}</Label>
      <div className="flex gap-2">
        <Input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} 
          placeholder={placeholder || (isRTL ? "اكتب واضغط Enter..." : "Type and press Enter...")} 
          className="h-8 text-sm" 
        />
        <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={add}><Plus className="h-3.5 w-3.5" /></Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {values.map((v, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] gap-1 pr-1">
              {v}
              <button onClick={() => onChange(values.filter((_, j) => j !== i))} className="hover:text-red-500"><X className="h-2.5 w-2.5" /></button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function BehavioralForm({ data, onChange }: Props) {
  const t = useT();
  const { isRTL } = useI18n();

  return (
    <div className="space-y-6">
      {/* Problem Type */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-600">{t("cms_field_problemType")} (AR)</Label>
          <Input 
            value={data.problem_type_ar || ""} 
            onChange={e => onChange({ problem_type_ar: e.target.value })} 
            placeholder="عدوانية، فرط حركة..." 
            dir="rtl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-600">{t("cms_field_problemType")} (EN)</Label>
          <Input 
            value={data.problem_type_en || ""} 
            onChange={e => onChange({ problem_type_en: e.target.value })} 
            placeholder="Aggression, ADHD..." 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold text-slate-600">{t("cms_field_severity")}</Label>
        <Select value={data.severity || ""} onValueChange={v => onChange({ severity: v as SeverityLevel })}>
          <SelectTrigger><SelectValue placeholder={t("filter")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mild">{isRTL ? "خفيف" : "Mild"}</SelectItem>
            <SelectItem value="moderate">{isRTL ? "متوسط" : "Moderate"}</SelectItem>
            <SelectItem value="severe">{isRTL ? "شديد" : "Severe"}</SelectItem>
            <SelectItem value="critical">{isRTL ? "حرج" : "Critical"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bilingual Tags */}
      <div className="grid grid-cols-2 gap-6">
         <div className="space-y-4">
            <TagInput label={`${t("cms_field_symptoms")} (AR)`} values={data.symptoms_ar || []} onChange={v => onChange({ symptoms_ar: v })} />
            <TagInput label={`${t("cms_field_causes")} (AR)`} values={data.causes_ar || []} onChange={v => onChange({ causes_ar: v })} />
            <TagInput label={`${t("cms_field_recommendedActions")} (AR)`} values={data.recommended_actions_ar || []} onChange={v => onChange({ recommended_actions_ar: v })} />
         </div>
         <div className="space-y-4">
            <TagInput label={`${t("cms_field_symptoms")} (EN)`} values={data.symptoms_en || []} onChange={v => onChange({ symptoms_en: v })} />
            <TagInput label={`${t("cms_field_causes")} (EN)`} values={data.causes_en || []} onChange={v => onChange({ causes_en: v })} />
            <TagInput label={`${t("cms_field_recommendedActions")} (EN)`} values={data.recommended_actions_en || []} onChange={v => onChange({ recommended_actions_en: v })} />
         </div>
      </div>

      {/* Bilingual Seek Help When */}
      <div className="space-y-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-amber-900">{t("cms_field_seekHelpWhen")} (AR)</Label>
          <Textarea 
            value={data.seek_help_when_ar || ""} 
            onChange={e => onChange({ seek_help_when_ar: e.target.value })} 
            rows={2} 
            placeholder="متى يجب استشارة الطبيب..." 
            dir="rtl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-amber-900">{t("cms_field_seekHelpWhen")} (EN)</Label>
          <Textarea 
            value={data.seek_help_when_en || ""} 
            onChange={e => onChange({ seek_help_when_en: e.target.value })} 
            rows={2} 
            placeholder="When to consult a doctor..." 
          />
        </div>
      </div>
    </div>
  );
}
