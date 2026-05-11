import React, { useState } from "react";
import { AdminAccount, Permission, RoleCategory } from "./rbac.types";
import { rbacService } from "./rbac.service";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, Check, X, 
  Info, RefreshCw 
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n/i18n.context";

interface Props {
  account: AdminAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function AccountEditor({ account, open, onOpenChange, onSave }: Props) {
  const { t, isRTL } = useI18n();

  if (!account) return null;

  const defaults = rbacService.getCategoryDefaults(account.roleCategory);
  const [overrides, setOverrides] = useState(account.overrides);

  const getOverride = (p: Permission) => overrides.find(o => o.permission === p);

  const toggleOverride = (p: Permission, action: 'grant' | 'deny') => {
    const existing = getOverride(p);
    if (existing?.action === action) {
      // Remove override (reset)
      setOverrides(overrides.filter(o => o.permission !== p));
    } else {
      // Set override
      setOverrides([
        ...overrides.filter(o => o.permission !== p),
        {
          permission: p,
          action: action,
          grantedBy: "current-admin", // Simplified
          timestamp: new Date().toISOString()
        } as any
      ]);
    }
  };

  const handleSave = async () => {
    try {
      await rbacService.saveAccountOverrides(account.id, overrides.map(o => ({
        permission: o.permission,
        action: o.action,
        reason: o.reason
      })));
      toast.success(isRTL ? "تم حفظ التعديلات بنجاح" : "Permissions saved successfully");
      onSave();
      onOpenChange(false);
    } catch (error) {
      toast.error(isRTL ? "فشل حفظ التعديلات" : "Failed to save permissions");
    }
  };

  const resetToDefaults = () => {
    setOverrides([]);
  };

  const PERMISSIONS: { id: Permission; label: string; group: string }[] = [
    { id: 'content.create', label: t("create"), group: t("rbac_group_content") },
    { id: 'content.publish', label: t("cms_statusPublished"), group: t("rbac_group_content") },
    { id: 'content.review', label: t("cms_statusReview"), group: t("rbac_group_content") },
    { id: 'content.approve', label: isRTL ? "اعتماد" : "Approval", group: t("rbac_group_content") },
    { id: 'content.delete', label: t("delete"), group: t("rbac_group_content") },
    { id: 'questions.create', label: t("que_add_question"), group: t("rbac_group_health") },
    { id: 'questions.answer', label: t("questions_sendReply"), group: t("rbac_group_health") },
    { id: 'questionnaires.manage', label: t("que_builder"), group: t("rbac_group_health") },
    { id: 'faqs.manage', label: t("faq_builder"), group: t("rbac_group_health") },
    { id: 'analytics.view', label: t("analytics_title"), group: t("rbac_group_intel") },
    { id: 'health_intelligence.view', label: t("intel_title"), group: t("rbac_group_intel") },
    { id: 'users.manage', label: t("users_title"), group: t("rbac_group_security") },
    { id: 'rbac.manage', label: t("roles_title"), group: t("rbac_group_security") },
    { id: 'system.logs.view', label: t("auditLogs_title"), group: t("rbac_group_security") },
    { id: 'settings.manage', label: t("settings_title"), group: t("rbac_group_security") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl p-0 rounded-[2.5rem] border-none overflow-hidden bg-white shadow-2xl ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader className={`p-8 bg-slate-50/50 border-b border-slate-100 ${isRTL ? "text-right" : ""}`}>
           <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-xl text-slate-400 shadow-sm">
                 {account.name.charAt(0)}
              </div>
              <div>
                 <DialogTitle className="text-xl font-black text-[#0f172a] uppercase tracking-tighter">
                    {t("rbac_edit_title")}: {account.name}
                 </DialogTitle>
                 <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {
                      account.roleCategory === 'DOCTOR' ? t("rbac_cat_doctors") :
                      account.roleCategory === 'MARKETING' ? t("rbac_cat_marketing") :
                      account.roleCategory === 'CONTENT_REVIEWER' ? t("rbac_cat_reviewer") :
                      account.roleCategory === 'IT_SUPPORT' ? t("rbac_cat_it") :
                      account.roleCategory === 'SUPER_ADMIN' ? t("rbac_cat_super") : account.roleCategory
                    } {t("rbac_matrix_defaults")} — {account.email}
                 </DialogDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetToDefaults}
                className={`${isRTL ? "mr-auto" : "ml-auto"} rounded-xl gap-2 h-9 border-slate-200 hover:bg-white hover:text-rose-600 hover:border-rose-100`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t("rbac_edit_reset")}</span>
              </Button>
           </div>
        </DialogHeader>

        <div className="flex h-[500px]">
           {/* Sidebar: Groups */}
           <div className={`w-64 ${isRTL ? "border-l" : "border-r"} border-slate-100 bg-slate-50/20 p-6 space-y-2`}>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">{t("rbac_personnelSubtitle")}</p>
              {Array.from(new Set(PERMISSIONS.map(p => p.group))).map(group => (
                <div key={group} className="px-4 py-2 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-white hover:shadow-sm cursor-pointer transition-all">
                   {group}
                </div>
              ))}
              
              <div className="mt-10 p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                 <div className="flex items-center gap-2 text-amber-700">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase">{t("rbac_eventsDesc")}</span>
                 </div>
                 <p className="text-[10px] font-medium text-amber-600 leading-relaxed">
                    {t("rbac_edit_note")}
                 </p>
              </div>
           </div>

           {/* Main Column: Matrix */}
           <ScrollArea className="flex-1 p-8">
              <div className="space-y-2 mb-6 grid grid-cols-3 gap-8 px-4">
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("rbac_edit_point")}</span>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">{t("rbac_edit_inherited")}</span>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">{t("rbac_edit_modifier")}</span>
              </div>

              <div className="space-y-3">
                 {PERMISSIONS.map((p) => {
                    const isInherited = defaults.includes(p.id);
                    const override = getOverride(p.id);
                    
                    return (
                       <div key={p.id} className="grid grid-cols-3 items-center p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 transition-colors shadow-sm">
                          <div>
                             <p className="text-xs font-bold text-slate-700">{p.label}</p>
                             <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{p.id}</p>
                          </div>
                          
                          <div className="flex justify-center">
                             {isInherited ? (
                                <Badge variant="outline" className="h-6 gap-1 bg-emerald-50 text-emerald-600 border-emerald-100">
                                   <Check className="h-3 w-3" /> <span className="text-[9px] font-black uppercase">{t("yes")}</span>
                                </Badge>
                             ) : (
                                <Badge variant="outline" className="h-6 gap-1 bg-slate-50 text-slate-400 border-slate-200">
                                   <X className="h-3 w-3" /> <span className="text-[9px] font-black uppercase">{t("no")}</span>
                                </Badge>
                             )}
                          </div>

                          <div className="flex justify-center gap-2">
                             <Button 
                                variant={override?.action === 'grant' ? "default" : "outline"}
                                size="sm" 
                                onClick={() => toggleOverride(p.id, 'grant')}
                                className={`h-8 w-16 text-[9px] font-black uppercase rounded-lg ${
                                   override?.action === 'grant' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-200'
                                }`}
                             >
                                {t("rbac_edit_grant")}
                             </Button>
                             <Button 
                                variant={override?.action === 'deny' ? "destructive" : "outline"}
                                size="sm" 
                                onClick={() => toggleOverride(p.id, 'deny')}
                                className={`h-8 w-16 text-[9px] font-black uppercase rounded-lg ${
                                   override?.action === 'deny' ? 'bg-rose-500 hover:bg-rose-600' : 'border-slate-200 text-rose-400'
                                }`}
                             >
                                {t("rbac_edit_deny")}
                             </Button>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </ScrollArea>
        </div>

        <DialogFooter className={`p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between ${isRTL ? "sm:flex-row-reverse" : ""}`}>
           <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <span className="text-[10px] font-bold">Encrypted Permission Hash: ATS-992-PX</span>
           </div>
           <div className="flex gap-4">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold text-xs uppercase text-slate-400">{t("cancel")}</Button>
              <Button onClick={handleSave} className="rounded-xl font-black text-xs uppercase px-8 bg-slate-900 hover:bg-black text-white">{t("rbac_edit_save")}</Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
