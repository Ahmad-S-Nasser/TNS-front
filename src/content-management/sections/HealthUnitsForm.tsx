import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { HealthUnitContent } from "../cms.types";

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
  data: Partial<HealthUnitContent>;
  onChange: (patch: Partial<HealthUnitContent>) => void;
}

export function HealthUnitsForm({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Unit Name (Arabic)</Label>
          <Input dir="rtl" value={data.unit_name_ar || ""} onChange={e => onChange({ unit_name_ar: e.target.value })} placeholder="اسم الوحدة بالعربية" />
        </div>
        <div className="space-y-2">
          <Label>Unit Name (English)</Label>
          <Input value={data.unit_name_en || ""} onChange={e => onChange({ unit_name_en: e.target.value })} placeholder="Unit Name in English" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City / المدينة</Label>
          <Input value={data.city || ""} onChange={e => onChange({ city: e.target.value })} placeholder="City name" />
        </div>
        <div className="space-y-2">
          <Label>Contact Number</Label>
          <Input value={data.contact_number || ""} onChange={e => onChange({ contact_number: e.target.value })} placeholder="0201234567" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Address / العنوان</Label>
        <Input dir="rtl" value={data.address || ""} onChange={e => onChange({ address: e.target.value })} placeholder="العنوان بالتفصيل" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Working Hours</Label>
          <Input value={data.working_hours || ""} onChange={e => onChange({ working_hours: e.target.value })} placeholder="8:00 AM – 2:00 PM" />
        </div>
        <div className="space-y-2">
          <Label>Working Days</Label>
          <Input value={data.working_days || ""} onChange={e => onChange({ working_days: e.target.value })} placeholder="Sunday – Thursday" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Latitude</Label>
          <Input type="number" step="any" value={data.coordinates?.lat ?? ""} onChange={e => onChange({ coordinates: { lat: +e.target.value, lng: data.coordinates?.lng ?? 0 } })} />
        </div>
        <div className="space-y-2">
          <Label>Longitude</Label>
          <Input type="number" step="any" value={data.coordinates?.lng ?? ""} onChange={e => onChange({ coordinates: { lat: data.coordinates?.lat ?? 0, lng: +e.target.value } })} />
        </div>
      </div>

      <TagInput label="Services Offered / الخدمات المقدمة" values={data.services_offered || []} onChange={v => onChange({ services_offered: v })} placeholder="e.g. Vaccinations, Growth monitoring" />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div>
            <p className="text-xs font-semibold text-emerald-900">Free Services / مجاني</p>
          </div>
          <Switch checked={data.is_free || false} onCheckedChange={v => onChange({ is_free: v })} />
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <div>
            <p className="text-xs font-semibold text-blue-900">Has Vaccination / تطعيمات</p>
          </div>
          <Switch checked={data.has_vaccination || false} onCheckedChange={v => onChange({ has_vaccination: v })} />
        </div>
      </div>

      {data.has_vaccination && (
        <TagInput label="Vaccination Types / أنواع التطعيمات" values={data.vaccination_types || []} onChange={v => onChange({ vaccination_types: v })} placeholder="e.g. Polio, MMR" />
      )}
    </div>
  );
}
