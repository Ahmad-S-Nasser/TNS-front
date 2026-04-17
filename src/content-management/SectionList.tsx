import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain, HeartHandshake, Apple, ShieldCheck, Puzzle,
  Building2, Cross, Siren, ChevronRight, FileText,
  CheckCircle, Clock, BookOpen, AlertCircle, Syringe,
} from "lucide-react";
import type { CMSSection } from "./cms.types";
import { SECTION_CONFIGS } from "./cms.service";
import type { SectionStats } from "./cms.types";
import { useT, useI18n } from "@/i18n/i18n.context";


const iconMap: Record<string, any> = {
  brain: Brain,
  "heart-handshake": HeartHandshake,
  apple: Apple,
  "shield-check": ShieldCheck,
  puzzle: Puzzle,
  "building-2": Building2,
  cross: Cross,
  siren: Siren,
  syringe: Syringe,
};

interface SectionListProps {
  stats: SectionStats[];
  onSelectSection: (section: CMSSection) => void;
}

export function SectionList({ stats, onSelectSection }: SectionListProps) {
  const t = useT();
  const { lang, isRTL } = useI18n();
  const n = (en: string, ar: string) => lang === "ar" ? ar : en;
  const statsMap = useMemo(() => {
    const m: Record<string, SectionStats> = {};
    stats.forEach(s => { m[s.section] = s; });
    return m;
  }, [stats]);

  const overallTotal = stats.reduce((s, x) => s + x.total, 0);
  const overallPublished = stats.reduce((s, x) => s + x.published, 0);
  const overallDraft = stats.reduce((s, x) => s + x.draft, 0);
  const overallReview = stats.reduce((s, x) => s + x.review, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={isRTL ? "text-right" : ""}>
        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">{t("cms_title")}</h1>
        <p className="text-[15px] text-[#64748b] mt-1">{t("cms_subtitle")}</p>
      </div>

      {/* Overall KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t("cms_totalContent"), value: overallTotal, icon: FileText, color: "bg-slate-50", ic: "text-slate-600" },
          { label: t("cms_published"), value: overallPublished, icon: CheckCircle, color: "bg-emerald-50", ic: "text-emerald-600" },
          { label: t("cms_inReview"), value: overallReview, icon: Clock, color: "bg-amber-50", ic: "text-amber-600" },
          { label: t("cms_drafts"), value: overallDraft, icon: BookOpen, color: "bg-blue-50", ic: "text-blue-600" },
        ].map(k => (
          <Card key={k.label} className="border-none shadow-sm shadow-slate-200/50">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-11 w-11 rounded-xl ${k.color} flex items-center justify-center shrink-0`}>
                <k.icon className={`h-5 w-5 ${k.ic}`} />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <p className="text-2xl font-bold text-[#0f172a]">{k.value}</p>
                <p className="text-xs text-[#64748b] font-medium">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SECTION_CONFIGS.map(cfg => {
          const Icon = iconMap[cfg.icon] || FileText;
          const s = statsMap[cfg.key] || { total: 0, published: 0, draft: 0, review: 0, approved: 0, archived: 0 };
          const publishPct = s.total > 0 ? Math.round((s.published / s.total) * 100) : 0;

          return (
            <Card
              key={cfg.key}
              className="border-none shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => onSelectSection(cfg.key)}
            >
              <CardContent className="p-0">
                {/* Color Header */}
                <div className={`h-2 w-full bg-gradient-to-r ${cfg.gradient}`} />
                <div className="p-5">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${cfg.color}20` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: cfg.color }} />
                    </div>
                    {(cfg.requires_doctor_approval || cfg.requires_admin_approval) && (
                      <div className="flex gap-1">
                        {cfg.requires_doctor_approval && (
                          <div className="h-5 w-5 rounded-full bg-purple-50 flex items-center justify-center" title={t("cms_doctorApproval")}>
                            <AlertCircle className="h-3 w-3 text-purple-500" />
                          </div>
                        )}
                        {cfg.requires_admin_approval && (
                          <div className="h-5 w-5 rounded-full bg-amber-50 flex items-center justify-center" title={t("cms_adminApproval")}>
                            <ShieldCheck className="h-3 w-3 text-amber-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Names */}
                  <h3 className={`font-bold text-[#0f172a] text-sm leading-tight ${isRTL ? "text-right" : ""}`}>
                    {n(cfg.label_en, cfg.label_ar)}
                  </h3>
                  <p className={`text-xs text-[#94a3b8] font-medium mt-0.5 ${isRTL ? "text-right" : ""}`} dir={lang === "ar" ? "ltr" : "rtl"}>
                    {lang === "ar" ? cfg.label_en : cfg.label_ar}
                  </p>

                  {/* Stats */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#64748b]">{t("cms_published")}</span>
                      <span className="text-xs font-bold" style={{ color: cfg.color }}>{s.published}/{s.total}</span>
                    </div>
                    <Progress value={publishPct} className="h-1.5" style={{ "--progress-color": cfg.color } as any} />
                    <div className={`flex gap-2 mt-2 flex-wrap ${isRTL ? "justify-start" : "justify-start"}`}>
                      {s.review > 0 && (
                        <Badge className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-700 border-none">
                          {s.review} {t("cms_statusReview")}
                        </Badge>
                      )}
                      {s.draft > 0 && (
                        <Badge className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-50 text-slate-500 border-none">
                          {s.draft} {t("cms_statusDraft")}
                        </Badge>
                      )}
                      {s.approved > 0 && (
                        <Badge className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border-none">
                          {s.approved} {t("cms_statusApproved")}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full mt-4 justify-between text-xs font-semibold h-8 ${isRTL ? "flex-row-reverse" : ""}`}
                    style={{ color: cfg.color }}
                  >
                    {t("cms_manageSection")}
                    {isRTL ? <ChevronRight className="h-3.5 w-3.5 rotate-180" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
