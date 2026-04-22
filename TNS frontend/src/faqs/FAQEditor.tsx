import React, { useState } from "react";
import { FAQContent } from "./faq.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, Save, HelpCircle, 
  AlertTriangle, Lightbulb, Smartphone,
  ExternalLink, Info, BadgeCheck, Link as LinkIcon
} from "lucide-react";
import { useI18n } from "@/i18n/i18n.context";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  initialData?: FAQContent;
  onSave: (data: Partial<FAQContent>) => void;
  onCancel: () => void;
}

export function FAQEditor({ initialData, onSave, onCancel }: Props) {
  const { t, lang, isRTL } = useI18n();
  const [data, setData] = useState<Partial<FAQContent>>(initialData || {
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    category: "General",
    links: { vaccine_ids: [], age_groups: [], symptoms: [] },
    is_reassurance: true,
    is_warning: false,
  });
  
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-xl">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
           </Button>
           <div>
              <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-tighter">{t("faq_builder")}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{initialData ? initialData.id : "New FAQ Entry"}</p>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
           <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
              className={`rounded-2xl h-10 gap-2 border-slate-200 ${showPreview ? "bg-amber-50 text-amber-600 border-amber-100" : ""}`}
           >
              <Smartphone className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("que_mobile_preview")}</span>
           </Button>
           <Button 
                onClick={() => onSave(data)}
                className="rounded-2xl h-10 gap-2 bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-900/10 px-6"
           >
              <Save className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("save")}</span>
           </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className={`flex-1 transition-all duration-500 overflow-auto p-10 space-y-10 ${showPreview ? "max-w-[calc(100%-380px)]" : "max-w-full"}`}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Localized Content */}
              <div className="space-y-6">
                  <div className="space-y-4 pt-1">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arabic Content</h3>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-600">Question / Topic (AR)</Label>
                        <Input 
                          value={data.title_ar}
                          onChange={(e) => setData({ ...data, title_ar: e.target.value })}
                          className="h-11 border-slate-100 font-bold focus-visible:ring-amber-500 rounded-xl px-4"
                          dir="rtl"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-600">Guidance Explanation (AR)</Label>
                        <Textarea 
                          value={data.description_ar}
                          onChange={(e) => setData({ ...data, description_ar: e.target.value })}
                          className="min-h-[120px] border-slate-100 font-bold focus-visible:ring-amber-500 rounded-xl p-4 leading-relaxed"
                          dir="rtl"
                        />
                     </div>
                  </div>
              </div>

              <div className="space-y-6">
                  <div className="space-y-4 pt-1">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">English Content</h3>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-600">Question / Topic (EN)</Label>
                        <Input 
                          value={data.title_en}
                          onChange={(e) => setData({ ...data, title_en: e.target.value })}
                          className="h-11 border-slate-100 font-bold focus-visible:ring-amber-500 rounded-xl px-4"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-600">Guidance Explanation (EN)</Label>
                        <Textarea 
                          value={data.description_en}
                          onChange={(e) => setData({ ...data, description_en: e.target.value })}
                          className="min-h-[120px] border-slate-100 font-bold focus-visible:ring-amber-500 rounded-xl p-4 leading-relaxed"
                        />
                     </div>
                  </div>
              </div>
           </div>

           {/* Configuration Section */}
           <div className="pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Context & Category</h3>
                  <div className="space-y-2">
                     <Label className="text-xs font-bold text-slate-600">FAQ Category</Label>
                     <Select 
                        value={data.category} 
                        onValueChange={(val) => setData({ ...data, category: val })}
                     >
                        <SelectTrigger className="h-11 border-slate-100 rounded-xl bg-slate-50/50">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="General">General Health</SelectItem>
                           <SelectItem value="Vaccine Safety">Vaccine Safety</SelectItem>
                           <SelectItem value="Nutrition">Nutrition Guidance</SelectItem>
                           <SelectItem value="Emergency">Emergency Procedures</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
              </div>

              <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Flags</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-50">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                              <Lightbulb className="h-4 w-4" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-emerald-900 uppercase tracking-wider">{t("faq_reassurance")}</p>
                              <p className="text-[9px] font-bold text-emerald-600">Mark as comforting/routine</p>
                           </div>
                        </div>
                        <Switch 
                          checked={data.is_reassurance} 
                          onCheckedChange={(val) => setData({ ...data, is_reassurance: val })} 
                        />
                     </div>

                     <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-50">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-sm">
                              <AlertTriangle className="h-4 w-4" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-red-900 uppercase tracking-wider">{t("faq_warning")}</p>
                              <p className="text-[9px] font-bold text-red-600">Highlight medical emergency</p>
                           </div>
                        </div>
                        <Switch 
                          checked={data.is_warning} 
                          onCheckedChange={(val) => setData({ ...data, is_warning: val })} 
                        />
                     </div>
                  </div>
              </div>

              <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility Links</h3>
                  <div className="space-y-4">
                     <div className="space-y-2">
                         <Label className="text-xs font-bold text-slate-600">Link to Vaccines (Comma separated IDs)</Label>
                         <Input 
                            placeholder="vac-1, vac-2"
                            value={data.links?.vaccine_ids?.join(", ")}
                            onChange={(e) => setData({ 
                              ...data, 
                              links: { ...data.links, vaccine_ids: e.target.value.split(",").map(v => v.trim()).filter(Boolean) } 
                            })}
                            className="h-11 border-slate-100 rounded-xl bg-slate-50/50"
                         />
                     </div>
                     <div className="flex items-start gap-2 pt-2">
                        <Info className="h-3 w-3 text-slate-400 mt-0.5" />
                        <p className="text-[9px] font-bold text-slate-400 leading-tight">
                           Educational content is automatically filtered based on child age and vaccine schedules.
                        </p>
                     </div>
                  </div>
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
             <div className="bg-[#0f172a] p-3 rounded-[3.5rem] shadow-2xl mx-auto w-full max-w-[320px] border-[8px] border-[#1e293b]">
                <div className="bg-[#f8fafc] rounded-[2.5rem] h-[580px] overflow-hidden flex flex-col relative">
                   {/* App UI internals */}
                   <div className="h-7 bg-white w-full flex justify-center items-center">
                       <div className="h-1 w-12 bg-slate-200 rounded-full" />
                   </div>
                   
                   <ScrollArea className="flex-1 px-5 pt-6 pb-8">
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 h-5 tracking-widest uppercase">
                               {data.category || "GUIDANCE"}
                            </Badge>
                            <h2 className={`font-black tracking-tight leading-tight text-slate-900 ${lang === 'ar' ? 'text-xl text-right' : 'text-lg text-left'}`}>
                               {lang === "ar" ? data.title_ar || "عنوان الإرشاد..." : data.title_en || "Guidance Title..."}
                            </h2>
                         </div>

                         {/* FAQ Card */}
                         <div className={`rounded-3xl p-5 space-y-4 shadow-sm border transition-colors duration-500 ${
                            data.is_warning 
                              ? "bg-red-50 border-red-100" 
                              : data.is_reassurance 
                                ? "bg-emerald-50 border-emerald-100" 
                                : "bg-white border-slate-100"
                         }`}>
                            <div className="flex items-center gap-3">
                               <div className={`h-10 w-10 rounded-[1rem] flex items-center justify-center shadow-sm ${
                                  data.is_warning 
                                    ? "bg-red-500 text-white" 
                                    : data.is_reassurance 
                                      ? "bg-emerald-500 text-white" 
                                      : "bg-amber-500 text-white"
                               }`}>
                                  {data.is_warning ? <AlertTriangle className="h-5 w-5" /> : (data.is_reassurance ? <Lightbulb className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />)}
                               </div>
                               <div>
                                  <p className={`text-[10px] font-black uppercase tracking-wider ${
                                     data.is_warning ? "text-red-900" : (data.is_reassurance ? "text-emerald-900" : "text-slate-900")
                                  }`}>
                                     {data.is_warning ? "Medical Warning" : (data.is_reassurance ? "Expert Advice" : "Health FAQ")}
                                  </p>
                                  <div className="flex items-center gap-1">
                                     <BadgeCheck className={`h-3 w-3 ${data.is_warning ? "text-red-400" : "text-emerald-400"}`} />
                                     <span className="text-[9px] font-bold text-slate-400 uppercase">Verified Content</span>
                                  </div>
                               </div>
                            </div>

                            <p className={`text-xs font-bold leading-relaxed ${
                               lang === 'ar' ? 'text-right' : 'text-left'
                            } ${
                               data.is_warning ? "text-red-800" : (data.is_reassurance ? "text-emerald-800" : "text-slate-600")
                            }`}>
                               {lang === "ar" ? data.description_ar || "شرح الإرشادات الطبية هنا..." : data.description_en || "Medical guidance explanation goes here..."}
                            </p>

                            {data.links?.vaccine_ids && data.links.vaccine_ids.length > 0 && (
                               <div className="pt-4 border-t border-black/5 space-y-2">
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Related Vaccines</p>
                                  <div className="flex flex-wrap gap-2">
                                     {data.links.vaccine_ids.map(v => (
                                        <div key={v} className="px-2 py-1 bg-white/60 border border-slate-200 rounded-lg flex items-center gap-1 text-[9px] font-bold text-slate-600">
                                           <LinkIcon className="h-2.5 w-2.5" />
                                           {v}
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            )}
                         </div>

                         <div className="p-4 bg-white/50 border border-slate-100 border-dashed rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white transition-colors">
                            <div className="flex items-center gap-3">
                               <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">Read More Details</span>
                            </div>
                            <div className={`h-2 w-2 rounded-full bg-slate-200 ${lang === 'ar' ? 'mr-auto' : 'ml-auto'}`} />
                         </div>
                      </div>
                   </ScrollArea>
                   
                   {/* App Bottom Bar Mock */}
                   <div className="h-16 bg-white border-t border-slate-50 flex items-center justify-around px-6">
                      <div className="h-1 w-16 bg-slate-100 rounded-full absolute bottom-2" />
                      <div className="h-8 w-8 rounded-xl bg-slate-50" />
                      <div className="h-8 w-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                         <HelpCircle className="h-4 w-4" />
                      </div>
                      <div className="h-8 w-8 rounded-xl bg-slate-50" />
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
