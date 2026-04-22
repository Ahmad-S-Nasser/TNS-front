import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Syringe, Info, ShieldAlert, Stethoscope } from "lucide-react";
import { AgeScheduleEditor } from "./AgeScheduleEditor";
import { SideEffectsEditor } from "./SideEffectsEditor";
import { PlacesSelector } from "./PlacesSelector";
import { VaccineContent } from "./vaccine.types";

interface Props {
  data: Partial<VaccineContent>;
  onChange: (patch: Partial<VaccineContent>) => void;
}

export function VaccineEditor({ data, onChange }: Props) {
  const color = "#0D9488"; // Teal for vaccines

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Medical Disclaimer Section */}
      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3">
        <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-red-800 uppercase tracking-wide">Medical Integrity Protocol</p>
          <p className="text-[11px] text-red-700 leading-relaxed">
            All vaccine information provided must be clinically verified. Publishing incorrect dosages or schedules can have serious health implications.
          </p>
        </div>
      </div>

      {/* Core Type & Dose */}
      <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-[#334155] flex items-center gap-2">
            <Syringe className="h-3.5 w-3.5" /> Vaccine Classification
          </Label>
          <Select 
            value={data.vaccine_type || "FREE"} 
            onValueChange={v => onChange({ vaccine_type: v as any })}
          >
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FREE">Free (Government Mandatory)</SelectItem>
              <SelectItem value="PAID">Paid (Optional / Private)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs font-bold text-[#334155]">Dose Count</Label>
          <Input 
            type="number" 
            min={1} 
            value={data.dose_count || 1}
            onChange={e => onChange({ dose_count: parseInt(e.target.value) })}
            className="bg-white"
          />
        </div>
      </div>

      <Separator />

      {/* Logic: Age Schedule */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
            <Info className="h-4 w-4 text-teal-600" /> Mandatory Age Schedule
          </Label>
          <Badge variant="outline" className="text-[10px] uppercase">Age-Sensitive</Badge>
        </div>
        <AgeScheduleEditor 
          selected={data.age_schedule || []} 
          onChange={val => onChange({ age_schedule: val })}
          color={color}
        />
      </div>

      {/* Medical Info: Multi-language */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-extrabold text-[#334155] uppercase tracking-wider">Importance & Benefits (EN)</Label>
            <Textarea 
              value={data.importance_en} 
              onChange={e => onChange({ importance_en: e.target.value })} 
              rows={3}
              placeholder="Why this vaccine is essential..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-extrabold text-[#334155] uppercase tracking-wider">Risks of Missing (EN)</Label>
            <Textarea 
              value={data.risks_of_missing_en} 
              onChange={e => onChange({ risks_of_missing_en: e.target.value })} 
              rows={3}
              placeholder="Potential health risks if skipped..."
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-extrabold text-[#334155] uppercase tracking-wider text-right block">الأهمية والفوائد (AR)</Label>
            <Textarea 
              dir="rtl"
              value={data.importance_ar} 
              onChange={e => onChange({ importance_ar: e.target.value })} 
              rows={3}
              className="text-right"
              placeholder="لماذا هذا اللقاح ضروري..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-extrabold text-[#334155] uppercase tracking-wider text-right block">المخاطر عند التفويت (AR)</Label>
            <Textarea 
              dir="rtl"
              value={data.risks_of_missing_ar} 
              onChange={e => onChange({ risks_of_missing_ar: e.target.value })} 
              rows={3}
              className="text-right"
              placeholder="المخاطر الصحية المحتملة عند التخلف..."
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Section: Side Effects */}
      <div className="space-y-4">
        <Label className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-teal-600" /> Side Effects & Management
        </Label>
        <SideEffectsEditor 
          effects={data.side_effects || []} 
          onChange={val => onChange({ side_effects: val })}
          color={color}
        />
      </div>

      {/* Paid Options: Price & Places */}
      {data.vaccine_type === "PAID" && (
        <div className="space-y-6 p-5 bg-teal-50 border border-teal-100 rounded-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-sm">
              <span className="text-sm font-bold">$</span>
            </div>
            <div>
              <p className="text-sm font-bold text-teal-900 border-b border-teal-200 inline-block mb-1">Fee & Location Configuration</p>
              <p className="text-[10px] text-teal-700">Set pricing and link to clinical locations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-teal-900">Estimated Price</Label>
              <Input 
                type="number" 
                value={data.price} 
                onChange={e => onChange({ price: parseFloat(e.target.value) })}
                className="bg-white border-teal-200 text-teal-900" 
                placeholder="250.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-teal-900">Currency</Label>
              <Input 
                value={data.currency || "EGP"} 
                onChange={e => onChange({ currency: e.target.value })}
                className="bg-white border-teal-200 text-teal-900 uppercase" 
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-xs font-bold text-teal-900">Link Clinical Locations</Label>
            <PlacesSelector 
              selectedIds={data.available_places || []} 
              onChange={val => onChange({ available_places: val })}
              color={color}
            />
          </div>
        </div>
      )}

      {/* Specialized Requirement: Warning Signs (List input simplified for UI) */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-[#334155] flex items-center gap-2">
            <Stethoscope className="h-3.5 w-3.5" /> Warning Signs (EN)
          </Label>
          <Textarea 
            value={data.warning_signs_en?.join("\n")} 
            onChange={e => onChange({ warning_signs_en: e.target.value.split("\n").filter(x => !!x) })} 
            rows={3}
            placeholder="Signs requiring immediate medical help (one per line)..."
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-[#334155] flex items-center gap-2 text-right block">
             علامات تحذيرية (AR) <Stethoscope className="h-3.5 w-3.5 inline ml-2" />
          </Label>
          <Textarea 
            dir="rtl"
            value={data.warning_signs_ar?.join("\n")} 
            onChange={e => onChange({ warning_signs_ar: e.target.value.split("\n").filter(x => !!x) })} 
            rows={3}
            className="text-right"
            placeholder="علامات تتطلب مساعدة طبية فورية (علامة في كل سطر)..."
          />
        </div>
      </div>
    </div>
  );
}
