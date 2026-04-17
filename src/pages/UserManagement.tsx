import { useState } from "react";
import { Search, Filter, MoreHorizontal, UserPlus, Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useT, useI18n } from "@/i18n/i18n.context";
import { AddUserDialog } from "@/components/users/AddUserDialog";

const mockUsers = [
  { id: 1, name: "Sara Ahmed",        email: "sara@example.com",    role: "User",   status: "active",    joined: "2024-12-01", lastActive: "2 hrs ago"  },
  { id: 2, name: "Dr. Khalid Mansour",email: "khalid@example.com",  role: "Doctor", status: "active",    joined: "2024-11-15", lastActive: "5 min ago"  },
  { id: 3, name: "Fatima Al-Hassan",  email: "fatima@example.com",  role: "User",   status: "suspended", joined: "2024-10-20", lastActive: "3 days ago" },
  { id: 4, name: "Omar bin Said",     email: "omar@example.com",    role: "User",   status: "active",    joined: "2024-09-10", lastActive: "1 hr ago"   },
  { id: 5, name: "Layla Khoury",      email: "layla@example.com",   role: "User",   status: "active",    joined: "2025-01-05", lastActive: "30 min ago" },
  { id: 6, name: "Ahmad Nasser",      email: "ahmad@example.com",   role: "User",   status: "active",    joined: "2025-01-12", lastActive: "Just now"   },
  { id: 7, name: "Nour Abdallah",     email: "nour@example.com",    role: "User",   status: "suspended", joined: "2024-08-22", lastActive: "1 week ago" },
  { id: 8, name: "Dr. Hana Saleh",   email: "hana@example.com",    role: "Doctor", status: "active",    joined: "2024-07-30", lastActive: "10 min ago" },
];

const UserManagement = () => {
  const t = useT();
  const { isRTL } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const localizedUsers = filtered.map(user => ({
    ...user,
    role: user.role === "Doctor" ? (isRTL ? "طبيب" : "Doctor") : (isRTL ? "مستخدم" : "User"),
    lastActive: isRTL ? user.lastActive
      .replace("hrs ago", "ساعة مضت")
      .replace("min ago", "دقيقة مضت")
      .replace("days ago", "أيام مضت")
      .replace("hr ago", "ساعة مضت")
      .replace("Just now", "الآن")
      .replace("week ago", "أسبوع مضى")
      : user.lastActive
  }));

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">{t("users_title")}</h1>
          <p className="text-sm text-[#64748b] mt-1 font-medium">{t("users_subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-[#64748b] border-[#e2e8f0]">
            <Download className="h-4 w-4" />
            {t("export")}
          </Button>
          <Button 
            size="sm" 
            className="h-9 gap-2 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold"
            onClick={() => setShowAddDialog(true)}
          >
            <UserPlus className="h-4 w-4" />
            {t("users_addUser")}
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm shadow-slate-200/50 bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]`} />
              <Input
                placeholder={t("users_searchPlaceholder")}
                className={`${isRTL ? "pr-10" : "pl-10"} h-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#0d9488]/20`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-10 bg-slate-50 border-none">
                <div className="flex items-center gap-2">
                   <Filter className="h-3.5 w-3.5 text-[#94a3b8]" />
                   <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("users_allStatuses")}</SelectItem>
                <SelectItem value="active">{t("users_active")}</SelectItem>
                <SelectItem value="suspended">{t("users_suspended")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className={`px-6 text-[#64748b] font-bold text-[13px] ${isRTL ? "text-right" : "text-left"}`}>{t("name")}</TableHead>
                <TableHead className={`text-[#64748b] font-bold text-[13px] ${isRTL ? "text-right" : "text-left"}`}>{t("email")}</TableHead>
                <TableHead className={`text-[#64748b] font-bold text-[13px] ${isRTL ? "text-right" : "text-left"}`}>{t("role")}</TableHead>
                <TableHead className={`text-[#64748b] font-bold text-[13px] ${isRTL ? "text-right" : "text-left"}`}>{t("status")}</TableHead>
                <TableHead className={`text-[#64748b] font-bold text-[13px] ${isRTL ? "text-right" : "text-left"}`}>{t("users_joinDate")}</TableHead>
                <TableHead className={`text-[#64748b] font-bold text-[13px] ${isRTL ? "text-right" : "text-left"}`}>{t("users_lastActive")}</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {localizedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                  <TableCell className={`px-6 py-4 font-bold text-[#0f172a] text-[14px] ${isRTL ? "text-right" : "text-left"}`}>{user.name}</TableCell>
                  <TableCell className={`text-sm text-[#64748b] font-medium ${isRTL ? "text-right" : "text-left"}`}>{user.email}</TableCell>
                  <TableCell className={isRTL ? "text-right" : "text-left"}>
                    <Badge variant={user.role.includes("طبيب") || user.role === "Doctor" ? "default" : "secondary"} className="text-[10px] font-bold px-2 py-0.5 rounded-md border-none">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className={isRTL ? "text-right" : "text-left"}>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border-none ${
                        user.status === "active"
                          ? "text-emerald-700 bg-emerald-50"
                          : "text-rose-700 bg-rose-50"
                      }`}
                    >
                      {user.status === "active" ? t("users_active") : t("users_suspended")}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-sm text-[#94a3b8] font-medium ${isRTL ? "text-right" : "text-left"}`}>{user.joined}</TableCell>
                  <TableCell className={`text-sm text-[#94a3b8] font-medium ${isRTL ? "text-right" : "text-left"}`}>{user.lastActive}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#94a3b8] hover:text-[#0f172a] hover:bg-slate-100 rounded-lg">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddUserDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
};

export default UserManagement;
