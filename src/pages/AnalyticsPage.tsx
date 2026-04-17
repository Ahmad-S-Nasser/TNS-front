import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users, FileText, Activity } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { useT, useI18n } from "@/i18n/i18n.context";

const monthlyData = [
  { month: "Aug", users: 2100, content: 45, engagement: 67 },
  { month: "Sep", users: 2800, content: 52, engagement: 72 },
  { month: "Oct", users: 3200, content: 61, engagement: 78 },
  { month: "Nov", users: 3900, content: 70, engagement: 74 },
  { month: "Dec", users: 4300, content: 78, engagement: 82 },
  { month: "Jan", users: 5200, content: 89, engagement: 85 },
];

const engagementByContent = [
  { type: "Tips",     views: 12400, likes: 3200, shares: 890 },
  { type: "Steps",    views: 9800,  likes: 2800, shares: 720 },
  { type: "Articles", views: 7600,  likes: 2100, shares: 540 },
  { type: "Videos",   views: 5400,  likes: 1900, shares: 410 },
];

const AnalyticsPage = () => {
  const t = useT();
  const { isRTL } = useI18n();

  // Localized months for the chart
  const months = isRTL 
    ? ["أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", "يناير"]
    : ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];

  const localizedMonthlyData = monthlyData.map((d, i) => ({
    ...d,
    month: months[i] || d.month
  }));

  // Localized content types
  const contentTypes: Record<string, string> = {
    Tips: isRTL ? "نصائح" : "Tips",
    Steps: isRTL ? "خطوات" : "Steps",
    Articles: isRTL ? "مقالات" : "Articles",
    Videos: isRTL ? "فيديوهات" : "Videos"
  };

  const localizedEngagementData = engagementByContent.map(d => ({
    ...d,
    type: contentTypes[d.type] || d.type
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("analytics_title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("analytics_subtitle")}</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className={`h-4 w-4 ${isRTL ? "ml-1.5" : "mr-1.5"}`} />
          {t("exportReport")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t("analytics_totalUsers"),      value: "5,247", icon: Users,    bg: "bg-primary/10",  ic: "text-primary" },
          { label: t("analytics_totalContent"),    value: "341",   icon: FileText, bg: "bg-accent/10",   ic: "text-accent" },
          { label: t("analytics_engagementRate"),  value: "85%",   icon: Activity, bg: "bg-success/10",  ic: "text-success" },
        ].map((k) => (
          <Card key={k.label} className="animate-fade-in">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl ${k.bg} flex items-center justify-center`}>
                <k.icon className={`h-6 w-6 ${k.ic}`} />
              </div>
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">{t("analytics_userGrowthTrend")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={localizedMonthlyData}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} reversed={isRTL} />
              <YAxis fontSize={11} orientation={isRTL ? "right" : "left"} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))", 
                  borderRadius: "var(--radius)", 
                  fontSize: 12,
                  textAlign: isRTL ? "right" : "left"
                }} 
              />
              <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="url(#userGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">{t("analytics_contentEngagement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={localizedEngagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="type" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} reversed={isRTL} />
              <YAxis fontSize={11} orientation={isRTL ? "right" : "left"} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))", 
                  borderRadius: "var(--radius)", 
                  fontSize: 12,
                  textAlign: isRTL ? "right" : "left"
                }} 
              />
              <Bar dataKey="views" name={isRTL ? "مشاهدات" : "Views"} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="likes" name={isRTL ? "إعجابات" : "Likes"} fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shares" name={isRTL ? "مشاركات" : "Shares"} fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
