import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Shield, Users, FileText, Settings, Filter, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useT, useI18n } from "@/i18n/i18n.context";

const logs = [
  { id: 1, action: "User suspended",    actor: "Admin Team",   target: "Fatima Al-Hassan",          type: "user",    time: "2m ago",  date: "2025-01-12 14:30" },
  { id: 2, action: "Article published", actor: "Dr. Khalid",   target: "10 Tips for Better Sleep",  type: "content", time: "2h ago",  date: "2025-01-12 12:15" },
  { id: 3, action: "Role updated",      actor: "Super Admin",  target: "Dr. Hana - Doctor",         type: "role",    time: "6h ago",  date: "2025-01-11 18:45" },
  { id: 4, action: "Settings changed",  actor: "Super Admin",  target: "Enable 2FA requirement",    type: "system",  time: "8h ago",  date: "2025-01-11 16:20" },
  { id: 5, action: "User activated",    actor: "Manager",      target: "Omar bin Said",             type: "user",    time: "1d ago",  date: "2025-01-11 10:00" },
  { id: 6, action: "Content deleted",   actor: "Marketing",    target: "Old Nutrition Guide",       type: "content", time: "1d ago",  date: "2025-01-10 09:30" },
  { id: 7, action: "Password reset",    actor: "IT Support",   target: "Sara Ahmed",                type: "user",    time: "2d ago",  date: "2025-01-10 08:15" },
  { id: 8, action: "New admin added",   actor: "Super Admin",  target: "Ahmad Nasser (Manager)",   type: "role",    time: "3d ago",  date: "2025-01-09 17:00" },
];

const typeStyles: Record<string, { icon: any; color: string; bg: string }> = {
  user:    { icon: Users,    color: "text-blue-600",   bg: "bg-blue-50"   },
  content: { icon: FileText, color: "text-teal-600",   bg: "bg-teal-50"   },
  role:    { icon: Shield,   color: "text-purple-600", bg: "bg-purple-50" },
  system:  { icon: Settings, color: "text-slate-600",  bg: "bg-slate-100" },
};

const AuditLogs = () => {
  const t = useT();
  const { isRTL } = useI18n();
  const [search, setSearch] = useState("");

  const localizedLogs = logs.map(log => ({
    ...log,
    action: isRTL ? log.action
      .replace("suspended", "تم إيقافه")
      .replace("published", "تم نشره")
      .replace("updated", "تم تحديثه")
      .replace("changed", "تم تغييره")
      .replace("activated", "تم تفعيله")
      .replace("deleted", "تم حذفه")
      .replace("reset", "إعادة تعيين")
      .replace("added", "تم إضافته")
      .replace("User", "مستخدم")
      .replace("Article", "مقال")
      .replace("Role", "دبل")
      .replace("Settings", "إعدادات")
      .replace("Password", "كلمة المرور")
      : log.action,
    actor: isRTL ? log.actor
      .replace("Admin Team", "فريق الإدارة")
      .replace("Super Admin", "مدير النظام")
      .replace("Manager", "مدير")
      .replace("Marketing", "التسويق")
      .replace("IT Support", "الدعم الفني")
      : log.actor,
    time: isRTL ? log.time
      .replace("m ago", " د")
      .replace("h ago", " س")
      .replace("d ago", " ي")
      : log.time,
    type: isRTL ? {
      user: "مستخدم",
      content: "محتوى",
      role: "صلاحية",
      system: "نظام"
    }[log.type] || log.type : log.type,
    originalType: log.type
  }));

  const filtered = localizedLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className={isRTL ? "text-right" : ""}>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">{t("auditLogs_title")}</h1>
          <p className="text-[15px] text-[#64748b] mt-1">{t("auditLogs_subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-[#64748b] border-[#e2e8f0]">
            <Download className="h-4 w-4" />
            {t("export")}
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-2 text-[#64748b] border-[#e2e8f0]">
            <Filter className="h-4 w-4" />
            {t("filter")}
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-[#f1f5f9]">
          <div className="relative max-w-md">
            <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]`} />
            <Input
              placeholder={t("auditLogs_searchPlaceholder")}
              className={`${isRTL ? "pr-10" : "pl-10"} h-10 bg-[#f8fafc] border-[#e2e8f0] focus-visible:ring-[#0d9488]/20 focus-visible:border-[#0d9488]`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#f1f5f9]">
            {filtered.length > 0 ? (
              filtered.map((log) => {
                const style = typeStyles[log.originalType || log.type] || typeStyles.system;
                return (
                  <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-[#f8fafc] transition-colors group">
                    <div className={`h-11 w-11 rounded-xl ${style.bg} flex items-center justify-center shrink-0 shadow-sm border border-transparent group-hover:border-white transition-all`}>
                      <style.icon className={`h-5 w-5 ${style.color}`} />
                    </div>
                    <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : "text-left"}`}>
                      <div className={`flex items-center gap-2 mb-0.5 ${isRTL ? "flex-row" : "flex-row"}`}>
                        <span className="font-bold text-[#334155]">{log.actor}</span>
                        <Badge variant="secondary" className={`text-[10px] uppercase tracking-wider font-bold h-5 px-2 bg-white border border-[#e2e8f0] ${style.color}`}>
                          {log.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#475569]">
                        <span className="opacity-70">{log.action}: </span>
                        <span className="font-semibold text-[#1e293b]">{log.target}</span>
                      </p>
                    </div>
                    <div className={`flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-1.5 shrink-0 ${isRTL ? "sm:items-start" : "sm:items-end"}`}>
                      <span className="text-[13px] font-medium text-[#1e293b]">{log.time}</span>
                      <span className="text-[11px] text-[#94a3b8]">{log.date}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{t("auditLogs_noLogs")}</h3>
                <p className="text-slate-500">{t("auditLogs_noLogsHint")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-slate-500">
          {t("auditLogs_showing")} {filtered.length} {t("auditLogs_of")} {logs.length} {t("auditLogs_activities")}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="h-8 border-[#e2e8f0]">{t("previous")}</Button>
          <Button variant="outline" size="sm" className="h-8 border-[#e2e8f0]">{t("nextPage")}</Button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
