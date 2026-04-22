import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { SideEffect } from "./vaccine.types";

interface Props {
  effects: SideEffect[];
  onChange: (effects: SideEffect[]) => void;
  color: string;
}

export function SideEffectsEditor({ effects, onChange, color }: Props) {
  const [newEffect, setNewEffect] = useState<Partial<SideEffect>>({
    effect_ar: "",
    effect_en: "",
    handling_ar: "",
    handling_en: "",
    is_serious: false
  });

  const addEffect = () => {
    if (!newEffect.effect_ar || !newEffect.effect_en) return;
    const effect: SideEffect = {
      id: Math.random().toString(36).slice(2, 9),
      effect_ar: newEffect.effect_ar!,
      effect_en: newEffect.effect_en!,
      handling_ar: newEffect.handling_ar || "",
      handling_en: newEffect.handling_en || "",
      is_serious: newEffect.is_serious || false
    };
    onChange([...effects, effect]);
    setNewEffect({ effect_ar: "", effect_en: "", handling_ar: "", handling_en: "", is_serious: false });
  };

  const removeEffect = (id: string) => {
    onChange(effects.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Existing Effects */}
      <div className="space-y-2">
        {effects.map(e => (
          <div key={e.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3 group relative">
            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${e.is_serious ? "bg-red-500 animate-pulse" : "bg-blue-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0f172a]">{e.effect_en}</span>
                <span className="text-[10px] text-slate-400">/</span>
                <span className="text-xs font-bold text-[#0f172a]" dir="rtl">{e.effect_ar}</span>
              </div>
              <p className="text-[10px] text-[#64748b] mt-1 line-clamp-1">{e.handling_en}</p>
            </div>
            <button 
              onClick={() => removeEffect(e.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Effect Form */}
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
        <p className="text-xs font-bold text-[#334155] flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" /> Add New Side Effect
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px]">Effect (EN)</Label>
            <Input 
              value={newEffect.effect_en} 
              onChange={e => setNewEffect({ ...newEffect, effect_en: e.target.value })}
              className="h-8 text-xs bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px]">Effect (AR)</Label>
            <Input 
              dir="rtl"
              value={newEffect.effect_ar} 
              onChange={e => setNewEffect({ ...newEffect, effect_ar: e.target.value })}
              className="h-8 text-xs bg-white text-right"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px]">Handling (EN)</Label>
            <Input 
              value={newEffect.handling_en} 
              onChange={e => setNewEffect({ ...newEffect, handling_en: e.target.value })}
              className="h-8 text-xs bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px]">Handling (AR)</Label>
            <Input 
              dir="rtl"
              value={newEffect.handling_ar} 
              onChange={e => setNewEffect({ ...newEffect, handling_ar: e.target.value })}
              className="h-8 text-xs bg-white text-right"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={newEffect.is_serious}
              onChange={e => setNewEffect({ ...newEffect, is_serious: e.target.checked })}
              className="rounded border-slate-300 text-red-500 focus:ring-red-500"
            />
            <span className="text-[10px] font-bold text-red-600 uppercase">Mark as Serious Sign</span>
          </label>
          <Button 
            onClick={addEffect}
            size="sm"
            className="h-7 text-[10px] text-white"
            style={{ backgroundColor: color }}
            disabled={!newEffect.effect_ar || !newEffect.effect_en}
          >
            Add Effect
          </Button>
        </div>
      </div>
    </div>
  );
}
