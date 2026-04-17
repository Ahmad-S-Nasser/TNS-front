import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { EmergencyContent, EmergencyType } from "../cms.types";

import { useI18n, useT } from "@/i18n/i18n.context";

const ICON_OPTIONS = ["ambulance", "shield", "flame", "siren", "phone", "alert-triangle", "heart-pulse", "shield-alert"];
const COLOR_OPTIONS = ["#EF4444", "#F97316", "#F59E0B", "#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#EC4899"];

interface Props {
  data: Partial<EmergencyContent>;
  onChange: (patch: Partial<EmergencyContent>) => void;
}

export function EmergencyForm({ data, onChange }: Props) {
  const t = useT();
  const { isRTL } = useI18n();

  return (
    <div className="space-y-5">
      {/* Critical Warning */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm font-bold text-red-800">⚠️ {isRTL ? "محتوى طوارئ" : "Emergency Content"}</p>
        <p className="text-xs text-red-700 mt-1">
          {isRTL 
            ? "يظهر هذا المحتوى بشكل بارز في قسم الطوارئ بالتطبيق. يرجى التأكد من الدقة قبل النشر." 
            : "This content is displayed prominently in the mobile app's emergency section. Ensure accuracy before publishing."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("cms_field_emergencyType")}</Label>
          <Select value={data.emergency_type || ""} onValueChange={v => onChange({ emergency_type: v as EmergencyType })}>
            <SelectTrigger><SelectValue placeholder={t("filter")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ambulance">{isRTL ? "إسعاف" : "Ambulance"}</SelectItem>
              <SelectItem value="fire">{isRTL ? "حريق" : "Fire"}</SelectItem>
              <SelectItem value="police">{isRTL ? "شرطة" : "Police"}</SelectItem>
              <SelectItem value="poison-control">{isRTL ? "مكافحة السموم" : "Poison Control"}</SelectItem>
              <SelectItem value="child-protection">{isRTL ? "حماية الطفل" : "Child Protection"}</SelectItem>
              <SelectItem value="mental-health-crisis">{isRTL ? "أزمة نفسية" : "Mental Health Crisis"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{isRTL ? "رقم هاتف الطوارئ" : "Emergency Phone Number"}</Label>
          <Input
            value={data.phone_number || ""}
            onChange={e => onChange({ phone_number: e.target.value })}
            placeholder="123"
            className="text-2xl font-bold h-10"
            dir="ltr"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{isRTL ? "المنطقة / النطاق الجغرافي" : "Region"}</Label>
        <Input 
          value={data.region || ""} 
          onChange={e => onChange({ region: e.target.value })} 
          placeholder={isRTL ? "مصر / القاهرة / على مستوى الجمهورية" : "Egypt / Cairo / National"} 
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("cms_field_whenToCall")}</Label>
        <Textarea 
          value={data.when_to_call || ""} 
          onChange={e => onChange({ when_to_call: e.target.value })} 
          rows={2} 
          placeholder={isRTL ? "وصف مختصر للحالات التي تتطلب هذا الاتصال..." : "Brief description of situations that require this call..."} 
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

      <div className="space-y-2">
        <Label>{isRTL ? "ملاحظات للوالدين" : "Notes for Parents"}</Label>
        <Textarea 
          value={data.notes_for_parents || ""} 
          onChange={e => onChange({ notes_for_parents: e.target.value })} 
          rows={3} 
          placeholder={isRTL ? "اكتبي التعليمات الأساسية للوالدين عند الاتصال..." : "Basic instructions for parents when calling..."} 
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

      {/* Color Picker */}
      <div className="space-y-2">
        <Label>{isRTL ? "لون التطبيق" : "App Color"}</Label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map(c => (
            <button
              key={c}
              onClick={() => onChange({ color: c })}
              className={`h-8 w-8 rounded-full border-3 transition-all ${data.color === c ? "scale-125 ring-2 ring-offset-2 ring-slate-500" : ""}`}
              style={{ backgroundColor: c, borderColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Icon Picker */}
      <div className="space-y-2">
        <Label>{isRTL ? "رمز الأيقونة" : "Icon Key"}</Label>
        <div className="flex gap-2 flex-wrap">
          {ICON_OPTIONS.map(ic => (
            <button
              key={ic}
              onClick={() => onChange({ icon: ic })}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${data.icon === ic ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
            >
              {ic}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
        <div>
          <p className="text-sm font-bold text-red-900">{isRTL ? "متاح على مدار الساعة" : "Available 24/7"}</p>
        </div>
        <Switch checked={data.is_24_7 || false} onCheckedChange={v => onChange({ is_24_7: v })} />
      </div>
    </div>
  );
}
