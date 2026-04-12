import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { EducationalGameContent, AgeCategory, GameCategory } from "../cms.types";

function TagInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => { const v = input.trim(); if (v) onChange([...values, v]); setInput(""); };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} placeholder={placeholder || "Type and press Enter..."} className="h-8 text-sm" />
        <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={add}><Plus className="h-3.5 w-3.5" /></Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {values.map((v, i) => (
            <Badge key={i} variant="secondary" className="text-xs gap-1 pr-1">
              {v}<button onClick={() => onChange(values.filter((_, j) => j !== i))}><X className="h-2.5 w-2.5" /></button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  data: Partial<EducationalGameContent>;
  onChange: (patch: Partial<EducationalGameContent>) => void;
}

export function EducationalGamesForm({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Target Age</Label>
          <Select value={data.target_age || ""} onValueChange={v => onChange({ target_age: v as AgeCategory })}>
            <SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="infant">Infant (0–2 yrs)</SelectItem>
              <SelectItem value="toddler">Toddler (2–4 yrs)</SelectItem>
              <SelectItem value="preschool">Preschool (4–6 yrs)</SelectItem>
              <SelectItem value="school-age">School Age (6–12 yrs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Game Category</Label>
          <Select value={data.game_category || ""} onValueChange={v => onChange({ game_category: v as GameCategory })}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cognitive">Cognitive — معرفي</SelectItem>
              <SelectItem value="motor">Motor — حركي</SelectItem>
              <SelectItem value="social">Social — اجتماعي</SelectItem>
              <SelectItem value="language">Language — لغوي</SelectItem>
              <SelectItem value="creative">Creative — إبداعي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={data.difficulty || ""} onValueChange={v => onChange({ difficulty: v as any })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input type="number" value={data.duration_minutes || ""} onChange={e => onChange({ duration_minutes: +e.target.value })} placeholder="20" className="h-9" />
        </div>
        <div className="space-y-2">
          <Label>Players (Min–Max)</Label>
          <div className="flex gap-1">
            <Input type="number" placeholder="1" value={data.players_min || ""} onChange={e => onChange({ players_min: +e.target.value })} className="h-9" />
            <Input type="number" placeholder="4" value={data.players_max || ""} onChange={e => onChange({ players_max: +e.target.value })} className="h-9" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Game Instructions / تعليمات اللعبة</Label>
        <Textarea value={data.instructions || ""} onChange={e => onChange({ instructions: e.target.value })} rows={4} placeholder="Describe step-by-step how to play..." dir="rtl" />
      </div>

      <TagInput label="Required Materials / الأدوات المطلوبة" values={data.materials || []} onChange={v => onChange({ materials: v })} />
      <TagInput label="Educational Outcomes / النتائج التعليمية" values={data.educational_outcomes || []} onChange={v => onChange({ educational_outcomes: v })} />

      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <p className="text-sm font-semibold text-blue-900">Can Play Solo / يمكن اللعب بمفرده</p>
        <Switch checked={data.can_play_solo || false} onCheckedChange={v => onChange({ can_play_solo: v })} />
      </div>
    </div>
  );
}
