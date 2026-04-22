import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Syringe, Clock, AlertCircle, Eye, 
  CheckCircle2, AlertTriangle, FileText,
  Building2, Plus, Search, Filter
} from "lucide-react";
import { ContentStatus } from "../cms.types";
import { VaccineContent, VaccineType } from "./vaccine.types";
import { useT, useI18n } from "@/i18n/i18n.context";

const statusColors: Record<ContentStatus, { bg: string; text: string }> = {
  published: { bg: "bg-emerald-50", text: "text-emerald-700" },
  review: { bg: "bg-amber-50", text: "text-amber-700" },
  approved: { bg: "bg-purple-50", text: "text-purple-700" },
  draft: { bg: "bg-slate-100", text: "text-slate-600" },
  archived: { bg: "bg-red-50", text: "text-red-700" },
};

interface Props {
  vaccines: VaccineContent[];
  onAdd: () => void;
  onEdit: (v: VaccineContent) => void;
  onPreview: (v: VaccineContent) => void;
}

export function VaccineList({ vaccines, onAdd, onEdit, onPreview }: Props) {
  const t = useT();
  const { lang, isRTL } = useI18n();
  const [filterType, setFilterType] = useState<VaccineType | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = vaccines.filter(v => {
    const matchesSearch = v.title_en.toLowerCase().includes(search.toLowerCase()) || v.title_ar.includes(search);
    const matchesType = filterType === "ALL" || v.vaccine_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search vaccines..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["ALL", "FREE", "PAID"] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === type 
                    ? "bg-white text-teal-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <Button 
            onClick={onAdd}
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2 rounded-xl"
          >
            <Plus className="h-4 w-4" /> Add Vaccine
          </Button>
        </div>
      </div>

      {/* Vaccine Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(v => (
          <Card key={v.id} className="border-none shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
            <CardContent className="p-0">
              {/* Type Banner */}
              <div className={`h-1.5 w-full ${v.vaccine_type === "FREE" ? "bg-emerald-500" : "bg-cyan-500"}`} />
              
              <div className="p-5 space-y-4">
                {/* Status & Type */}
                <div className="flex items-center justify-between">
                  <Badge className={`text-[10px] font-bold border-none ${statusColors[v.status].bg} ${statusColors[v.status].text}`}>
                    {v.status.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black tracking-widest uppercase ${v.vaccine_type === "FREE" ? "text-emerald-600" : "text-cyan-600"}`}>
                      {v.vaccine_type}
                    </span>
                    <div className={`h-1.5 w-1.5 rounded-full ${v.vaccine_type === "FREE" ? "bg-emerald-500" : "bg-cyan-500"}`} />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-[#0f172a] text-base leading-tight">
                    {lang === "ar" ? v.title_ar : v.title_en}
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-1 italic">
                    {lang === "ar" ? v.title_en : v.title_ar}
                  </p>
                </div>

                {/* Schedule Strip */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                  <div className="flex gap-1">
                    {v.age_schedule.map(age => (
                      <span key={age} className="px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-600 whitespace-nowrap">
                        {age}
                      </span>
                    ))}
                  </div>
                </div>

                {/* KPI Micro-Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 p-2 bg-slate-50/50 rounded-lg">
                    <Syringe className="h-3.5 w-3.5 text-teal-600" />
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Doses</p>
                      <p className="text-xs font-bold text-slate-700">{v.dose_count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50/50 rounded-lg">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Side Effects</p>
                      <p className="text-xs font-bold text-slate-700">{v.side_effects?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-[11px] font-bold border-slate-200 hover:bg-slate-50 gap-2"
                    onClick={() => onPreview(v)}
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 h-8 text-[11px] font-bold bg-slate-900 text-white hover:bg-slate-800 gap-2"
                    onClick={() => onEdit(v)}
                  >
                    <FileText className="h-3.5 w-3.5" /> Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-3">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Syringe className="h-8 w-8 text-slate-200" />
            </div>
            <p className="text-sm font-medium text-slate-500">No vaccines matching your search.</p>
            <Button variant="link" onClick={() => {setSearch(""); setFilterType("ALL");}}>Clear filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
