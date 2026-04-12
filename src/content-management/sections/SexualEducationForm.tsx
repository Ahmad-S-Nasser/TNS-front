import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";
import type { SexualEducationContent, AgeCategory } from "../cms.types";

interface Props {
  data: Partial<SexualEducationContent>;
  onChange: (patch: Partial<SexualEducationContent>) => void;
}

export function SexualEducationForm({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      {/* Sensitive Warning */}
      {data.is_sensitive && (
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl animate-in fade-in">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Sensitive Content</p>
            <p className="text-xs text-amber-700 mt-1">This content requires both doctor and admin approval before publishing. It will be age-gated in the mobile app.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Age Category</Label>
          <Select value={data.age_category || ""} onValueChange={v => onChange({ age_category: v as AgeCategory })}>
            <SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="toddler">Toddler (2–4 yrs) — طفولة مبكرة</SelectItem>
              <SelectItem value="preschool">Preschool (4–6 yrs) — ما قبل المدرسة</SelectItem>
              <SelectItem value="school-age">School Age (6–12 yrs) — سن المدرسة</SelectItem>
              <SelectItem value="adolescent">Adolescent (12–18 yrs) — المراهقة</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Education Level</Label>
          <Select value={data.education_level || ""} onValueChange={v => onChange({ education_level: v as any })}>
            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic — أساسي</SelectItem>
              <SelectItem value="intermediate">Intermediate — متوسط</SelectItem>
              <SelectItem value="advanced">Advanced — متقدم</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Parent Explanation / شرح للوالدين</Label>
        <Textarea
          value={data.parent_explanation || ""}
          onChange={e => onChange({ parent_explanation: e.target.value })}
          rows={3}
          placeholder="Explain the context and how to present this to their child..."
          dir="rtl"
        />
      </div>

      <div className="space-y-2">
        <Label>Child-Appropriate Language / لغة مناسبة للطفل</Label>
        <Textarea
          value={data.child_appropriate_language || ""}
          onChange={e => onChange({ child_appropriate_language: e.target.value })}
          rows={3}
          placeholder="How to explain this concept to the child in simple, age-appropriate language..."
          dir="rtl"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <div>
            <p className="text-sm font-semibold text-amber-900">Mark as Sensitive Content</p>
            <p className="text-xs text-amber-700 mt-0.5">Requires additional approval and age gate in app</p>
          </div>
          <Switch checked={data.is_sensitive || false} onCheckedChange={v => onChange({ is_sensitive: v })} />
        </div>

        <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-100 rounded-xl">
          <div>
            <p className="text-sm font-semibold text-purple-900">Requires Professional Review</p>
            <p className="text-xs text-purple-700 mt-0.5">Must be reviewed by a qualified professional before approval</p>
          </div>
          <Switch checked={data.professional_review_required || false} onCheckedChange={v => onChange({ professional_review_required: v })} />
        </div>
      </div>

      {data.professional_review_required && (
        <div className="space-y-2 animate-in slide-in-from-top-2">
          <Label>Reviewed By (Professional Name)</Label>
          <Input value={data.reviewed_by_professional || ""} onChange={e => onChange({ reviewed_by_professional: e.target.value })} placeholder="Dr. Name..." />
        </div>
      )}
    </div>
  );
}
