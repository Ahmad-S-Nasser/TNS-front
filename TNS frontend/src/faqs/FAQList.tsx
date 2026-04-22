import React, { useState, useEffect } from "react";
import { FAQContent } from "./faq.types";
import { faqService } from "./faq.service";
import { FAQEditor } from "./FAQEditor";
import { useI18n, useT } from "@/i18n/i18n.context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, HelpCircle, 
  Settings2, Lightbulb, AlertTriangle,
  Link as LinkIcon, Edit2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function FAQList() {
  const { lang, isRTL } = useI18n();
  const t = useT();
  const [items, setItems] = useState<FAQContent[]>([]);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await faqService.getFAQs();
    setItems(data);
  };

  const handleSave = async (data: Partial<FAQContent>) => {
    if (!editingId) return;
    await faqService.saveFAQ(editingId, data);
    toast.success("FAQ updated successfully");
    setEditingId(null);
    load();
  };

  if (editingId) {
    const initial = editingId === "new" ? undefined : items.find(i => i.id === editingId);
    return <FAQEditor initialData={initial} onSave={handleSave} onCancel={() => setEditingId(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-xl font-black text-[#0f172a] uppercase tracking-tighter">Educational Guidance (FAQs)</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Help parents understand health procedures and manage concerns safely.</p>
         </div>
         <Button 
            onClick={() => setEditingId("new")}
            className="rounded-2xl h-11 gap-2 bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-900/10 px-6"
         >
            <Plus className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t("add")}</span>
         </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
           <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300`} />
           <Input 
              placeholder="Search guidance..." 
              className={`h-11 border-slate-100 ${isRTL ? "pr-10" : "pl-10"} rounded-2xl bg-white shadow-sm`}
           />
        </div>
        <Tabs defaultValue="all" className="w-fit">
           <TabsList className="bg-white border border-slate-100 rounded-2xl h-11 p-1">
              <TabsTrigger value="all" className="rounded-xl text-[10px] font-black uppercase">All</TabsTrigger>
              <TabsTrigger value="vax" className="rounded-xl text-[10px] font-black uppercase">Vaccines</TabsTrigger>
              <TabsTrigger value="symp" className="rounded-xl text-[10px] font-black uppercase">Symptoms</TabsTrigger>
           </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
             <CardContent className="p-6">
                <div className="flex gap-5">
                   <div className={`h-14 w-14 rounded-2xl shrink-0 flex items-center justify-center ${
                      item.is_warning ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
                   }`}>
                      {item.is_warning ? <AlertTriangle className="h-7 w-7" /> : <HelpCircle className="h-7 w-7" />}
                   </div>
                   <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                         <Badge variant="outline" className="rounded-full text-[9px] font-black uppercase border-slate-100 text-slate-400 px-2 h-5">
                            {item.category}
                         </Badge>
                         <Button variant="ghost" size="icon" onClick={() => setEditingId(item.id)} className="h-8 w-8 text-slate-300 hover:text-slate-600">
                            <Edit2 className="h-3.5 w-3.5" />
                         </Button>
                      </div>
                      <div className="space-y-1">
                         <h3 className={`text-base font-black text-[#0f172a] leading-tight ${isRTL ? "text-right" : "text-left"}`}>
                            {lang === "ar" ? item.title_ar : item.title_en}
                         </h3>
                         <p className={`text-[11px] font-medium text-slate-500 line-clamp-2 ${isRTL ? "text-right" : "text-left"}`}>
                            {lang === "ar" ? item.description_ar : item.description_en}
                         </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                         {item.links.vaccine_ids?.map(v => (
                            <div key={v} className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 text-teal-600 rounded-lg text-[9px] font-black border border-teal-100/50 uppercase">
                               <LinkIcon className="h-2.5 w-2.5" /> {v}
                            </div>
                         ))}
                         {item.is_reassurance && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black border border-emerald-100/50 uppercase">
                               <Lightbulb className="h-2.5 w-2.5" /> Reassurance
                            </div>
                         )}
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
