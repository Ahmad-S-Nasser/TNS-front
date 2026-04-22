import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/i18n.context";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { RoleCategory } from "./rbac.types";
import { rbacService } from "./rbac.service";

interface AddAdminUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddAdminUserDialog({ open, onOpenChange, onSuccess }: AddAdminUserDialogProps) {
  const { t, isRTL } = useI18n();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleCategory: "MARKETING" as RoleCategory,
    status: "active" as any,
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call using rbacService
    setTimeout(() => {
      rbacService.createAdminAccount({
        name: formData.name,
        email: formData.email,
        roleCategory: formData.roleCategory,
        status: formData.status,
      });

      setLoading(false);
      onOpenChange(false);
      toast({
        title: isRTL ? "تم بنجاح" : "Success",
        description: isRTL ? "تم إنشاء حساب المسؤول بنجاح." : "Admin account has been created successfully.",
      });
      if (onSuccess) onSuccess();
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        roleCategory: "MARKETING",
        status: "active",
        password: "",
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[425px] overflow-hidden border-none shadow-2xl rounded-[2rem] ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader className="p-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-black text-[#0f172a] uppercase tracking-tighter">
            {t("rbac_addAdmin")}
          </DialogTitle>
          <DialogDescription className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
            {t("rbac_addAdminSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="admin-name" className="text-[11px] font-black uppercase text-slate-500 tracking-widest px-1">
              {t("users_form_fullName")}
            </Label>
            <Input
              id="admin-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={isRTL ? "الاسم الكامل للمسؤول" : "Full admin name"}
              className="h-12 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-slate-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-[11px] font-black uppercase text-slate-500 tracking-widest px-1">
              {t("users_form_email")}
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@domain.com"
              className="h-12 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-role" className="text-[11px] font-black uppercase text-slate-500 tracking-widest px-1">
                {t("users_form_role")}
              </Label>
              <Select 
                value={formData.roleCategory} 
                onValueChange={(val: RoleCategory) => setFormData({ ...formData, roleCategory: val })}
              >
                <SelectTrigger id="admin-role" className="h-12 bg-slate-50 border-slate-100 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="DOCTOR">{t("rbac_cat_doctors")}</SelectItem>
                  <SelectItem value="MARKETING">{t("rbac_cat_marketing")}</SelectItem>
                  <SelectItem value="CONTENT_REVIEWER">{t("rbac_cat_reviewer")}</SelectItem>
                  <SelectItem value="IT_SUPPORT">{t("rbac_cat_it")}</SelectItem>
                  <SelectItem value="SUPER_ADMIN">{t("rbac_cat_super")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-status" className="text-[11px] font-black uppercase text-slate-500 tracking-widest px-1">
                {t("users_form_status")}
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(val: any) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger id="admin-status" className="h-12 bg-slate-50 border-slate-100 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="active">{t("users_active")}</SelectItem>
                  <SelectItem value="suspended">{t("users_suspended")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-pass" className="text-[11px] font-black uppercase text-slate-500 tracking-widest px-1">
              {t("users_form_password")}
            </Label>
            <Input
              id="admin-pass"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="h-12 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-slate-200"
              required
            />
          </div>

          <DialogFooter className="pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-12 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-900 rounded-xl"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 px-8 bg-slate-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl shadow-slate-200 gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("users_form_submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
