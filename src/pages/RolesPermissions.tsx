import React, { useState, useEffect } from "react";
import { RoleCategory, AdminAccount, Permission } from "@/rbac/rbac.types";
import { rbacService } from "@/rbac/rbac.service";
import { RoleCategories } from "@/rbac/RoleCategories";
import { PermissionsMatrix } from "@/rbac/PermissionsMatrix";
import { AccountsTable } from "@/rbac/AccountsTable";
import { AccountEditor } from "@/rbac/AccountEditor";
import { AddAdminUserDialog } from "../rbac/AddAdminUserDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, History, Settings2, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/i18n/i18n.context";

const RolesPermissions = () => {
  const [activeCategory, setActiveCategory] = useState<RoleCategory>("DOCTOR");
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [defaults, setDefaults] = useState<Permission[]>([]);
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [search, setSearch] = useState("");

  const { t, isRTL } = useI18n();

  useEffect(() => {
    loadData();
  }, [activeCategory]);

  const loadData = () => {
    setAccounts(rbacService.getAccountsByCategory(activeCategory));
    setDefaults(rbacService.getCategoryDefaults(activeCategory));
  };

  const handleToggleDefault = (permission: Permission) => {
    // In a real app, this would be a full service call
    const current = rbacService.getCategoryDefaults(activeCategory);
    if (current.includes(permission)) {
       // logic to remove from defaults (omitted for mock brevity)
    } else {
       // logic to add
    }
    toast.success(`Updated global policy for ${activeCategory}`);
    loadData();
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(search.toLowerCase()) || 
    acc.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`space-y-10 pb-20 ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <Shield className="h-5 w-5 text-[#0d9488]" />
                 <span className="text-[10px] font-black uppercase text-[#0d9488] tracking-[0.2em]">{t("rbac_securityFramework")}</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-[#0f172a] uppercase">{t("rbac_title")}</h1>
              <p className="text-sm font-bold text-slate-400 mt-1 max-w-2xl">
                 {t("rbac_subtitle")}
              </p>
           </div>
           <Button 
             onClick={() => setShowAddDialog(true)}
             className="bg-[#0d9488] hover:bg-[#0f766e] text-white font-black uppercase text-[10px] tracking-widest px-6 py-6 rounded-2xl shadow-lg shadow-teal-500/20 gap-2 h-auto"
           >
              <UserPlus className="h-4 w-4" />
              {t("rbac_addAdmin")}
           </Button>
        </div>

      {/* Category Navigation */}
      <div className="space-y-4">
         <h2 className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">{t("rbac_categories")}</h2>
         <RoleCategories activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
         {/* Left: Global Policy */}
         <div className="lg:col-span-5">
            <PermissionsMatrix 
              category={activeCategory} 
              defaults={defaults} 
              onToggle={handleToggleDefault} 
            />
         </div>

         {/* Right: Accounts & Overrides */}
         <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-2">
               <div>
                  <h3 className="text-lg font-black text-[#0f172a] uppercase tracking-tighter">{t("rbac_personnel")}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("rbac_personnelSubtitle")}</p>
               </div>
               <div className="relative w-64">
                  <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300`} />
                  <Input 
                    placeholder={t("rbac_searchPlaceholder")} 
                    className={`h-10 ${isRTL ? "pr-9" : "pl-9"} rounded-xl border-slate-100 bg-white`} 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>

            <AccountsTable 
              accounts={filteredAccounts} 
              onEdit={setEditingAccount} 
            />

            <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] shadow-xl">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                     <History className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-[11px] font-black uppercase text-white tracking-widest">{t("rbac_recentEvents")}</p>
                     <p className="text-[10px] font-medium text-slate-400 mt-0.5">3 {t("rbac_eventsDesc")}</p>
                  </div>
               </div>
               <Badge className="bg-[#0d9488] text-white hover:bg-[#0d9488]/80 text-[10px] font-black uppercase tracking-widest px-4 cursor-pointer">
                  {t("rbac_viewAudit")}
               </Badge>
            </div>
         </div>
      </div>

      <AccountEditor 
        account={editingAccount} 
        open={!!editingAccount} 
        onOpenChange={(open) => !open && setEditingAccount(null)}
        onSave={() => loadData()}
      />

      <AddAdminUserDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onSuccess={() => loadData()}
      />
    </div>
  );
};

export default RolesPermissions;
