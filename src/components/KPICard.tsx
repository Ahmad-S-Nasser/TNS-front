import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  iconColor?: string;
}

export function KPICard({ title, value, change, trend, icon: Icon, iconColor }: KPICardProps) {
  return (
    <Card className="animate-fade-in hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={`text-xs font-medium ${trend === "up" ? "text-success" : "text-destructive"}`}>
                {change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconColor || "bg-primary/10"}`}>
            <Icon className={`h-5 w-5 ${iconColor ? "text-primary-foreground" : "text-primary"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
