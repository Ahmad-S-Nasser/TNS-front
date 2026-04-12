import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { BehavioralContent, SeverityLevel } from "../cms.types";

interface Props {
  data: Partial<BehavioralContent>;
  onChange: (patch: Partial<BehavioralContent>) => void;
}

function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim();
    if (val && !values.includes(val)) { onChange([...values, val]); }
    setInput("");
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Type and press Enter..." className="h-8 text-sm" />
        <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={add}><Plus className="h-3.5 w-3.5" /></Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {values.map((v, i) => (
            <Badge key={i} variant="secondary" className="text-xs gap-1 pr-1">
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
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Problem Type / نوع المشكلة</Label>
        <Input value={data.problem_type || ""} onChange={e => onChange({ problem_type: e.target.value })} placeholder="e.g. Aggression, ADHD, Tantrums" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Severity Level</Label>
          <Select value={data.severity || ""} onValueChange={v => onChange({ severity: v as SeverityLevel })}>
            <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild — خفيف</SelectItem>
              <SelectItem value="moderate">Moderate — متوسط</SelectItem>
              <SelectItem value="severe">Severe — شديد</SelectItem>
              <SelectItem value="critical">Critical — حرج</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Age Range (Months)</Label>
          <div className="flex gap-2">
            <Input type="number" placeholder="Min" value={data.age_range?.min_months ?? ""} onChange={e => onChange({ age_range: { min_months: +e.target.value, max_months: data.age_range?.max_months ?? 0 } })} className="h-9" />
            <Input type="number" placeholder="Max" value={data.age_range?.max_months ?? ""} onChange={e => onChange({ age_range: { min_months: data.age_range?.min_months ?? 0, max_months: +e.target.value } })} className="h-9" />
          </div>
        </div>
      </div>

      <TagInput label="Symptoms / الأعراض" values={data.symptoms || []} onChange={v => onChange({ symptoms: v })} />
      <TagInput label="Causes / الأسباب" values={data.causes || []} onChange={v => onChange({ causes: v })} />
      <TagInput label="Recommended Actions / الإجراءات المقترحة" values={data.recommended_actions || []} onChange={v => onChange({ recommended_actions: v })} />

      <div className="space-y-2">
        <Label>Seek Professional Help When / متى تطلبي المساعدة المتخصصة</Label>
        <Textarea value={data.seek_help_when || ""} onChange={e => onChange({ seek_help_when: e.target.value })} rows={3} placeholder="Describe when parents should consult a specialist..." />
      </div>
    </div>
  );
}
