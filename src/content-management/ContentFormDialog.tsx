import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronLeft, Check, AlertTriangle } from "lucide-react";
import type { CMSSection, CMSContent, ContentStatus, AgeCategory } from "./cms.types";
import { createContent, updateContent, getSectionConfig } from "./cms.service";
import { BehavioralForm } from "./sections/BehavioralForm";
import { NutritionForm } from "./sections/NutritionForm";
import { SexualEducationForm } from "./sections/SexualEducationForm";
import { EducationalGamesForm } from "./sections/EducationalGamesForm";
import { HospitalsForm } from "./sections/HospitalsForm";
import { HealthUnitsForm } from "./sections/HealthUnitsForm";
import { EmergencyForm } from "./sections/EmergencyForm";

const AGE_CATEGORIES: { value: AgeCategory; label: string }[] = [
  { value: "infant", label: "Infant (0–2 yrs)" },
  { value: "toddler", label: "Toddler (2–4 yrs)" },
  { value: "preschool", label: "Preschool (4–6 yrs)" },
  { value: "school-age", label: "School Age (6–12 yrs)" },
  { value: "adolescent", label: "Adolescent (12–18 yrs)" },
  { value: "all", label: "All Ages" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: CMSSection;
  editItem: CMSContent | null;
  onSaved: () => void;
}

type Step = "base" | "section" | "review";

const STEPS: Step[] = ["base", "section", "review"];
const STEP_LABELS = { base: "Base Info", section: "Section Details", review: "Review & Save" };

export function ContentFormDialog({ open, onOpenChange, section, editItem, onSaved }: Props) {
  const cfg = getSectionConfig(section);
  const [step, setStep] = useState<Step>("base");

  // Base fields
  const [baseData, setBaseData] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    status: "draft" as ContentStatus,
    visibility: { age_categories: ["all"] as AgeCategory[], requires_login: false },
    tags: [] as string[],
  });

  // Section-specific fields
  const [sectionData, setSectionData] = useState<Record<string, any>>({});

  // Reset when opened
  useEffect(() => {
    if (open && editItem) {
      const { id, created_at, updated_at, section: s, ...rest } = editItem as any;
      setBaseData({
        title_ar: rest.title_ar || "",
        title_en: rest.title_en || "",
        description_ar: rest.description_ar || "",
        description_en: rest.description_en || "",
        status: rest.status || "draft",
        visibility: rest.visibility || { age_categories: ["all"], requires_login: false },
        tags: rest.tags || [],
      });
      setSectionData(rest);
    } else if (open && !editItem) {
      setBaseData({ title_ar: "", title_en: "", description_ar: "", description_en: "", status: "draft", visibility: { age_categories: ["all"], requires_login: false }, tags: [] });
      setSectionData({});
    }
    setStep("base");
  }, [open, editItem]);

  const handleSave = () => {
    const payload = {
      section,
      ...baseData,
      ...sectionData,
      requires_doctor_approval: cfg.requires_doctor_approval,
      requires_admin_approval: cfg.requires_admin_approval,
      created_by: "Super Admin",
    } as Omit<CMSContent, "id" | "created_at" | "updated_at">;

    if (editItem) {
      updateContent(editItem.id, payload as any);
    } else {
      createContent(payload);
    }
    onSaved();
    onOpenChange(false);
  };

  const stepIndex = STEPS.indexOf(step);
  const canGoNext = step === "base"
    ? baseData.title_ar.trim().length > 0 && baseData.title_en.trim().length > 0
    : true;

  // Section-specific form renderer
  const renderSectionForm = () => {
    switch (section) {
      case "behavioral":
      case "psychological":
        return <BehavioralForm data={sectionData as any} onChange={patch => setSectionData(prev => ({ ...prev, ...patch }))} />;
      case "nutrition":
        return <NutritionForm data={sectionData as any} onChange={patch => setSectionData(prev => ({ ...prev, ...patch }))} />;
      case "sexual-education":
        return <SexualEducationForm data={sectionData as any} onChange={patch => setSectionData(prev => ({ ...prev, ...patch }))} />;
      case "educational-games":
        return <EducationalGamesForm data={sectionData as any} onChange={patch => setSectionData(prev => ({ ...prev, ...patch }))} />;
      case "hospitals":
        return <HospitalsForm data={sectionData as any} onChange={patch => setSectionData(prev => ({ ...prev, ...patch }))} />;
      case "health-units":
        return <HealthUnitsForm data={sectionData as any} onChange={patch => setSectionData(prev => ({ ...prev, ...patch }))} />;
      case "emergency":
        return <EmergencyForm data={sectionData as any} onChange={patch => setSectionData(prev => ({ ...prev, ...patch }))} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: cfg.color }}>
              {stepIndex + 1}
            </div>
            {editItem ? "Edit" : "Create"} Content — {cfg.label_en}
          </DialogTitle>

          {/* Step Indicators */}
          <div className="flex items-center gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => i <= stepIndex && setStep(s)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    step === s
                      ? "text-white"
                      : i < stepIndex
                      ? "bg-slate-100 text-slate-600 cursor-pointer hover:bg-slate-200"
                      : "bg-slate-50 text-slate-400 cursor-not-allowed"
                  }`}
                  style={step === s ? { backgroundColor: cfg.color } : {}}
                >
                  {i < stepIndex && <Check className="h-3 w-3" />}
                  {STEP_LABELS[s]}
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-slate-300" />}
              </div>
            ))}
          </div>
        </DialogHeader>

        <Separator />

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 py-4 pr-1">
          {/* ─── Step 1: Base Info ────────────────────────────────────────── */}
          {step === "base" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Title (Arabic) <span className="text-red-500">*</span></Label>
                  <Input dir="rtl" value={baseData.title_ar} onChange={e => setBaseData(x => ({ ...x, title_ar: e.target.value }))} placeholder="العنوان بالعربية" className="text-right" />
                </div>
                <div className="space-y-2">
                  <Label>Title (English) <span className="text-red-500">*</span></Label>
                  <Input value={baseData.title_en} onChange={e => setBaseData(x => ({ ...x, title_en: e.target.value }))} placeholder="Title in English" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Description (Arabic)</Label>
                  <Textarea dir="rtl" value={baseData.description_ar} onChange={e => setBaseData(x => ({ ...x, description_ar: e.target.value }))} rows={3} placeholder="الوصف بالعربية" />
                </div>
                <div className="space-y-2">
                  <Label>Description (English)</Label>
                  <Textarea value={baseData.description_en} onChange={e => setBaseData(x => ({ ...x, description_en: e.target.value }))} rows={3} placeholder="Description in English" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Initial Status</Label>
                <Select value={baseData.status} onValueChange={v => setBaseData(x => ({ ...x, status: v as ContentStatus }))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Send to Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Visibility */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl">
                <p className="text-sm font-bold text-[#334155]">Visibility Settings</p>
                <div className="space-y-2">
                  <Label className="text-xs">Target Age Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {AGE_CATEGORIES.map(ac => (
                      <button
                        key={ac.value}
                        onClick={() => {
                          const current = baseData.visibility.age_categories;
                          const next = current.includes(ac.value)
                            ? current.filter(x => x !== ac.value)
                            : [...current, ac.value];
                          setBaseData(x => ({ ...x, visibility: { ...x.visibility, age_categories: next.length ? next : ["all"] } }));
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                          baseData.visibility.age_categories.includes(ac.value)
                            ? "text-white border-transparent"
                            : "border-slate-200 text-slate-600 bg-white hover:border-slate-300"
                        }`}
                        style={baseData.visibility.age_categories.includes(ac.value) ? { backgroundColor: cfg.color } : {}}
                      >
                        {ac.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs font-semibold text-[#334155]">Requires Login to View</p>
                  <Switch checked={baseData.visibility.requires_login} onCheckedChange={v => setBaseData(x => ({ ...x, visibility: { ...x.visibility, requires_login: v } }))} />
                </div>
              </div>

              {/* Approval Flags */}
              {(cfg.requires_doctor_approval || cfg.requires_admin_approval) && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <div className="text-xs text-amber-800 space-y-1">
                    <p className="font-bold">Approval Required</p>
                    {cfg.requires_doctor_approval && <p>• Doctor must approve before publishing</p>}
                    {cfg.requires_admin_approval && <p>• Admin must approve before publishing</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Step 2: Section Fields ───────────────────────────────────── */}
          {step === "section" && (
            <div>
              <div className="mb-5 p-3 rounded-xl text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100">
                Fill in {cfg.label_en}-specific fields. All fields are optional during draft creation.
              </div>
              {renderSectionForm()}
            </div>
          )}

          {/* ─── Step 3: Review ──────────────────────────────────────────── */}
          {step === "review" && (
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#0f172a]">{baseData.title_en}</p>
                  <Badge variant="outline" className="text-xs">{baseData.status}</Badge>
                </div>
                <p className="text-xs font-medium text-[#94a3b8]" dir="rtl">{baseData.title_ar}</p>
                <Separator />
                <p className="text-xs text-[#64748b]">{baseData.description_en}</p>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-white rounded-xl">
                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-bold mb-1">Section</p>
                    <p className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label_en}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl">
                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-bold mb-1">Visibility</p>
                    <p className="text-xs font-bold text-[#334155]">{baseData.visibility.age_categories.join(", ")}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl">
                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-bold mb-1">Doctor Approval</p>
                    <p className={`text-xs font-bold ${cfg.requires_doctor_approval ? "text-amber-600" : "text-emerald-600"}`}>{cfg.requires_doctor_approval ? "Required" : "Not Required"}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl">
                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-bold mb-1">Admin Approval</p>
                    <p className={`text-xs font-bold ${cfg.requires_admin_approval ? "text-amber-600" : "text-emerald-600"}`}>{cfg.requires_admin_approval ? "Required" : "Not Required"}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-sm font-bold text-emerald-800">Ready to {editItem ? "update" : "create"}?</p>
                <p className="text-xs text-emerald-700 mt-1">
                  {baseData.status === "draft"
                    ? "This will be saved as a draft. You can promote it to Review when ready."
                    : "This will be submitted for review immediately."}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Footer Navigation */}
        <DialogFooter className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => stepIndex > 0 ? setStep(STEPS[stepIndex - 1]) : onOpenChange(false)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {stepIndex === 0 ? "Cancel" : "Back"}
          </Button>

          <div className="flex gap-2">
            {step !== "review" && (
              <Button
                onClick={() => setStep(STEPS[stepIndex + 1])}
                disabled={!canGoNext}
                className="gap-2 text-white"
                style={{ backgroundColor: cfg.color }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            {step === "review" && (
              <Button
                onClick={handleSave}
                className="gap-2 text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="h-4 w-4" />
                {editItem ? "Update Content" : "Create Content"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
