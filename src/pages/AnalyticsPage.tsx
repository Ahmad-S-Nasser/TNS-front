import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, FileText, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const monthlyData = [
  { month: "Aug", users: 2100, content: 45, engagement: 67 },
  { month: "Sep", users: 2800, content: 52, engagement: 72 },
  { month: "Oct", users: 3200, content: 61, engagement: 78 },
  { month: "Nov", users: 3900, content: 70, engagement: 74 },
  { month: "Dec", users: 4300, content: 78, engagement: 82 },
  { month: "Jan", users: 5200, content: 89, engagement: 85 },
];

const engagementByContent = [
  { type: "Tips", views: 12400, likes: 3200, shares: 890 },
  { type: "Steps", views: 9800, likes: 2800, shares: 720 },
  { type: "Articles", views: 7600, likes: 2100, shares: 540 },
  { type: "Videos", views: 5400, likes: 1900, shares: 410 },
];

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Track growth, engagement, and content performance.</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1.5" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="animate-fade-in">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">5,247</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">341</p>
              <p className="text-xs text-muted-foreground">Total Content</p>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Activity className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">85%</p>
              <p className="text-xs text-muted-foreground">Engagement Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">User Growth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="url(#userGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Content Engagement Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={engagementByContent}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="type" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }} />
              <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="likes" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shares" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
