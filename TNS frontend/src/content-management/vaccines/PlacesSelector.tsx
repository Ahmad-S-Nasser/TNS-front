import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Building2, Cross, X } from "lucide-react";
import { getAvailablePlaces } from "./vaccine.service";

interface Props {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  color: string;
}

export function PlacesSelector({ selectedIds, onChange, color }: Props) {
  const [search, setSearch] = useState("");
  const [places, setPlaces] = useState<{ id: string; name: { en: string; ar: string }; type: string }[]>([]);

  useEffect(() => {
    setPlaces(getAvailablePlaces());
  }, []);

  const filtered = places.filter(p => 
    p.name.en.toLowerCase().includes(search.toLowerCase()) || 
    p.name.ar.includes(search) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedPlaces = places.filter(p => selectedIds.includes(p.id));

  return (
    <div className="space-y-4">
      {/* Selected items badges */}
      <div className="flex flex-wrap gap-2 min-h-[32px] p-2 bg-slate-50 rounded-xl border border-slate-100 italic text-[10px] text-slate-400">
        {selectedPlaces.length === 0 ? "No places linked yet..." : selectedPlaces.map(p => (
          <Badge 
            key={p.id} 
            variant="secondary" 
            className="gap-1 pl-2 pr-1 h-6 bg-white border-slate-200 text-slate-700"
          >
            {p.name.en}
            <button 
              onClick={(e) => { e.stopPropagation(); toggle(p.id); }}
              className="hover:bg-slate-100 rounded-full p-0.5"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <Input 
          placeholder="Search hospitals or health units..."
          className="pl-9 h-9 text-xs"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Results List */}
      <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
        {filtered.map(p => (
          <button
            key={p.id}
            onClick={() => toggle(p.id)}
            className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${
              selectedIds.includes(p.id) ? "bg-slate-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                p.type === "Hospital" ? "bg-cyan-50 text-cyan-600" : "bg-teal-50 text-teal-600"
              }`}>
                {p.type === "Hospital" ? <Building2 className="h-4 w-4" /> : <Cross className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0f172a] truncate">{p.name.en}</p>
                <p className="text-[10px] text-[#94a3b8] truncate" dir="rtl">{p.name.ar}</p>
              </div>
            </div>
            {selectedIds.includes(p.id) && (
              <div className="h-4 w-4 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: color }}>
                <span className="text-[10px] font-bold">✓</span>
              </div>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-xs text-slate-400">No clinical locations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
