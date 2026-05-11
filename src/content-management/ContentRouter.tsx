import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useI18n, useT } from "@/i18n/i18n.context";
import { ContentListView } from "./ContentListView";
import { SectionList } from "./SectionList";
import { getSectionConfig } from "./cms.service";
import { getAccessibleSections } from "./permissions";
import { CMSSection } from "./cms.types";
import { VaccineListView } from "./vaccines/VaccineListView";
import { QuestionnaireList } from "@/questionnaires/QuestionnaireList";
import { FAQList } from "@/faqs/FAQList";
import { useContentStats } from "@/hooks/queries/useContent";

export function ContentRouter() {
  const [activeSection, setActiveSection] = useState<CMSSection | null>(null);
  const { lang, isRTL } = useI18n();
  const t = useT();
  const n = (en: string, ar: string) => lang === "ar" ? ar : en;

  const { data: statsData, isLoading } = useContentStats();
  const accessibleSections = getAccessibleSections();

  if (isLoading) return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>;

  // Map backend sectionStats to frontend SectionStats type
  const statsArray = (statsData?.sectionStats || []).map((s: any) => ({
    section: s.section.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() as CMSSection,
    total: s.total,
    published: s.published,
    draft: s.draft,
    review: s.review,
    approved: s.approved,
    archived: s.archived,
  }));

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
            {isRTL ? <ChevronLeft className="h-4 w-4 rotate-180" /> : <ChevronLeft className="h-4 w-4" />}
            {t("cms_title")}
          </button>
          <span className="text-[#cbd5e1]">/</span>
          <span className="text-[#0f172a] font-semibold">{n(cfg.label_en, cfg.label_ar)}</span>
          <span className="text-[#cbd5e1]">—</span>
          <span className="text-[11px] font-medium text-[#94a3b8]" dir={lang === "ar" ? "ltr" : "rtl"}>
            {lang === "ar" ? cfg.label_en : cfg.label_ar}
          </span>
        </div>

        {activeSection === "vaccines" ? (
          <VaccineListView />
        ) : activeSection === "questionnaires" ? (
          <QuestionnaireList />
        ) : activeSection === "faqs" ? (
          <FAQList />
        ) : (
          <ContentListView section={activeSection} />
        )}
      </div>
    );
  }

  return (
    <SectionList
      stats={statsArray.filter(s => accessibleSections.includes(s.section))}
      onSelectSection={(section) => {
        if (accessibleSections.includes(section)) {
          setActiveSection(section);
        }
      }}
    />
  );
}
