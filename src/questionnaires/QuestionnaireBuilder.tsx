import React, { useState, useEffect } from "react";
import { QuestionnaireContent, QuestionnaireQuestion, QuestionnaireType } from "./questionnaire.types";
import { QuestionEditor } from "./QuestionEditor";
import { TriggerRulesEditor } from "./TriggerRulesEditor";
import { Button } from "@/components/ui/button";
import { 
  Plus, Save, Smartphone, 
  ArrowLeft, Eye, ShieldCheck, 
  Clock, AlertCircle, Info, LayoutDashboard
} from "lucide-react";
import { useI18n } from "@/i18n/i18n.context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Props {
  initialData?: QuestionnaireContent;
  onSave: (data: Partial<QuestionnaireContent>) => void;
  onCancel: () => void;
}

export function QuestionnaireBuilder({ initialData, onSave, onCancel }: Props) {
  const { t, lang, isRTL } = useI18n();
  const [data, setData] = useState<Partial<QuestionnaireContent>>(initialData || {
    title_ar: "",
    title_en: "",
    type: "post-vax",
    trigger: { type: "vaccine", value: "" },
    questions: [],
    is_active: false,
    requires_doctor_approval: true,
  });
  
  const [showPreview, setShowPreview] = useState(true);

  const addQuestion = () => {
    const newQ: QuestionnaireQuestion = {
      id: `q_${Date.now()}`,
      text_ar: "",
      text_en: "",
      type: "yes-no",
      is_required: true
    };
    setData({ ...data, questions: [...(data.questions || []), newQ] });
  };

  const updateQuestion = (idx: number, updated: QuestionnaireQuestion) => {
    const qs = [...(data.questions || [])];
    qs[idx] = updated;
    setData({ ...data, questions: qs });
  };

  const deleteQuestion = (idx: number) => {
    setData({ ...data, questions: data.questions?.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-xl">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
           </Button>
           <div>
              <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-tighter">{t("que_builder")}</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{initialData ? initialData.id : "New Questionnaire"}</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
              className={`rounded-2xl h-10 gap-2 border-slate-200 ${showPreview ? "bg-teal-50 text-teal-600 border-teal-100" : ""}`}
           >
              <Smartphone className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("que_mobile_preview")}</span>
           </Button>
           <Button 
                onClick={() => onSave(data)}
                className="rounded-2xl h-10 gap-2 bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-900/10 px-6"
           >
              <Save className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("save")}</span>
           </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Block */}
        <div className={`flex-1 transition-all duration-500 overflow-auto p-8 space-y-8 ${showPreview ? "max-w-[calc(100%-380px)]" : "max-w-full"}`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Title (AR)</Label>
                  <Input 
                    value={data.title_ar} 
                    onChange={(e) => setData({ ...data, title_ar: e.target.value })}
                    className="h-12 border-slate-100 font-black text-lg focus-visible:ring-teal-500 rounded-2xl"
                    dir="rtl"
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Title (EN)</Label>
                  <Input 
                    value={data.title_en} 
                    onChange={(e) => setData({ ...data, title_en: e.target.value })}
                    className="h-12 border-slate-100 font-black text-lg focus-visible:ring-teal-500 rounded-2xl"
                  />
               </div>
            </div>

            <div className="space-y-4">
               <TriggerRulesEditor 
                  trigger={data.trigger || { type: "vaccine", value: "" }} 
                  onChange={(t) => setData({ ...data, trigger: t })} 
               />
            </div>
          </div>

          <Separator className="bg-slate-50" />

          {/* Governance Alert */}
          <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-3">
             <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
             <div className="space-y-1">
                <p className="text-[11px] font-black text-emerald-900 uppercase tracking-widest">{t("que_governance")}</p>
                <p className="text-[10px] font-bold text-emerald-700 leading-relaxed">
                  Medical questionnaires remain in 'Draft' until a Doctor approves the scientific integrity of all linked health signals.
                </p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-tighter">Questions Structure</h3>
              <Button 
                onClick={addQuestion} 
                className="h-9 rounded-xl gap-2 bg-slate-900 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t("que_add_question")}</span>
              </Button>
            </div>

            <div className="space-y-4">
              {(data.questions || []).map((q, idx) => (
                <QuestionEditor 
                  key={q.id} 
                  question={q} 
                  onChange={(updated) => updateQuestion(idx, updated)}
                  onDelete={() => deleteQuestion(idx)}
                />
              ))}
              {(!data.questions || data.questions.length === 0) && (
                <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mx-auto">
                     <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">No questions added yet. Start by defining the first data point.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Preview Panel */}
        {showPreview && (
          <div className="w-[380px] bg-slate-50 border-l border-slate-100 p-8 h-full overflow-auto animate-in fade-in slide-in-from-right duration-500">
             <div className="flex items-center gap-2 mb-6">
                <Smartphone className="h-4 w-4 text-slate-400" />
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("que_mobile_preview")}</h4>
             </div>

             {/* Phone Frame */}
             <div className="bg-[#0f172a] p-3 rounded-[3rem] shadow-2xl mx-auto w-full max-w-[300px] border-[6px] border-[#1e293b]">
                <div className="bg-white rounded-[2.2rem] h-[520px] overflow-hidden flex flex-col relative">
                   {/* App UI internals */}
                   <div className="h-6 bg-white w-full flex justify-center items-center">
                       <div className="h-1 w-16 bg-slate-100 rounded-full" />
                   </div>
                   
                   <ScrollArea className="flex-1 px-5 pt-4 pb-8">
                      <div className="space-y-6">
                         <div className="space-y-1">
                            <Badge variant="secondary" className="bg-teal-50 text-teal-600 text-[9px] font-black px-1.5 h-4 mb-1">HEALTH CHECK</Badge>
                            <h2 className={`font-black tracking-tight leading-tight ${lang === 'ar' ? 'text-lg text-right' : 'text-base text-left'}`}>
                               {lang === "ar" ? data.title_ar || "عنوان الاستبيان" : data.title_en || "Questionnaire Title"}
                            </h2>
                         </div>

                         <div className="space-y-5">
                            {(data.questions || []).map((q, idx) => (
                               <div key={q.id} className={`space-y-2 animate-in fade-in slide-in-from-bottom duration-300 delay-[${idx*100}ms]`}>
                                  <p className={`text-[11px] font-black text-slate-800 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                     {lang === "ar" ? q.text_ar || "نص السؤال..." : q.text_en || "Question text..."}
                                     {q.is_required && <span className="text-red-500 ml-1">*</span>}
                                  </p>
                                  
                                  {q.type === "yes-no" && (
                                     <div className="flex gap-2">
                                        <div className="flex-1 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">YES</div>
                                        <div className="flex-1 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">NO</div>
                                     </div>
                                  )}

                                  {q.type === "scale" && (
                                     <div className="flex justify-between items-center gap-1">
                                        {[1,2,3,4,5].map(v => (
                                          <div key={v} className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">{v}</div>
                                        ))}
                                     </div>
                                  )}

                                  {q.type === "multiple-choice" && (
                                     <div className="space-y-2">
                                        {q.options?.map(opt => (
                                          <div key={opt.value} className="h-8 rounded-xl bg-slate-50 border border-slate-100 px-3 flex items-center text-[10px] font-bold text-slate-500">
                                            {lang === 'ar' ? opt.label_ar : opt.label_en}
                                          </div>
                                        ))}
                                     </div>
                                  )}
                               </div>
                            ))}
                         </div>
                      </div>
                   </ScrollArea>
                   
                   <div className="p-4 border-t border-slate-50 bg-white">
                      <Button className="w-full rounded-2xl h-10 bg-teal-600 text-[11px] font-black uppercase tracking-widest">{t("save")}</Button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Separator = ({ className }: { className?: string }) => <div className={`h-[1px] w-full ${className}`} />;
