import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Shield, Users, FileText, Settings } from "lucide-react";
import { useState } from "react";

const logs = [
  { id: 1, action: "User suspended", actor: "Admin Team", target: "Fatima Al-Hassan", type: "user", time: "2025-01-12 14:30" },
  { id: 2, action: "Article published", actor: "Dr. Khalid", target: "10 Tips for Better Sleep", type: "content", time: "2025-01-12 12:15" },
  { id: 3, action: "Role updated", actor: "Super Admin", target: "Dr. Hana → Doctor", type: "role", time: "2025-01-11 18:45" },
  { id: 4, action: "Settings changed", actor: "Super Admin", target: "Enable 2FA requirement", type: "system", time: "2025-01-11 16:20" },
  { id: 5, action: "User activated", actor: "Manager", target: "Omar bin Said", type: "user", time: "2025-01-11 10:00" },
  { id: 6, action: "Content deleted", actor: "Marketing", target: "Old Nutrition Guide", type: "content", time: "2025-01-10 09:30" },
  { id: 7, action: "Password reset", actor: "IT Support", target: "Sara Ahmed", type: "user", time: "2025-01-10 08:15" },
  { id: 8, action: "New admin added", actor: "Super Admin", target: "Ahmad Nasser (Manager)", type: "role", time: "2025-01-09 17:00" },
];

const typeIcons: Record<string, React.ReactNode> = {
  user: <Users className="h-3.5 w-3.5 text-primary" />,
  content: <FileText className="h-3.5 w-3.5 text-accent" />,
  role: <Shield className="h-3.5 w-3.5 text-info" />,
  system: <Settings className="h-3.5 w-3.5 text-muted-foreground" />,
};

const AuditLogs = () => {
  const [search, setSearch] = useState("");
  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Track all admin actions and system changes.</p>
      </div>

      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search logs..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {filtered.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {typeIcons[log.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{log.actor}</span>
                    <span className="text-muted-foreground"> {log.action}: </span>
                    <span className="font-medium">{log.target}</span>
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">{log.type}</Badge>
                <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:block">{log.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
