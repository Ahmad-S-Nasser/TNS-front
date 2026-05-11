import { useState, useMemo, useEffect } from "react";
import { ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VaccineList } from "./VaccineList";
import { VaccineContent } from "./vaccine.types";
import { getSectionConfig, exportSection } from "../cms.service";
import { ContentFormDialog } from "../ContentFormDialog";
import { useT, useI18n } from "@/i18n/i18n.context";
import { can } from "../permissions";
import { useContent } from "@/hooks/queries/useContent";

export function VaccineListView() {
  const t = useT();
  const { lang, isRTL } = useI18n();
  const section = "vaccines";
  const cfg = getSectionConfig(section);
  const n = (en: string, ar: string) => lang === "ar" ? ar : en;

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<VaccineContent | null>(null);

  const { data: items = [], isLoading, refetch } = useContent({ section });

  const refresh = () => {
    refetch();
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>;

  const handleExport = () => {
    const payload = exportSection(section);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cms-vaccines-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${cfg.color}20` }}
          >
            {isRTL ? (
              <ChevronRight className="h-5 w-5 rotate-180" style={{ color: cfg.color }} />
            ) : (
              <ChevronRight className="h-5 w-5" style={{ color: cfg.color }} />
            )}
          </div>
          <div className={isRTL ? "text-right" : ""}>
            <h2 className="text-xl font-bold text-[#0f172a]">{n(cfg.label_en, cfg.label_ar)}</h2>
            <p className="text-sm text-[#64748b]">{lang === "ar" ? cfg.label_en : cfg.label_ar}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {can("canExport", section) && (
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 h-9">
              <Download className="h-3.5 w-3.5" /> {t("cms_exportJson")}
            </Button>
          )}
        </div>
      </div>

      {/* Structured Content Disclaimer */}
      <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl text-xs text-teal-800 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
        {t("cms_vaccines_disclaimer")}
      </div>

      <VaccineList 
        vaccines={items}
        onAdd={() => { setEditItem(null); setFormOpen(true); }}
        onEdit={(v) => { setEditItem(v); setFormOpen(true); }}
        onPreview={(v) => { /* Preview logic could be added here */ }}
      />

      <ContentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        section={section}
        editItem={editItem}
        onSaved={refresh}
      />
    </div>
  );
}
