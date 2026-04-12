import { Users, FileText, Activity, Eye, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/KPICard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { useT } from "@/i18n/i18n.context";

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

  return (
    <div className="space-y-6">
      <div>
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
        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t("dashboard_userGrowth")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }} />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t("dashboard_contentDist")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={contentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={2} stroke="hsl(var(--card))">
                  {contentData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {contentData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-semibold ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t("dashboard_weeklyActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }} />
                <Bar dataKey="active" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="new" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t("dashboard_recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="space-y-3">
              {recentActivities.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    item.type === "user" ? "bg-primary/10" :
                    item.type === "content" ? "bg-success/10" :
                    item.type === "alert" ? "bg-destructive/10" : "bg-muted"
                  }`}>
                    {item.type === "user"    && <Users       className="h-3 w-3 text-primary" />}
                    {item.type === "content" && <CheckCircle2 className="h-3 w-3 text-success" />}
                    {item.type === "alert"   && <Activity    className="h-3 w-3 text-destructive" />}
                    {item.type === "system"  && <Clock       className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.action_en}</p>
                    <p className="text-[10px] text-muted-foreground">{item.user} · {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
