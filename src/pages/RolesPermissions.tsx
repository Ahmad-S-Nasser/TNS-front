import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, X } from "lucide-react";

const roles = [
  {
    name: "Super Admin",
    description: "Full system access with all permissions",
    color: "bg-destructive/10 text-destructive",
    permissions: { dashboard: true, users: true, content: true, analytics: true, audit: true, roles: true, settings: true },
  },
  {
    name: "Manager",
    description: "View analytics, manage doctors & marketing users",
    color: "bg-primary/10 text-primary",
    permissions: { dashboard: true, users: true, content: false, analytics: true, audit: true, roles: false, settings: false },
  },
  {
    name: "Doctor",
    description: "View assigned users, add notes & recommendations",
    color: "bg-success/10 text-success",
    permissions: { dashboard: true, users: "limited", content: false, analytics: false, audit: false, roles: false, settings: false },
  },
  {
    name: "IT / Tech Support",
    description: "User troubleshooting, error logs, system health",
    color: "bg-info/10 text-info",
    permissions: { dashboard: true, users: "limited", content: false, analytics: false, audit: true, roles: false, settings: false },
  },
  {
    name: "Marketing / Content",
    description: "Create & manage content, view content analytics",
    color: "bg-accent/10 text-accent",
    permissions: { dashboard: true, users: false, content: true, analytics: "limited", audit: false, roles: false, settings: false },
  },
];

const permKeys = ["dashboard", "users", "content", "analytics", "audit", "roles", "settings"] as const;
const permLabels: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  content: "Content",
  analytics: "Analytics",
  audit: "Audit Logs",
  roles: "Roles",
  settings: "Settings",
};

const RolesPermissions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure role-based access control for admin users.</p>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.name} className="animate-fade-in">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${role.color}`}>
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{role.name}</p>
                    <p className="text-[11px] text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:ml-auto">
                  {permKeys.map((key) => {
                    const val = role.permissions[key];
                    return (
                      <Badge
                        key={key}
                        variant="outline"
                        className={`text-[10px] gap-1 ${
                          val === true ? "border-success/30 text-success" :
                          val === "limited" ? "border-warning/30 text-warning" :
                          "border-muted text-muted-foreground"
                        }`}
                      >
                        {val === true ? <Check className="h-2.5 w-2.5" /> :
                         val === "limited" ? <span className="text-[8px]">◐</span> :
                         <X className="h-2.5 w-2.5" />}
                        {permLabels[key]}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RolesPermissions;
