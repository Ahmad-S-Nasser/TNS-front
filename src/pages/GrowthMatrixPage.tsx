import { useState, useMemo } from "react";
import { useT, useI18n } from "@/i18n/i18n.context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  TrendingUp, Baby, Brain, Heart, MessageCircle, Hand, Ruler,
  Plus, Search, Edit, Trash2, Download, ChevronRight, CheckCircle2,
  AlertTriangle, Clock, Target, BarChart3, Grid3X3, Lightbulb,
  ArrowRight, Star, Zap, Eye, Settings2, Copy,
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import * as svc from "@/growth-matrix/matrix.service";
import type {
  AgeGroup, GrowthCategory, Skill, ExpectedRule, MetricType,
  ChildSkillInput, OverallScore, SkillStatus,
} from "@/growth-matrix/types";

// ─── Icon Mapper ────────────────────────────────────────────────────────────

const iconMap: Record<string, any> = {
  ruler: Ruler, hand: Hand, brain: Brain,
  messageCircle: MessageCircle, heart: Heart,
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-slate-100 text-slate-500 border-slate-200",
};

const skillStatusConfig: Record<SkillStatus, { label: string; color: string; icon: any }> = {
  achieved: { label: "Achieved", color: "text-emerald-600", icon: CheckCircle2 },
  pending: { label: "Pending", color: "text-amber-600", icon: Clock },
  delayed: { label: "Delayed", color: "text-red-500", icon: AlertTriangle },
  not_evaluated: { label: "Not Evaluated", color: "text-slate-400", icon: Eye },
};

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1: OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════

