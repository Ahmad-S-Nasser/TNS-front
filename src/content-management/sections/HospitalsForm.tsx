import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { HospitalContent } from "../cms.types";

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
  data: Partial<HospitalContent>;
  onChange: (patch: Partial<HospitalContent>) => void;
}

export function HospitalsForm({ data, onChange }: Props) {
  const t = useT();
  const { isRTL } = useI18n();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("cms_field_hospitalName")} ({isRTL ? "عربي" : "Arabic"})</Label>
          <Input dir="rtl" value={data.hospital_name_ar || ""} onChange={e => onChange({ hospital_name_ar: e.target.value })} placeholder={isRTL ? "اسم المستشفى بالعربية" : "Hospital Name (Arabic)"} />
        </div>
        <div className="space-y-2">
          <Label>{t("cms_field_hospitalName")} ({isRTL ? "إنجليزي" : "English"})</Label>
          <Input value={data.hospital_name_en || ""} onChange={e => onChange({ hospital_name_en: e.target.value })} placeholder={isRTL ? "اسم المستشفى بالإنجليزي" : "Hospital Name (English)"} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("cms_field_city")}</Label>
          <Input 
            value={data.city || ""} 
            onChange={e => onChange({ city: e.target.value })} 
            placeholder={isRTL ? "القاهرة، الإسكندرية..." : "Cairo, Alexandria..."} 
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-2">
          <Label>{isRTL ? "ساعات العمل" : "Working Hours"}</Label>
          <Input 
            value={data.working_hours || ""} 
            onChange={e => onChange({ working_hours: e.target.value })} 
            placeholder={isRTL ? "مثال: 8:00 صباحاً – 10:00 مساءً" : "e.g. 8:00 AM – 10:00 PM"} 
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("cms_field_address")}</Label>
        <Input dir="rtl" value={data.address || ""} onChange={e => onChange({ address: e.target.value })} placeholder={isRTL ? "العنوان بالتفصيل" : "Detailed Address"} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{isRTL ? "خط العرض" : "Latitude"}</Label>
          <Input type="number" step="any" value={data.coordinates?.lat ?? ""} onChange={e => onChange({ coordinates: { lat: +e.target.value, lng: data.coordinates?.lng ?? 0 } })} placeholder="30.0444" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>{isRTL ? "خط الطول" : "Longitude"}</Label>
          <Input type="number" step="any" value={data.coordinates?.lng ?? ""} onChange={e => onChange({ coordinates: { lat: data.coordinates?.lat ?? 0, lng: +e.target.value } })} placeholder="31.2357" dir="ltr" />
        </div>
      </div>

      <TagInput label={t("cms_field_specializations")} values={data.specializations || []} onChange={v => onChange({ specializations: v })} placeholder={isRTL ? "مثال: أطفال، قلب" : "e.g. Pediatrics, Cardiology"} />
      <TagInput label={t("cms_field_services")} values={data.services || []} onChange={v => onChange({ services: v })} placeholder={isRTL ? "مثال: طوارئ، حضانات" : "e.g. Emergency, NICU"} />
      <TagInput label={t("cms_field_phoneNumbers")} values={data.contact_numbers || []} onChange={v => onChange({ contact_numbers: v })} placeholder={isRTL ? "مثال: 0201234567" : "e.g. 0201234567"} />

      <div className="space-y-2">
        <Label>{isRTL ? "الموقع الإلكتروني" : "Website"}</Label>
        <Input value={data.website || ""} onChange={e => onChange({ website: e.target.value })} placeholder="https://hospital.eg" dir="ltr" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { labelKey: isRTL ? "متاح 24/7" : "Open 24/7", key: "is_24_7" as keyof HospitalContent },
          { labelKey: isRTL ? "قسم أطفال" : "Children's Ward", key: "has_children_ward" as keyof HospitalContent },
          { labelKey: isRTL ? "قسم طوارئ" : "Emergency Dept.", key: "has_emergency" as keyof HospitalContent },
        ].map(item => (
          <div key={item.key} className="flex flex-col items-center justify-between p-3 bg-slate-50 rounded-xl gap-2 text-center">
            <p className="text-[10px] font-bold text-[#334155] leading-tight">{item.labelKey}</p>
            <Switch checked={(data[item.key] as boolean) || false} onCheckedChange={v => onChange({ [item.key]: v } as any)} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>{isRTL ? "المسافة (كم) — للتطبيق" : "Distance (km) — for app"}</Label>
        <Input type="number" step="0.1" value={data.distance_km ?? ""} onChange={e => onChange({ distance_km: +e.target.value })} placeholder="5.2" className="h-9" dir="ltr" />
      </div>
    </div>
  );
}
