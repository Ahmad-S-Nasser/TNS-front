import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { NutritionContent, AgeCategory, MealType } from "../cms.types";

function TagInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim();
    if (val) { onChange([...values, val]); }
    setInput("");
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} placeholder={placeholder || "Type and press Enter..."} className="h-8 text-sm" />
        <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={add}><Plus className="h-3.5 w-3.5" /></Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {values.map((v, i) => (
            <Badge key={i} variant="secondary" className="text-xs gap-1 pr-1">
              {v}
              <button onClick={() => onChange(values.filter((_, j) => j !== i))}><X className="h-2.5 w-2.5" /></button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  data: Partial<NutritionContent>;
  onChange: (patch: Partial<NutritionContent>) => void;
}

export function NutritionForm({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Age Group</Label>
          <Select value={data.age_group || ""} onValueChange={v => onChange({ age_group: v as AgeCategory })}>
            <SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="infant">Infant (0–2 yrs)</SelectItem>
              <SelectItem value="toddler">Toddler (2–4 yrs)</SelectItem>
              <SelectItem value="preschool">Preschool (4–6 yrs)</SelectItem>
              <SelectItem value="school-age">School Age (6–12 yrs)</SelectItem>
              <SelectItem value="adolescent">Adolescent (12–18 yrs)</SelectItem>
              <SelectItem value="all">All Ages</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Meal Type</Label>
          <Select value={data.meal_type || ""} onValueChange={v => onChange({ meal_type: v as MealType })}>
            <SelectTrigger><SelectValue placeholder="Select meal type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
              <SelectItem value="supplement">Supplement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TagInput label="Recommended Foods / الأطعمة المقترحة" values={data.recommended_foods || []} onChange={v => onChange({ recommended_foods: v })} placeholder="e.g. خضار مطبوخة" />
      <TagInput label="Restricted Foods / الأطعمة الممنوعة" values={data.restricted_foods || []} onChange={v => onChange({ restricted_foods: v })} placeholder="e.g. الأطعمة المقلية" />
      <TagInput label="Nutrition Tips / نصائح غذائية" values={data.tips || []} onChange={v => onChange({ tips: v })} />

      <div className="space-y-2">
        <Label>Nutritional Notes (Optional)</Label>
        <Input value={data.nutritional_notes || ""} onChange={e => onChange({ nutritional_notes: e.target.value })} placeholder="Any additional nutritional notes..." />
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div>
          <p className="text-sm font-semibold text-[#334155]">Has Images</p>
          <p className="text-xs text-[#94a3b8]">Enable to add image URL below</p>
        </div>
        <Switch checked={data.has_images || false} onCheckedChange={v => onChange({ has_images: v })} />
      </div>

      {data.has_images && (
        <div className="space-y-2 animate-in slide-in-from-top-2">
          <Label>Image URL</Label>
          <Input value={data.image_url || ""} onChange={e => onChange({ image_url: e.target.value })} placeholder="https://..." />
        </div>
      )}
    </div>
  );
}
