import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { HealthUnitContent } from "../cms.types";

import { useI18n, useT } from "@/i18n/i18n.context";

function TagInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const { isRTL } = useI18n();
  const [input, setInput] = useState("");
  const add = () => { const v = input.trim(); if (v) onChange([...values, v]); setInput(""); };
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
              {v}<button onClick={() => onChange(values.filter((_, j) => j !== i))}><X className="h-2.5 w-2.5" /></button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  data: Partial<HealthUnitContent>;
  onChange: (patch: Partial<HealthUnitContent>) => void;
}

export function HealthUnitsForm({ data, onChange }: Props) {
  const t = useT();
  const { isRTL } = useI18n();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("cms_field_unitName")} ({isRTL ? "عربي" : "Arabic"})</Label>
          <Input dir="rtl" value={data.unit_name_ar || ""} onChange={e => onChange({ unit_name_ar: e.target.value })} placeholder={isRTL ? "اسم الوحدة بالعربية" : "Unit Name (Arabic)"} />
        </div>
        <div className="space-y-2">
          <Label>{t("cms_field_unitName")} ({isRTL ? "إنجليزي" : "English"})</Label>
          <Input value={data.unit_name_en || ""} onChange={e => onChange({ unit_name_en: e.target.value })} placeholder={isRTL ? "اسم الوحدة بالإنجليزي" : "Unit Name (English)"} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("cms_field_city")}</Label>
          <Input 
            value={data.city || ""} 
            onChange={e => onChange({ city: e.target.value })} 
            placeholder={isRTL ? "اسم المدينة" : "City name"} 
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-2">
          <Label>{isRTL ? "رقم التواصل" : "Contact Number"}</Label>
          <Input 
            value={data.contact_number || ""} 
            onChange={e => onChange({ contact_number: e.target.value })} 
            placeholder="0201234567" 
            dir="ltr"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("cms_field_address")}</Label>
        <Input dir="rtl" value={data.address || ""} onChange={e => onChange({ address: e.target.value })} placeholder={isRTL ? "العنوان بالتفصيل" : "Detailed Address"} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{isRTL ? "ساعات العمل" : "Working Hours"}</Label>
          <Input 
            value={data.working_hours || ""} 
            onChange={e => onChange({ working_hours: e.target.value })} 
            placeholder="8:00 AM – 2:00 PM" 
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-2">
          <Label>{isRTL ? "أيام العمل" : "Working Days"}</Label>
          <Input 
            value={data.working_days || ""} 
            onChange={e => onChange({ working_days: e.target.value })} 
            placeholder={isRTL ? "الأحد – الخميس" : "Sunday – Thursday"} 
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{isRTL ? "خط العرض" : "Latitude"}</Label>
          <Input type="number" step="any" value={data.coordinates?.lat ?? ""} onChange={e => onChange({ coordinates: { lat: +e.target.value, lng: data.coordinates?.lng ?? 0 } })} dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>{isRTL ? "خط الطول" : "Longitude"}</Label>
          <Input type="number" step="any" value={data.coordinates?.lng ?? ""} onChange={e => onChange({ coordinates: { lat: data.coordinates?.lat ?? 0, lng: +e.target.value } })} dir="ltr" />
        </div>
      </div>

      <TagInput label={t("cms_field_services")} values={data.services_offered || []} onChange={v => onChange({ services_offered: v })} placeholder={isRTL ? "مثال: تطعيمات، متابعة نمو" : "e.g. Vaccinations, Growth monitoring"} />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div>
            <p className="text-xs font-semibold text-emerald-900">{isRTL ? "خدمات مجانية" : "Free Services"}</p>
          </div>
          <Switch checked={data.is_free || false} onCheckedChange={v => onChange({ is_free: v })} />
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <div>
            <p className="text-xs font-semibold text-blue-900">{isRTL ? "توفر تطعيمات" : "Has Vaccination"}</p>
          </div>
          <Switch checked={data.has_vaccination || false} onCheckedChange={v => onChange({ has_vaccination: v })} />
        </div>
      </div>

      {data.has_vaccination && (
        <TagInput label={isRTL ? "أنواع التطعيمات" : "Vaccination Types"} values={data.vaccination_types || []} onChange={v => onChange({ vaccination_types: v })} placeholder={isRTL ? "مثال: شلل الأطفال" : "e.g. Polio, MMR"} />
      )}
    </div>
  );
}
