import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { HospitalContent } from "../cms.types";

function TagInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => { const v = input.trim(); if (v) onChange([...values, v]); setInput(""); };
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
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Hospital Name (Arabic)</Label>
          <Input dir="rtl" value={data.hospital_name_ar || ""} onChange={e => onChange({ hospital_name_ar: e.target.value })} placeholder="اسم المستشفى بالعربية" />
        </div>
        <div className="space-y-2">
          <Label>Hospital Name (English)</Label>
          <Input value={data.hospital_name_en || ""} onChange={e => onChange({ hospital_name_en: e.target.value })} placeholder="Hospital Name in English" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City / المدينة</Label>
          <Input value={data.city || ""} onChange={e => onChange({ city: e.target.value })} placeholder="Cairo, Alexandria..." />
        </div>
        <div className="space-y-2">
          <Label>Working Hours</Label>
          <Input value={data.working_hours || ""} onChange={e => onChange({ working_hours: e.target.value })} placeholder="e.g. 8:00 AM – 10:00 PM" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Address / العنوان</Label>
        <Input dir="rtl" value={data.address || ""} onChange={e => onChange({ address: e.target.value })} placeholder="العنوان بالتفصيل" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Latitude</Label>
          <Input type="number" step="any" value={data.coordinates?.lat ?? ""} onChange={e => onChange({ coordinates: { lat: +e.target.value, lng: data.coordinates?.lng ?? 0 } })} placeholder="30.0444" />
        </div>
        <div className="space-y-2">
          <Label>Longitude</Label>
          <Input type="number" step="any" value={data.coordinates?.lng ?? ""} onChange={e => onChange({ coordinates: { lat: data.coordinates?.lat ?? 0, lng: +e.target.value } })} placeholder="31.2357" />
        </div>
      </div>

      <TagInput label="Specializations / التخصصات" values={data.specializations || []} onChange={v => onChange({ specializations: v })} placeholder="e.g. Pediatrics, Cardiology" />
      <TagInput label="Services / الخدمات" values={data.services || []} onChange={v => onChange({ services: v })} placeholder="e.g. Emergency, NICU" />
      <TagInput label="Contact Numbers / أرقام التواصل" values={data.contact_numbers || []} onChange={v => onChange({ contact_numbers: v })} placeholder="e.g. 0201234567" />

      <div className="space-y-2">
        <Label>Website</Label>
        <Input value={data.website || ""} onChange={e => onChange({ website: e.target.value })} placeholder="https://hospital.eg" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Open 24/7", key: "is_24_7" as keyof HospitalContent },
          { label: "Children's Ward", key: "has_children_ward" as keyof HospitalContent },
          { label: "Emergency Dept.", key: "has_emergency" as keyof HospitalContent },
        ].map(t => (
          <div key={t.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <p className="text-xs font-semibold text-[#334155]">{t.label}</p>
            <Switch checked={(data[t.key] as boolean) || false} onCheckedChange={v => onChange({ [t.key]: v } as any)} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Distance (km) — for app</Label>
        <Input type="number" step="0.1" value={data.distance_km ?? ""} onChange={e => onChange({ distance_km: +e.target.value })} placeholder="5.2" className="h-9" />
      </div>
    </div>
  );
}
