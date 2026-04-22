import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { NutritionContent, AgeCategory, MealType } from "../cms.types";
import { useI18n, useT } from "@/i18n/i18n.context";

function TagInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const { isRTL } = useI18n();
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
        <Input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} 
          placeholder={placeholder || (isRTL ? "اكتب واضغط Enter..." : "Type and press Enter...")} 
          className="h-8 text-sm" 
          dir={isRTL ? "rtl" : "ltr"}
        />
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
  const t = useT();
  const { isRTL } = useI18n();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("cms_field_ageGroup")}</Label>
          <Select value={data.age_group || ""} onValueChange={v => onChange({ age_group: v as AgeCategory })}>
            <SelectTrigger><SelectValue placeholder={t("filter")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="infant">{t("cat_infant")}</SelectItem>
              <SelectItem value="toddler">{t("cat_toddler")}</SelectItem>
              <SelectItem value="preschool">{t("cat_preschool")}</SelectItem>
              <SelectItem value="school-age">{t("cat_schoolAge")}</SelectItem>
              <SelectItem value="adolescent">{t("cat_adolescent")}</SelectItem>
              <SelectItem value="all">{t("cat_allAges")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("cms_field_mealType")}</Label>
          <Select value={data.meal_type || ""} onValueChange={v => onChange({ meal_type: v as MealType })}>
            <SelectTrigger><SelectValue placeholder={t("filter")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">{isRTL ? "إفطار" : "Breakfast"}</SelectItem>
              <SelectItem value="lunch">{isRTL ? "غداء" : "Lunch"}</SelectItem>
              <SelectItem value="dinner">{isRTL ? "عشاء" : "Dinner"}</SelectItem>
              <SelectItem value="snack">{isRTL ? "وجبة خفيفة" : "Snack"}</SelectItem>
              <SelectItem value="supplement">{isRTL ? "مكمل" : "Supplement"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TagInput label={t("cms_field_recommendedFoods")} values={data.recommended_foods || []} onChange={v => onChange({ recommended_foods: v })} placeholder={isRTL ? "مثال: خضار مطبوخة" : "e.g. Cooked vegetables"} />
      <TagInput label={t("cms_field_restrictedFoods")} values={data.restricted_foods || []} onChange={v => onChange({ restricted_foods: v })} placeholder={isRTL ? "مثال: الأطعمة المقلية" : "e.g. Fried foods"} />
      <TagInput label={t("cms_field_tips")} values={data.tips || []} onChange={v => onChange({ tips: v })} />

      <div className="space-y-2">
        <Label>{t("cms_field_notes")} ({isRTL ? "اختياري" : "Optional"})</Label>
        <Input 
          value={data.nutritional_notes || ""} 
          onChange={e => onChange({ nutritional_notes: e.target.value })} 
          placeholder={isRTL ? "أي ملاحظات غذائية إضافية..." : "Any additional nutritional notes..."} 
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div>
          <p className="text-sm font-semibold text-[#334155]">{t("cms_field_hasImages")}</p>
          <p className="text-xs text-[#94a3b8]">{isRTL ? "التفعيل لإضافة رابط الصورة أدناه" : "Enable to add image URL below"}</p>
        </div>
        <Switch checked={data.has_images || false} onCheckedChange={v => onChange({ has_images: v })} />
      </div>

      {data.has_images && (
        <div className="space-y-2 animate-in slide-in-from-top-2">
          <Label>{t("cms_field_imageUrl")}</Label>
          <Input value={data.image_url || ""} onChange={e => onChange({ image_url: e.target.value })} placeholder="https://..." />
        </div>
      )}
    </div>
  );
}
