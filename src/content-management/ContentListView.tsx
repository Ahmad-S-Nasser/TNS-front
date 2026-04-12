import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Search, Plus, Edit, Trash2, Download, ChevronRight,
  Eye, ArrowRight, Archive, CheckCircle2, Clock, FileText,
  AlertTriangle, Globe,
} from "lucide-react";
import type { CMSSection, CMSContent, ContentStatus } from "./cms.types";
import { getAllContent, promoteStatus, archiveContent, deleteContent, exportSection, getSectionConfig, getNextStatus } from "./cms.service";
import { can } from "./permissions";
import { ContentFormDialog } from "./ContentFormDialog";
import { useT, useI18n } from "@/i18n/i18n.context";

interface ContentListViewProps {
  section: CMSSection;
}

const statusConfig: Record<ContentStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: "Draft",     color: "text-slate-600",   bg: "bg-slate-50 border-slate-200" },
  review:    { label: "In Review", color: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
  approved:  { label: "Approved",  color: "text-blue-700",    bg: "bg-blue-50 border-blue-200" },
  published: { label: "Published", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  archived:  { label: "Archived",  color: "text-slate-400",   bg: "bg-slate-50 border-slate-100" },
};

const statusIcons: Record<ContentStatus, any> = {
  draft:     FileText,
  review:    Clock,
  approved:  CheckCircle2,
  published: Globe,
  archived:  Archive,
};

export function ContentListView({ section }: ContentListViewProps) {
  const t = useT();
  const { isRTL } = useI18n();
  const cfg = getSectionConfig(section);
  const [items, setItems] = useState<CMSContent[]>(() => getAllContent(section));
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<CMSContent | null>(null);

  const refresh = () => setItems(getAllContent(section));

  const filtered = useMemo(() => {
    let result = items;
    if (statusFilter !== "all") result = result.filter(c => c.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.title_ar.includes(search) ||
        c.title_en.toLowerCase().includes(q) ||
        c.description_ar.includes(search) ||
        c.description_en.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, statusFilter, search]);

  const handlePromote = (id: string) => {
    promoteStatus(id);
    refresh();
  };

  const handleArchive = (id: string) => {
    archiveContent(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteContent(id);
      refresh();
    }
  };

  const handleExport = () => {
    const payload = exportSection(section);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cms-${section}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openEdit = (item: CMSContent) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const counts = useMemo(() => ({
    all:       items.length,
    draft:     items.filter(c => c.status === "draft").length,
    review:    items.filter(c => c.status === "review").length,
    approved:  items.filter(c => c.status === "approved").length,
    published: items.filter(c => c.status === "published").length,
    archived:  items.filter(c => c.status === "archived").length,
  }), [items]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${cfg.color}20` }}
          >
            <ChevronRight className="h-5 w-5" style={{ color: cfg.color }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0f172a]">{cfg.label_en}</h2>
            <p className="text-sm text-[#64748b]" dir="rtl">{cfg.label_ar}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {can("canExport", section) && (
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 h-9">
              <Download className="h-3.5 w-3.5" /> {t("cms_exportJson")}
            </Button>
          )}
          {can("canCreate", section) && (
            <Button
              size="sm"
              className="gap-2 h-9 text-white"
              style={{ backgroundColor: cfg.color }}
              onClick={openCreate}
            >
              <Plus className="h-3.5 w-3.5" /> {t("cms_addContent")}
            </Button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
          <Input
            placeholder={t("cms_searchPlaceholder")}
            className={`${isRTL ? "pr-10" : "pl-10"} h-9 bg-white`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
          {(["all", "draft", "review", "approved", "published", "archived"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === s
                  ? "bg-white shadow-sm text-[#0f172a]"
                  : "text-[#64748b] hover:text-[#334155]"
              }`}
            >
              {s === "all" ? `${t("cms_statusAll")} (${counts.all})` :
               s === "draft" ? `${t("cms_statusDraft")} (${counts[s]})` :
               s === "review" ? `${t("cms_statusReview")} (${counts[s]})` :
               s === "approved" ? `${t("cms_statusApproved")} (${counts[s]})` :
               s === "published" ? `${t("cms_statusPublished")} (${counts[s]})` :
               `${t("cms_statusArchived")} (${counts[s]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold">{t("cms_noContent")}</p>
            <p className="text-xs text-slate-400 mt-1">{t("cms_noContentHint")}</p>
          </div>
        )}

        {filtered.map(item => {
          const sc = statusConfig[item.status];
          const StatusIcon = statusIcons[item.status];
          const next = getNextStatus(item.status);

          return (
            <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${sc.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${sc.color}`} />
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#0f172a] text-[15px] leading-tight">{item.title_en}</p>
                        <p className="text-sm text-[#94a3b8] font-medium mt-0.5" dir="rtl">{item.title_ar}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[10px] font-bold uppercase tracking-wider border ${sc.bg} ${sc.color}`}
                      >
                        {sc.label}
                      </Badge>
                    </div>

                    <p className="text-xs text-[#64748b] mt-2 line-clamp-1">{item.description_en}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[11px] text-[#94a3b8]">{t("cms_by")} {item.created_by}</span>
                      <span className="text-[11px] text-[#94a3b8]">·</span>
                      <span className="text-[11px] text-[#94a3b8]">{new Date(item.updated_at).toLocaleDateString()}</span>
                      {item.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[9px] h-4 px-1.5 bg-slate-100 text-slate-500 border-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {can("canEdit", section) && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {can("canApprove", section) && next && item.status !== "archived" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs font-semibold"
                        style={{ color: cfg.color }}
                        onClick={() => handlePromote(item.id)}
                        title={`Move to ${next}`}
                      >
                        <ArrowRight className="h-3 w-3" />
                        {next.charAt(0).toUpperCase() + next.slice(1)}
                      </Button>
                    )}
                    {can("canDelete", section) && item.status !== "archived" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-500" onClick={() => handleArchive(item.id)}>
                        <Archive className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {can("canDelete", section) && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Form Dialog */}
      <ContentFormDialog
        open={formOpen}
        onOpenChange={open => { setFormOpen(open); if (!open) setEditItem(null); }}
        section={section}
        editItem={editItem}
        onSaved={refresh}
      />
    </div>
  );
}