function OverviewTab() {
  const stats = useMemo(() => svc.getMatrixStats(), []);
  const t = useT();
  const { lang } = useI18n();
  const n = (bi: { en: string; ar: string }) => lang === "ar" ? bi.ar : bi.en;

  const chartData = useMemo(() => stats.skillsPerCategory.map(s => ({
    ...s,
    name: n(s.categoryName as any)
  })), [stats.skillsPerCategory, lang]);

  const coverageData = useMemo(() => stats.coverageByAgeGroup.map(c => ({
    ...c,
    name: n(c.label as any)
  })), [stats.coverageByAgeGroup, lang]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("matrix_kpi_ageGroups"),   value: stats.activeAgeGroups,  icon: Baby,    color: "bg-blue-50",   iconColor: "text-blue-600" },
          { label: t("matrix_kpi_totalSkills"), value: stats.totalSkills,       icon: Target,  color: "bg-purple-50", iconColor: "text-purple-600" },
          { label: t("matrix_kpi_categories"),  value: stats.totalCategories,  icon: Grid3X3, color: "bg-teal-50",   iconColor: "text-teal-600" },
          { label: t("matrix_kpi_ruleCoverage"),value: `${stats.coverage}%`,   icon: Zap,     color: "bg-amber-50",  iconColor: "text-amber-600" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-3xl font-bold text-[#0f172a] mt-1">{kpi.value}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl ${kpi.color} flex items-center justify-center`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-[#334155]">{t("matrix_chart_skillsPerCat")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" nameKey="name" strokeWidth={2} stroke="#fff">
                  {chartData.map((item, i) => (
                    <Cell key={i} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {chartData.map((item) => (
                <div key={item.categoryId} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#64748b]">{item.name}</span>
                  <span className="text-xs font-bold ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-[#334155]">{t("matrix_chart_ruleCoverage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={coverageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} fontSize={11} tick={{ fill: "#94a3b8" }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" fontSize={11} tick={{ fill: "#64748b" }} width={90} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: 13 }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="coverage" fill="#0d9488" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2: AGE GROUPS
// ═══════════════════════════════════════════════════════════════════════════

function AgeGroupsTab() {
  const t = useT();
  const { lang } = useI18n();
  const n = (bi: { en: string; ar: string }) => lang === "ar" ? bi.ar : bi.en;
  const [groups, setGroups] = useState<AgeGroup[]>(svc.getAgeGroups());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ labelEn: "", labelAr: "", monthStart: 0, monthEnd: 0, description: "" });

  const openCreate = () => {
    setEditId(null);
    setForm({ labelEn: "", labelAr: "", monthStart: 0, monthEnd: 0, description: "" });
    setDialogOpen(true);
  };

  const openEdit = (ag: AgeGroup) => {
    setEditId(ag.id);
    setForm({ labelEn: ag.label.en, labelAr: ag.label.ar, monthStart: ag.monthStart, monthEnd: ag.monthEnd, description: ag.description || "" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const data = {
      label: { en: form.labelEn, ar: form.labelAr },
      monthStart: form.monthStart,
      monthEnd: form.monthEnd,
      status: "active" as const,
      description: form.description,
    };
    if (editId) { svc.updateAgeGroup(editId, data); }
    else { svc.createAgeGroup(data); }
    setGroups(svc.getAgeGroups());
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    svc.deleteAgeGroup(id);
    setGroups(svc.getAgeGroups());
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0f172a]">{t("matrix_ag_heading")}</h2>
          <p className="text-sm text-[#64748b]">{t("matrix_ag_subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-[#0d9488] hover:bg-[#0f766e] text-white gap-2">
              <Plus className="h-4 w-4" /> {t("matrix_addAgeGroup")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editId ? t("matrix_ag_editTitle") : t("matrix_ag_createTitle")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("matrix_ag_labelEn")}</Label>
                  <Input value={form.labelEn} onChange={(e) => setForm({ ...form, labelEn: e.target.value })} placeholder="0-3 months" />
                </div>
                <div className="space-y-2">
                  <Label>{t("matrix_ag_labelAr")}</Label>
                  <Input dir="rtl" value={form.labelAr} onChange={(e) => setForm({ ...form, labelAr: e.target.value })} placeholder="٠-٣ أشهر" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("matrix_ag_startMonth")}</Label>
                  <Input type="number" value={form.monthStart} onChange={(e) => setForm({ ...form, monthStart: +e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("matrix_ag_endMonth")}</Label>
                  <Input type="number" value={form.monthEnd} onChange={(e) => setForm({ ...form, monthEnd: +e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("matrix_ag_description")}</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t("matrix_ag_descPlaceholder")} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("cancel")}</Button>
              <Button onClick={handleSave} className="bg-[#0d9488] hover:bg-[#0f766e] text-white">{editId ? t("matrix_update") : t("matrix_create")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groups.map((ag) => {
          const agRules = svc.getRulesByAgeGroup(ag.id);
          const relatedSkills = svc.getSkillsByAgeGroup(ag.id);
          const catCoverage = new Set(relatedSkills.map((s) => s.categoryId)).size;
          return (
            <Card key={ag.id} className="border-none shadow-sm hover:shadow-md transition-all group relative">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Baby className="h-5 w-5 text-teal-600" />
                  </div>
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold ${statusColors[ag.status]}`}>
                    {ag.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-[#0f172a] text-[15px]">{n(ag.label)}</h3>
                <p className="text-xs text-[#94a3b8] font-medium mt-0.5">{lang === "ar" ? ag.label.en : ag.label.ar}</p>
                <p className="text-xs text-[#64748b] mt-2">{ag.description}</p>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748b]"><span className="font-bold text-[#334155]">{agRules.length}</span> {t("matrix_ag_rules")}</span>
                  <span className="text-[#64748b]"><span className="font-bold text-[#334155]">{relatedSkills.length}</span> {t("matrix_ag_skills")}</span>
                  <span className="text-[#64748b]"><span className="font-bold text-[#334155]">{catCoverage}</span> {t("matrix_ag_cats")}</span>
                </div>
                <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(ag)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete(ag.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3: CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════

function CategoriesTab() {
  const t = useT();
  const { lang } = useI18n();
  const n = (bi: { en: string; ar: string }) => lang === "ar" ? bi.ar : bi.en;
  const [cats, setCats] = useState<GrowthCategory[]>(svc.getCategories());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nameEn: "", nameAr: "", descEn: "", descAr: "", iconKey: "ruler", color: "#3B82F6", sortOrder: 1 });

  const colorOptions = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444", "#EC4899", "#06B6D4", "#F97316"];
  const iconOptions = [
    { key: "ruler", label: "Ruler" }, { key: "hand", label: "Hand" }, { key: "brain", label: "Brain" },
    { key: "messageCircle", label: "Message" }, { key: "heart", label: "Heart" },
  ];

  const openCreate = () => {
    setEditId(null);
    setForm({ nameEn: "", nameAr: "", descEn: "", descAr: "", iconKey: "ruler", color: "#3B82F6", sortOrder: cats.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (cat: GrowthCategory) => {
    setEditId(cat.id);
    setForm({ nameEn: cat.name.en, nameAr: cat.name.ar, descEn: cat.description.en, descAr: cat.description.ar, iconKey: cat.iconKey, color: cat.color, sortOrder: cat.sortOrder });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const data = { name: { en: form.nameEn, ar: form.nameAr }, description: { en: form.descEn, ar: form.descAr }, iconKey: form.iconKey, color: form.color, sortOrder: form.sortOrder };
    if (editId) svc.updateCategory(editId, data);
    else svc.createCategory(data);
    setCats(svc.getCategories());
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0f172a]">{t("matrix_cat_heading")}</h2>
          <p className="text-sm text-[#64748b]">{t("matrix_cat_subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-[#0d9488] hover:bg-[#0f766e] text-white gap-2"><Plus className="h-4 w-4" /> {t("matrix_addCategory")}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{editId ? t("matrix_cat_editTitle") : t("matrix_cat_createTitle")}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t("matrix_cat_nameEn")}</Label><Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} /></div>
                <div className="space-y-2"><Label>{t("matrix_cat_nameAr")}</Label><Input dir="rtl" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t("matrix_cat_descEn")}</Label><Textarea value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} rows={2} /></div>
                <div className="space-y-2"><Label>{t("matrix_cat_descAr")}</Label><Textarea dir="rtl" value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} rows={2} /></div>
              </div>
              <div className="space-y-2">
                <Label>{t("matrix_cat_icon")}</Label>
                <div className="flex gap-2">{iconOptions.map((ic) => { const Ico = iconMap[ic.key] || Ruler; return (<button key={ic.key} onClick={() => setForm({ ...form, iconKey: ic.key })} className={`h-10 w-10 rounded-lg flex items-center justify-center border-2 transition-all ${form.iconKey === ic.key ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}><Ico className="h-5 w-5" /></button>); })}</div>
              </div>
              <div className="space-y-2">
                <Label>{t("matrix_cat_color")}</Label>
                <div className="flex gap-2">{colorOptions.map((c) => (<button key={c} onClick={() => setForm({ ...form, color: c })} className={`h-8 w-8 rounded-full border-2 transition-all ${form.color === c ? "border-slate-900 scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />))}</div>
              </div>
              <div className="space-y-2"><Label>{t("matrix_cat_sortOrder")}</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: +e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("cancel")}</Button>
              <Button onClick={handleSave} className="bg-[#0d9488] hover:bg-[#0f766e] text-white">{editId ? t("matrix_update") : t("matrix_create")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((cat) => {
          const Icon = iconMap[cat.iconKey] || Ruler;
          const skillCount = svc.getSkillsByCategory(cat.id).length;
          return (
            <Card key={cat.id} className="border-none shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}15` }}>
                    <Icon className="h-6 w-6" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0f172a] text-[15px]">{n(cat.name)}</h3>
                    <p className="text-xs text-[#94a3b8] font-medium mt-0.5">{lang === "ar" ? cat.name.en : cat.name.ar}</p>
                    <p className="text-xs text-[#64748b] mt-2 line-clamp-2">{n(cat.description)}</p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs font-bold" style={{ color: cat.color, backgroundColor: `${cat.color}15` }}>
                    {skillCount} {t("matrix_cat_skills")}
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(cat)}><Edit className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4: SKILLS & MILESTONES
// ═══════════════════════════════════════════════════════════════════════════

function SkillsTab() {
  const t = useT();
  const { lang } = useI18n();
  const n = (bi: { en: string; ar: string }) => lang === "ar" ? bi.ar : bi.en;
  const [allSkills, setAllSkills] = useState(svc.getSkills());
  const allCategories = svc.getCategories();
  const allAgeGroups = svc.getAgeGroups();
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedAg, setSelectedAg] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Add Skill Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    titleEn: "", titleAr: "",
    descEn: "", descAr: "",
    categoryId: "",
    metricType: "boolean" as MetricType,
    unit: "",
    weight: 5,
    ageGroupIds: [] as string[],
    tipEn: "", tipAr: "",
  });

  const filtered = useMemo(() => {
    let result = allSkills;
    if (selectedCat !== "all") result = result.filter((s) => s.categoryId === selectedCat);
    if (selectedAg !== "all") {
      const agSkillIds = svc.getRulesByAgeGroup(selectedAg).map((r) => r.skillId);
      result = result.filter((s) => agSkillIds.includes(s.id));
    }
    if (search) result = result.filter((s) => s.title.en.toLowerCase().includes(search.toLowerCase()) || s.title.ar.includes(search));
    return result;
  }, [selectedCat, selectedAg, search, allSkills]);

  const metricLabelAr = (type: MetricType) => {
    if (type === "boolean") return "نعم/لا";
    if (type === "numeric") return "رقمي";
    return "مقياس";
  };

  const handleCreateSkill = () => {
    if (!form.titleEn || !form.categoryId) return;

    const newSkill = svc.createSkill({
      title: { en: form.titleEn, ar: form.titleAr },
      description: { en: form.descEn, ar: form.descAr },
      categoryId: form.categoryId,
      metricType: form.metricType,
      unit: form.unit || undefined,
      weight: form.weight,
      improvementTips: form.tipEn ? [{ en: form.tipEn, ar: form.tipAr }] : [],
    });

    // Link with Age Groups by creating rules
    form.ageGroupIds.forEach(agId => {
      const ag = allAgeGroups.find(g => g.id === agId);
      svc.saveRule({
        skillId: newSkill.id,
        ageGroupId: agId,
        expectedMonth: ag?.monthStart || 0,
        // Default rule values based on metric type
        expectedBoolean: form.metricType === "boolean" ? true : undefined,
        optimalMin: form.metricType === "numeric" ? 0 : undefined,
        optimalMax: form.metricType === "numeric" ? 100 : undefined,
      });
    });

    setAllSkills(svc.getSkills());
    setIsDialogOpen(false);
    setForm({
      titleEn: "", titleAr: "", descEn: "", descAr: "",
      categoryId: "", metricType: "boolean", unit: "", weight: 5,
      ageGroupIds: [], tipEn: "", tipAr: ""
    });
  };

  const metricBadge: Record<MetricType, { label: string; color: string }> = {
    boolean: { label: "Yes/No", color: "bg-blue-50 text-blue-700" },
    numeric: { label: "Numeric", color: "bg-purple-50 text-purple-700" },
    scale: { label: "Scale", color: "bg-amber-50 text-amber-700" },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0f172a]">{t("matrix_sk_heading")}</h2>
          <p className="text-sm text-[#64748b]">{filtered.length} {t("matrix_sk_subtitle")} {allCategories.length} {t("matrix_sk_subtitleCats")}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0d9488] hover:bg-[#0f766e] text-white gap-2">
              <Plus className="h-4 w-4" /> {t("matrix_addSkill")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("matrix_sk_createTitle")}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("matrix_sk_titleLabel")}</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Input placeholder="English Title" value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} />
                    <Input dir="rtl" placeholder="العنوان بالعربية" value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>{t("matrix_sk_descLabel")}</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Textarea placeholder="English Description" value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} rows={2} />
                    <Textarea dir="rtl" placeholder="الوصف بالعربية" value={form.descAr} onChange={e => setForm({...form, descAr: e.target.value})} rows={2} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("matrix_sk_tipsLabel")}</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Input placeholder="English Tip" value={form.tipEn} onChange={e => setForm({...form, tipEn: e.target.value})} />
                    <Input dir="rtl" placeholder="نصيحة بالعربية" value={form.tipAr} onChange={e => setForm({...form, tipAr: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("matrix_sk_category")}</Label>
                  <Select value={form.categoryId} onValueChange={v => setForm({...form, categoryId: v})}>
                    <SelectTrigger><SelectValue placeholder={t("matrix_sk_catPlaceholder")} /></SelectTrigger>
                    <SelectContent>
                      {allCategories.map(c => <SelectItem key={c.id} value={c.id}>{n(c.name)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("matrix_sk_metricType")}</Label>
                  <Select value={form.metricType} onValueChange={(v: MetricType) => setForm({...form, metricType: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boolean">{t("matrix_sk_metricBoolean")}</SelectItem>
                      <SelectItem value="numeric">{t("matrix_sk_metricNumeric")}</SelectItem>
                      <SelectItem value="scale">{t("matrix_sk_metricScale")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.metricType === "numeric" && (
                  <div className="space-y-2 animate-in slide-in-from-top-2">
                    <Label>{t("matrix_sk_unit")}</Label>
                    <Input placeholder={t("matrix_sk_unitPlaceholder")} value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{t("matrix_sk_weight")}</Label>
                    <span className="text-xs font-bold text-teal-600">{form.weight}/10</span>
                  </div>
                  <Slider 
                    value={[form.weight]} 
                    min={1} max={10} step={1} 
                    onValueChange={([v]) => setForm({...form, weight: v})}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2 block">{t("matrix_sk_linkAgeGroups")}</Label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 max-h-32 overflow-y-auto">
                    {allAgeGroups.map(ag => (
                      <div key={ag.id} className="flex items-center gap-2">
                        <Switch 
                          id={`ag-${ag.id}`}
                          checked={form.ageGroupIds.includes(ag.id)}
                          onCheckedChange={(checked) => {
                            const ids = checked 
                              ? [...form.ageGroupIds, ag.id]
                              : form.ageGroupIds.filter(id => id !== ag.id);
                            setForm({...form, ageGroupIds: ids});
                          }}
                        />
                        <Label htmlFor={`ag-${ag.id}`} className="text-xs cursor-pointer truncate">{n(ag.label)}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t("cancel")}</Button>
              <Button 
                onClick={handleCreateSkill} 
                className="bg-[#0d9488] hover:bg-[#0f766e] text-white"
                disabled={!form.titleEn || !form.categoryId}
              >
                {t("matrix_sk_create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
          <Input placeholder={t("matrix_search")} className="pl-10 h-9 bg-white" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={selectedCat} onValueChange={setSelectedCat}>
          <SelectTrigger className="w-48 h-9"><SelectValue placeholder={t("matrix_sk_allCats")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("matrix_sk_allCats")}</SelectItem>
            {allCategories.map((c) => <SelectItem key={c.id} value={c.id}>{n(c.name)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedAg} onValueChange={setSelectedAg}>
          <SelectTrigger className="w-48 h-9"><SelectValue placeholder={t("matrix_sk_allAgeGroups")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("matrix_sk_allAgeGroups")}</SelectItem>
            {allAgeGroups.map((ag) => <SelectItem key={ag.id} value={ag.id}>{n(ag.label)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Skills List */}
      <div className="space-y-2">
        {filtered.map((skill) => {
          const cat = svc.getCategoryById(skill.categoryId);
          const isExpanded = expandedId === skill.id;
          const mb = metricBadge[skill.metricType];
          
          // Get linked age groups for this skill
          const linkedAgIds = svc.getRules().filter(r => r.skillId === skill.id).map(r => r.ageGroupId);
          const linkedAgs = allAgeGroups.filter(ag => linkedAgIds.includes(ag.id));

          return (
            <Card key={skill.id} className="border-none shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : skill.id)}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cat ? `${cat.color}15` : "#f1f5f9" }}>
                  {(() => { const Icon = iconMap[cat?.iconKey || "ruler"] || Ruler; return <Icon className="h-5 w-5" style={{ color: cat?.color || "#64748b" }} />; })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0f172a] text-sm">{n(skill.title)}</span>
                    <Badge className={`text-[10px] font-bold border-none ${mb.color}`}>{lang === "ar" ? metricLabelAr(skill.metricType) : mb.label}</Badge>
                    <div className="flex -space-x-1 ml-2 overflow-hidden">
                       {linkedAgs.slice(0, 3).map(ag => (
                         <div key={ag.id} className="h-4 w-4 rounded-full bg-slate-100 border border-white flex items-center justify-center" title={n(ag.label)}>
                           <Baby className="h-2 w-2 text-slate-400" />
                         </div>
                       ))}
                       {linkedAgs.length > 3 && (
                         <div className="h-4 w-4 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-bold text-slate-500">
                           +{linkedAgs.length - 3}
                         </div>
                       )}
                    </div>
                  </div>
                  <p className="text-xs text-[#94a3b8] font-medium">{lang === "ar" ? skill.title.en : skill.title.ar}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-[#64748b]">{t("matrix_sk_weightLabel")}</p>
                    <p className="text-sm font-bold text-[#0f172a]">{skill.weight}/10</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-[#94a3b8] transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-300 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-3">
                      <div><p className="text-xs font-bold text-[#64748b] uppercase tracking-wider">{t("matrix_sk_descEN")}</p><p className="text-sm text-[#334155] mt-1">{n(skill.description)}</p></div>
                      <div><p className="text-xs font-bold text-[#64748b] uppercase tracking-wider">{t("matrix_sk_descAR")}</p><p className="text-sm text-[#334155] mt-1 text-right" dir="rtl">{lang === "ar" ? skill.description.en : skill.description.ar}</p></div>
                      
                      <div>
                        <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">{t("matrix_sk_ageAvailability")}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {linkedAgs.map(ag => (
                            <Badge key={ag.id} variant="secondary" className="text-[10px] bg-slate-100 text-slate-600 border-none font-medium">
                              {n(ag.label)}
                            </Badge>
                          ))}
                          {linkedAgs.length === 0 && <span className="text-xs text-slate-400 italic">{t("matrix_sk_noAgeGroups")}</span>}
                        </div>
                      </div>

                      {skill.unit && (<div><p className="text-xs font-bold text-[#64748b] uppercase tracking-wider">{t("matrix_sk_unit")}</p><p className="text-sm text-[#334155] mt-1">{skill.unit}</p></div>)}
                      {skill.scaleOptions && (
                        <div>
                          <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">{t("matrix_sk_scaleOptions")}</p>
                          <div className="flex flex-wrap gap-2">
                            {skill.scaleOptions.map((opt) => (
                              <Badge key={opt.id} variant="outline" className="text-xs">
                                {opt.numericValue}: {n(opt.label)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">{t("matrix_sk_improvementTips")}</p>
                        {skill.improvementTips.map((tip, i) => (
                          <div key={i} className="flex gap-2 items-start bg-amber-50/50 p-3 rounded-lg mb-2">
                            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-[#475569]">{n(tip)}</p>
                              <p className="text-xs text-[#94a3b8] text-right mt-1" dir="rtl">{lang === "ar" ? tip.en : tip.ar}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider">{t("matrix_sk_weightScore")}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={skill.weight * 10} className="h-2 flex-1" />
                          <span className="text-xs font-bold text-[#0f172a]">{skill.weight}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// TAB 5: RULES EDITOR
// ═══════════════════════════════════════════════════════════════════════════

function RulesEditorTab() {
  const t = useT();
  const { isRTL, lang } = useI18n();
  const allAgeGroups = svc.getAgeGroups().filter((ag) => ag.status === "active");
  const allCategories = svc.getCategories();
  const [selectedCat, setSelectedCat] = useState<string>(allCategories[0]?.id || "");
  const [, forceUpdate] = useState(0);

  const categorySkills = useMemo(() => svc.getSkillsByCategory(selectedCat), [selectedCat]);

  const getRule = (skillId: string, ageGroupId: string) => svc.getRuleBySkillAndAgeGroup(skillId, ageGroupId);

  const n = (bi: { en: string; ar: string }) => lang === "ar" ? bi.ar : bi.en;

  const getCellDisplay = (skill: Skill, rule: ExpectedRule | undefined) => {
    if (!rule) return { text: "—", configured: false };
    if (skill.metricType === "boolean") return {
      text: rule.expectedBoolean
        ? (lang === "ar" ? "✓ متوقع" : "✓ Expected")
        : (lang === "ar" ? "غير متوقع" : "Not expected"),
      configured: true,
    };
    if (skill.metricType === "numeric") return { text: `${rule.optimalMin ?? "?"}–${rule.optimalMax ?? "?"} ${skill.unit || ""}`, configured: true };
    if (skill.metricType === "scale") return { text: `>= ${rule.minScaleValue ?? "?"}`, configured: true };
    return { text: "—", configured: false };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0f172a]">{t("matrix_rules_heading")}</h2>
          <p className="text-sm text-[#64748b]">{t("matrix_rules_subtitle")}</p>
        </div>
      </div>

      {/* Category Selector */}
      <div className="flex gap-2 flex-wrap">
        {allCategories.map((cat) => {
          const Icon = iconMap[cat.iconKey] || Ruler;
          return (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCat === cat.id ? "text-white shadow-md" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}
              style={selectedCat === cat.id ? { backgroundColor: cat.color } : {}}>
              <Icon className="h-4 w-4" />
              {n(cat.name)}
            </button>
          );
        })}
      </div>

      {/* Matrix Grid */}
      <Card className="border-none shadow-sm overflow-x-auto">
        <CardContent className="p-0">
          <div className="min-w-[800px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left p-4 text-xs font-bold text-[#64748b] uppercase tracking-wider w-64">{t("matrix_rules_skillCol")}</th>
                  {allAgeGroups.map((ag) => (
                    <th key={ag.id} className="p-4 text-xs font-bold text-[#64748b] uppercase tracking-wider text-center">{n(ag.label)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categorySkills.map((skill) => (
                  <tr key={skill.id} className="border-b border-slate-50 hover:bg-slate-50/30">
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">{n(skill.title)}</p>
                        <p className="text-[11px] text-[#94a3b8]">{lang === "ar" ? skill.title.en : skill.title.ar}</p>
                      </div>
                    </td>
                    {allAgeGroups.map((ag) => {
                      const rule = getRule(skill.id, ag.id);
                      const { text, configured } = getCellDisplay(skill, rule);
                      return (
                        <td key={ag.id} className="p-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${configured ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400"}`}>
                            {configured && <CheckCircle2 className="h-3 w-3" />}
                            {text}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {categorySkills.length === 0 && (
        <div className="text-center py-12">
          <Grid3X3 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-semibold text-slate-500">{t("matrix_rules_noSkills")}</p>
          <p className="text-sm text-slate-400">{t("matrix_rules_noSkillsHint")}</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 6: SCORING PREVIEW
// ═══════════════════════════════════════════════════════════════════════════

function ScoringPreviewTab() {
  const t = useT();
  const { lang } = useI18n();
  const n = (bi: { en: string; ar: string }) => lang === "ar" ? bi.ar : bi.en;
  const allAgeGroups = svc.getAgeGroups().filter((ag) => ag.status === "active");
  const [selectedAg, setSelectedAg] = useState<string>(allAgeGroups[0]?.id || "");
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<OverallScore | null>(null);

  const ageGroupRules = useMemo(() => svc.getRulesByAgeGroup(selectedAg), [selectedAg]);
  const ruleSkills = useMemo(() => {
    return ageGroupRules.map((rule) => ({
      rule,
      skill: svc.getSkillById(rule.skillId)!,
      category: svc.getCategoryById(svc.getSkillById(rule.skillId)?.categoryId || ""),
    })).filter((x) => x.skill);
  }, [ageGroupRules]);

  const handleInputChange = (skillId: string, value: any) => {
    setInputs((prev) => ({ ...prev, [skillId]: value }));
  };

  const runEvaluation = () => {
    const childInputs: ChildSkillInput[] = Object.entries(inputs).map(([skillId, value]) => ({ skillId, value }));
    const scoreResult = svc.calculateScore({ childAgeMonths: 0, ageGroupId: selectedAg, inputs: childInputs });
    setResult(scoreResult);
  };

  const handleExport = () => {
    const matrix = svc.exportMatrix(selectedAg);
    const blob = new Blob([JSON.stringify(matrix, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `growth-matrix-${selectedAg}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const progressColor = (label: string | undefined) => {
    if (label === "excellent") return "#10B981";
    if (label === "good") return "#3B82F6";
    if (label === "needs_attention") return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0f172a]">{t("matrix_score_heading")}</h2>
          <p className="text-sm text-[#64748b]">{t("matrix_score_subtitle")}</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}><Download className="h-4 w-4" /> {t("matrix_score_exportJson")}</Button>
      </div>

      {/* Age Group Selector */}
      <div className="flex gap-3 items-center">
        <Label className="text-sm font-semibold">{t("matrix_score_ageGroup")}</Label>
        <Select value={selectedAg} onValueChange={(v) => { setSelectedAg(v); setResult(null); setInputs({}); }}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>{allAgeGroups.map((ag) => <SelectItem key={ag.id} value={ag.id}>{n(ag.label)}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-[#334155]">{t("matrix_score_enterValues")}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ruleSkills.map(({ skill, rule, category }) => (
                  <div key={skill.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: category ? `${category.color}15` : "#f1f5f9" }}>
                      {(() => { const Ic = iconMap[category?.iconKey || "ruler"] || Ruler; return <Ic className="h-4 w-4" style={{ color: category?.color }} />; })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0f172a]">{n(skill.title)}</p>
                      <p className="text-[11px] text-[#94a3b8]">{skill.metricType === "boolean" ? `${t("matrix_score_yes")}/${t("matrix_score_no")}` : skill.metricType === "numeric" ? `Enter ${skill.unit || "value"}` : "Select level"}</p>
                    </div>
                    <div className="w-40 shrink-0">
                      {skill.metricType === "boolean" && (
                        <div className="flex items-center gap-2">
                          <Switch checked={inputs[skill.id] === true} onCheckedChange={(v) => handleInputChange(skill.id, v)} />
                          <span className="text-xs text-[#64748b]">{inputs[skill.id] ? t("matrix_score_yes") : t("matrix_score_no")}</span>
                        </div>
                      )}
                      {skill.metricType === "numeric" && (
                        <Input type="number" placeholder={skill.unit || "0"} className="h-8 text-sm" value={inputs[skill.id] || ""} onChange={(e) => handleInputChange(skill.id, parseFloat(e.target.value) || 0)} />
                      )}
                      {skill.metricType === "scale" && (
                        <Select value={String(inputs[skill.id] || "")} onValueChange={(v) => handleInputChange(skill.id, parseInt(v))}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>{skill.scaleOptions?.map((opt) => <SelectItem key={opt.id} value={String(opt.numericValue)}>{n(opt.label)}</SelectItem>)}</SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button onClick={runEvaluation} className="bg-[#0d9488] hover:bg-[#0f766e] text-white w-full h-11 font-bold gap-2">
                  <BarChart3 className="h-4 w-4" /> {t("matrix_score_runEval")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Overall Score */}
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={progressColor(result.label)} strokeWidth="3" strokeDasharray={`${result.percentage}, 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-[#0f172a]">{result.percentage}%</span>
                    </div>
                  </div>
                  <Badge className="text-sm font-bold px-4 py-1 border-none" style={{ backgroundColor: `${progressColor(result.label)}20`, color: progressColor(result.label) }}>
                    {result.label === "excellent" ? "⭐ Excellent" : result.label === "good" ? "👍 Good" : result.label === "needs_attention" ? "⚠️ Needs Attention" : "🚨 Critical"}
                  </Badge>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-[#334155]">{t("matrix_score_categoryScores")}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {result.categoryScores.map((cs) => (
                    <div key={cs.categoryId}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-[#334155]">{n(cs.categoryName)}</span>
                        <span className="font-bold" style={{ color: cs.color }}>{cs.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cs.score}%`, backgroundColor: cs.color }} />
                      </div>
                      <p className="text-[10px] text-[#94a3b8] mt-0.5">{cs.achievedSkills}/{cs.totalSkills} {t("matrix_score_achieved")}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommendations */}
              {result.skillEvaluations.filter((e) => e.recommendation).length > 0 && (
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-[#334155] flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" /> {t("matrix_score_tips")}</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {result.skillEvaluations.filter((e) => e.recommendation).map((ev) => (
                      <div key={ev.skillId} className="p-3 bg-amber-50/50 rounded-lg">
                        <p className="text-xs font-bold text-[#334155]">{n(ev.skillTitle)}</p>
                        <p className="text-xs text-[#64748b] mt-1">{ev.recommendation ? n(ev.recommendation) : ""}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-none shadow-sm">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500">{t("matrix_score_noResults")}</p>
                <p className="text-xs text-slate-400 mt-1">{t("matrix_score_noResultsHint")}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

const GrowthMatrixPage = () => {
  const t = useT();
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">{t("matrix_title")}</h1>
        <p className="text-[15px] text-[#64748b] mt-1">{t("matrix_subtitle")}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-[#f1f5f9] p-1 h-auto flex-wrap">
          <TabsTrigger value="overview" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BarChart3 className="h-3.5 w-3.5" /> {t("matrix_overview")}
          </TabsTrigger>
          <TabsTrigger value="age-groups" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Baby className="h-3.5 w-3.5" /> {t("matrix_ageGroups")}
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Grid3X3 className="h-3.5 w-3.5" /> {t("matrix_categories")}
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Target className="h-3.5 w-3.5" /> {t("matrix_skills")}
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Settings2 className="h-3.5 w-3.5" /> {t("matrix_rulesEditor")}
          </TabsTrigger>
          <TabsTrigger value="scoring" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Star className="h-3.5 w-3.5" /> {t("matrix_scoringPreview")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6"><OverviewTab /></TabsContent>
        <TabsContent value="age-groups" className="mt-6"><AgeGroupsTab /></TabsContent>
        <TabsContent value="categories" className="mt-6"><CategoriesTab /></TabsContent>
        <TabsContent value="skills" className="mt-6"><SkillsTab /></TabsContent>
        <TabsContent value="rules" className="mt-6"><RulesEditorTab /></TabsContent>
        <TabsContent value="scoring" className="mt-6"><ScoringPreviewTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default GrowthMatrixPage;
