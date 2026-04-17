import { Users, FileText, Activity, Eye, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/KPICard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { useT, useI18n } from "@/i18n/i18n.context";

const userGrowthData = [
  { month: "Jan", users: 1200 }, { month: "Feb", users: 1800 }, { month: "Mar", users: 2400 },
  { month: "Apr", users: 3100 }, { month: "May", users: 3800 }, { month: "Jun", users: 4500 }, { month: "Jul", users: 5200 },
];

const contentData = [
  { name: "Tips", value: 142, color: "hsl(172, 65%, 40%)" },
  { name: "Steps", value: 98,  color: "hsl(24, 89%, 55%)" },
  { name: "Articles", value: 67, color: "hsl(168, 62%, 24%)" },
  { name: "Videos", value: 34, color: "hsl(200, 60%, 50%)" },
];

const weeklyActivity = [
  { day: "Mon", active: 320, new: 42 }, { day: "Tue", active: 450, new: 38 },
  { day: "Wed", active: 380, new: 55 }, { day: "Thu", active: 520, new: 61 },
  { day: "Fri", active: 410, new: 47 }, { day: "Sat", active: 280, new: 29 }, { day: "Sun", active: 190, new: 22 },
];

const recentActivities = [
  { action_en: "New user registered",      action_ar: "تسجيل مستخدم جديد",       user: "Sara Ahmed",    time: "2 min ago",  type: "user" },
  { action_en: "Article published",        action_ar: "تم نشر مقالة",             user: "Dr. Khalid",   time: "15 min ago", type: "content" },
  { action_en: "User suspended",           action_ar: "تم إيقاف مستخدم",          user: "Admin Team",   time: "1 hr ago",   type: "alert" },
  { action_en: "Tip approved",             action_ar: "تمت الموافقة على نصيحة",   user: "Marketing",    time: "2 hrs ago",  type: "content" },
  { action_en: "System backup completed",  action_ar: "اكتمل النسخ الاحتياطي",   user: "System",       time: "3 hrs ago",  type: "system" },
];

const Dashboard = () => {
  const t = useT();
  const { isRTL, lang } = useI18n();

  // Localized months for the line chart
  const months = isRTL 
    ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو"]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const localizedUserGrowth = userGrowthData.map((d, i) => ({
    ...d,
    month: months[i] || d.month
  }));

  // Localized content names for pie chart
  const contentNames: Record<string, string> = {
    Tips: isRTL ? "نصائح" : "Tips",
    Steps: isRTL ? "خطوات" : "Steps",
    Articles: isRTL ? "مقالات" : "Articles",
    Videos: isRTL ? "فيديوهات" : "Videos"
  };

  const localizedContentData = contentData.map(d => ({
    ...d,
    name: contentNames[d.name] || d.name
  }));

  // Localized days for bar chart
  const days = isRTL
    ? ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const localizedWeeklyActivity = weeklyActivity.map((d, i) => ({
    ...d,
    day: days[i] || d.day
  }));

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className={isRTL ? "text-right" : ""}>
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard_title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("dashboard_welcome")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title={t("dashboard_totalUsers")}     value="5,247"  change="+12.5%" trend="up"   icon={Users} />
        <KPICard title={t("dashboard_activeToday")}    value="1,832"  change="+8.2%"  trend="up"   icon={Activity} />
        <KPICard title={t("dashboard_publishedContent")} value="341"  change="+23.1%" trend="up"   icon={FileText} />
        <KPICard title={t("dashboard_pageViews")}      value="48.2K"  change="-3.1%"  trend="down" icon={Eye} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 animate-fade-in shadow-sm border-none">
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-bold text-[#334155] ${isRTL ? "text-right" : ""}`}>{t("dashboard_userGrowth")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={localizedUserGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" fontSize={11} tick={{ fill: "#94a3b8" }} reversed={isRTL} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} orientation={isRTL ? "right" : "left"} tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#fff", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "12px", 
                    fontSize: 12,
                    textAlign: isRTL ? "right" : "left"
                  }} 
                />
                <Line type="monotone" dataKey="users" name={isRTL ? "المستخدمين" : "Users"} stroke="#00d1ff" strokeWidth={3} dot={{ fill: "#00d1ff", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-in shadow-sm border-none">
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-bold text-[#334155] ${isRTL ? "text-right" : ""}`}>{t("dashboard_contentDist")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={localizedContentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={2} stroke="#fff">
                  {localizedContentData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#fff", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "12px", 
                    fontSize: 12
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {localizedContentData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#64748b] truncate">{item.name}</span>
                  <span className={`text-xs font-bold ${isRTL ? "mr-auto" : "ml-auto"}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 animate-fade-in shadow-sm border-none">
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-bold text-[#334155] ${isRTL ? "text-right" : ""}`}>{t("dashboard_weeklyActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={localizedWeeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" fontSize={11} tick={{ fill: "#94a3b8" }} reversed={isRTL} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} orientation={isRTL ? "right" : "left"} tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: "#fff", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "12px", 
                    fontSize: 12,
                    textAlign: isRTL ? "right" : "left"
                  }} 
                />
                <Bar dataKey="active" name={isRTL ? "نشط" : "Active"} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="new" name={isRTL ? "جديد" : "New"} fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-in shadow-sm border-none overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-bold text-[#334155] ${isRTL ? "text-right" : ""}`}>{t("dashboard_recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="space-y-4">
              {recentActivities.map((item, i) => (
                <div key={i} className={`flex items-start gap-4 py-1.5 ${isRTL ? "flex-row" : "flex-row"}`}>
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === "user" ? "bg-blue-50 text-blue-600" :
                    item.type === "content" ? "bg-emerald-50 text-emerald-600" :
                    item.type === "alert" ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"
                  }`}>
                    {item.type === "user"    && <Users       className="h-4 w-4" />}
                    {item.type === "content" && <CheckCircle2 className="h-4 w-4" />}
                    {item.type === "alert"   && <Activity    className="h-4 w-4" />}
                    {item.type === "system"  && <Clock       className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold text-[#0f172a] truncate ${isRTL ? "text-right" : "text-left"}`}>
                      {lang === "ar" ? item.action_ar : item.action_en}
                    </p>
                    <p className={`text-[11px] text-[#94a3b8] ${isRTL ? "text-right" : "text-left"}`}>
                      <span className="font-medium text-[#64748b]">{item.user}</span> · {isRTL ? item.time.replace("min", "د").replace("hr", "س").replace("ago", "مضت") : item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors border border-primary/10">
              {t("view_all")}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};;

export default Dashboard;
