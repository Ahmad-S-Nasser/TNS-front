import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { CMSSection } from "./cms.types";
import { SectionList } from "./SectionList";
import { ContentListView } from "./ContentListView";
import { getSectionStats, getSectionConfig } from "./cms.service";
import { getAccessibleSections } from "./permissions";

export function ContentRouter() {
  const [activeSection, setActiveSection] = useState<CMSSection | null>(null);

  const stats = getSectionStats();
  const accessibleSections = getAccessibleSections();

  if (activeSection) {
    const cfg = getSectionConfig(activeSection);
    return (
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#64748b]">
          <button
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-1.5 hover:text-[#0f172a] transition-colors font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            Content Management
          </button>
          <span className="text-[#cbd5e1]">/</span>
          <span className="text-[#0f172a] font-semibold">{cfg.label_en}</span>
          <span className="text-[#cbd5e1]">—</span>
          <span className="text-xs font-medium" style={{ color: cfg.color }} dir="rtl">{cfg.label_ar}</span>
        </div>

        <ContentListView section={activeSection} />
      </div>
    );
  }

  return (
    <SectionList
      stats={stats.filter(s => accessibleSections.includes(s.section))}
      onSelectSection={(section) => {
        if (accessibleSections.includes(section)) {
          setActiveSection(section);
        }
      }}
    />
  );
}
