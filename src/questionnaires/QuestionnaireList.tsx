import React, { useState, useEffect } from "react";
import { QuestionnaireContent } from "./questionnaire.types";
import { questionnaireService } from "./questionnaire.service";
import { QuestionnaireBuilder } from "./QuestionnaireBuilder";
import { useI18n, useT } from "@/i18n/i18n.context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, Filter, 
  MoreVertical, ClipboardList, 
  CheckCircle2, Clock, Play, Pause,
  Edit3, ShieldAlert
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { CURRENT_USER_ROLE } from "@/content-management/permissions";

export function QuestionnaireList() {
  const { lang, isRTL } = useI18n();
  const t = useT();
  const [items, setItems] = useState<QuestionnaireContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await questionnaireService.getQuestionnaires();
    setItems(data);
    setLoading(false);
  };

  const handleSave = async (data: Partial<QuestionnaireContent>) => {
    if (!editingId) return;
    await questionnaireService.saveQuestionnaire(editingId, data);
    toast.success("Questionnaire saved successfully");
    setEditingId(null);
    load();
  };

  const toggleStatus = async (item: QuestionnaireContent) => {
    await questionnaireService.toggleActive(item.id, !item.is_active);
    toast.success(item.is_active ? "Questionnaire disabled" : "Questionnaire enabled");
    load();
  };

  if (editingId) {
    const initial = editingId === "new" ? undefined : items.find(i => i.id === editingId);
    return (
      <QuestionnaireBuilder 
        initialData={initial} 
        onSave={handleSave} 
        onCancel={() => setEditingId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-xl font-black text-[#0f172a] uppercase tracking-tighter">Health Questionnaires</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manage data collection triggers and scientific signal mapping.</p>
         </div>
         <Button 
            onClick={() => setEditingId("new")}
            className="rounded-2xl h-11 gap-2 bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-900/10 px-6"
         >
            <Plus className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t("add")}</span>
         </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
           <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300`} />
           <Input 
              placeholder="Search questionnaires..." 
              className={`h-11 border-slate-100 ${isRTL ? "pr-10" : "pl-10"} rounded-2xl bg-white shadow-sm`}
           />
        </div>
        <Button variant="outline" className="h-11 w-11 p-0 rounded-2xl border-slate-100 bg-white">
           <Filter className="h-4 w-4 text-slate-400" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  item.is_active ? "bg-teal-50 text-teal-600" : "bg-slate-50 text-slate-300"
                }`}>
                   <ClipboardList className="h-6 w-6" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreVertical className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border-slate-100">
                    <DropdownMenuItem onClick={() => setEditingId(item.id)} className="gap-2 font-bold text-xs uppercase tracking-wider">
                       <Edit3 className="h-3.5 w-3.5" /> {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleStatus(item)} className="gap-2 font-bold text-xs uppercase tracking-wider">
                       {item.is_active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                       {item.is_active ? "Disable" : "Enable"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-1">
                <h3 className={`text-base font-black text-[#0f172a] leading-tight ${isRTL ? "text-right" : "text-left"}`}>
                  {lang === "ar" ? item.title_ar : item.title_en}
                </h3>
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider h-5 bg-slate-50 border-slate-100 text-slate-400">
                      {item.type}
                   </Badge>
                   <Badge className={`text-[9px] font-black uppercase tracking-wider h-5 ${
                     item.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'
                   }`}>
                      {item.status}
                   </Badge>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("que_trigger")}</span>
                    <span className="text-[10px] font-bold text-slate-600">{item.trigger.type}: {item.trigger.value}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions</span>
                    <span className="text-[10px] font-bold text-slate-600">{item.questions.length} Fields</span>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <div className="flex items-center gap-1.5">
                    {item.is_active ? (
                      <div className="flex items-center gap-1.5">
                         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                         <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inactive</span>
                      </div>
                    )}
                 </div>
                 
                 {item.status === "review" && CURRENT_USER_ROLE === "DOCTOR" && (
                    <Button size="sm" className="h-7 bg-amber-500 text-[10px] font-black uppercase rounded-lg">
                       Approve Medicals
                    </Button>
                 )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
