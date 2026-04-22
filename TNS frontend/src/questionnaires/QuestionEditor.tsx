import React from "react";
import { QuestionnaireQuestion, QuestionType } from "./questionnaire.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, GripVertical, Plus, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/i18n/i18n.context";

interface Props {
  question: QuestionnaireQuestion;
  onChange: (q: QuestionnaireQuestion) => void;
  onDelete: () => void;
}

const SIGNAL_TYPES = [
  { value: "fever", label: "Fever / Temp" },
  { value: "pain", label: "Pain / Inflammation" },
  { value: "shortage", label: "Product Shortage" },
  { value: "access", label: "Service Access" },
  { value: "respiratory", label: "Respiratory Issues" },
];

export function QuestionEditor({ question, onChange, onDelete }: Props) {
  const { t, isRTL } = useI18n();

  const handleUpdate = (updates: Partial<QuestionnaireQuestion>) => {
    onChange({ ...question, ...updates });
  };

  const addOption = () => {
    const newOption = { value: `opt_${Date.now()}`, label_ar: "", label_en: "" };
    handleUpdate({ options: [...(question.options || []), newOption] });
  };

  return (
    <Card className="border-slate-100 shadow-sm overflow-hidden group">
      <div className="bg-slate-50/50 px-4 py-2 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question ID: {question.id}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-7 w-7 text-slate-300 hover:text-red-500 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AR Question */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Question Text (AR)</Label>
            <Input 
              value={question.text_ar} 
              onChange={(e) => handleUpdate({ text_ar: e.target.value })}
              className="font-bold border-slate-100 focus-visible:ring-teal-500"
              dir="rtl"
            />
          </div>
          {/* EN Question */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Question Text (EN)</Label>
            <Input 
              value={question.text_en} 
              onChange={(e) => handleUpdate({ text_en: e.target.value })}
              className="font-bold border-slate-100 focus-visible:ring-teal-500"
              dir="ltr"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Answer Type</Label>
              <Select 
                value={question.type} 
                onValueChange={(val: QuestionType) => handleUpdate({ type: val })}
              >
                <SelectTrigger className="h-10 border-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes-no">Yes / No</SelectItem>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="scale">Severity Scale (1-10)</SelectItem>
                </SelectContent>
              </Select>
           </div>

           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Linked Signal Type</Label>
              <Select 
                value={question.linked_signal_type} 
                onValueChange={(val) => handleUpdate({ linked_signal_type: val })}
              >
                <SelectTrigger className="h-10 border-slate-100 bg-teal-50/30 text-teal-700">
                  <SelectValue placeholder="No mapping" />
                </SelectTrigger>
                <SelectContent>
                  {SIGNAL_TYPES.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>

           <div className="flex items-end pb-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`req-${question.id}`} 
                  checked={question.is_required} 
                  onCheckedChange={(val) => handleUpdate({ is_required: !!val })}
                />
                <Label htmlFor={`req-${question.id}`} className="text-xs font-bold text-slate-600">Required</Label>
              </div>
           </div>
        </div>

        {question.type === "multiple-choice" && (
          <div className="pt-4 space-y-4 border-t border-slate-50">
             <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Answer Options</h5>
                <Button variant="ghost" size="sm" onClick={addOption} className="h-7 text-teal-600 font-bold text-[10px] uppercase">
                  <Plus className="h-3 w-3 mr-1" /> Add Option
                </Button>
             </div>
             <div className="space-y-2">
                {(question.options || []).map((opt, idx) => (
                  <div key={opt.value} className="flex gap-2 items-center">
                    <Input 
                      placeholder="Label AR" 
                      value={opt.label_ar} 
                      onChange={(e) => {
                         const opts = [...(question.options || [])];
                         opts[idx].label_ar = e.target.value;
                         handleUpdate({ options: opts });
                      }}
                      className="h-8 text-[11px] font-bold"
                      dir="rtl"
                    />
                    <Input 
                      placeholder="Label EN" 
                      value={opt.label_en} 
                      onChange={(e) => {
                         const opts = [...(question.options || [])];
                         opts[idx].label_en = e.target.value;
                         handleUpdate({ options: opts });
                      }}
                      className="h-8 text-[11px] font-bold"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-200 hover:text-red-500"
                      onClick={() => {
                         handleUpdate({ options: question.options?.filter((_, i) => i !== idx) });
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
