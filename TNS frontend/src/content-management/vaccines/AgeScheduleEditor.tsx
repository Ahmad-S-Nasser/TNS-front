import { Badge } from "@/components/ui/badge";
import { useT } from "@/i18n/i18n.context";
import { AgeMilestone } from "./vaccine.types";

const MILESTONES: { value: AgeMilestone; label: string }[] = [
  { value: "at-birth", label: "At Birth" },
  { value: "2m", label: "2 Months" },
  { value: "4m", label: "4 Months" },
  { value: "6m", label: "6 Months" },
  { value: "9m", label: "9 Months" },
  { value: "12m", label: "12 Months" },
  { value: "18m", label: "18 Months" },
  { value: "2y", label: "2 Years" },
  { value: "4-6y", label: "4-6 Years" },
];

interface Props {
  selected: AgeMilestone[];
  onChange: (milestones: AgeMilestone[]) => void;
  color: string;
}

export function AgeScheduleEditor({ selected, onChange, color }: Props) {
  const t = useT();

  const toggle = (m: AgeMilestone) => {
    if (selected.includes(m)) {
      onChange(selected.filter(x => x !== m));
    } else {
      onChange([...selected, m]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {MILESTONES.map(m => (
          <button
            key={m.value}
            onClick={() => toggle(m.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selected.includes(m.value)
                ? "text-white border-transparent shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
            style={selected.includes(m.value) ? { backgroundColor: color } : {}}
          >
            {m.label}
          </button>
        ))}
      </div>
      {selected.length === 0 && (
        <p className="text-[10px] text-amber-600 font-medium italic">
          * Please select at least one age milestone
        </p>
      )}
    </div>
  );
}
