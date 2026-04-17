import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useT, useI18n } from "@/i18n/i18n.context";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Loader2 } from "lucide-react";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddUserDialog({ open, onOpenChange, onSuccess }: AddUserDialogProps) {
  const t = useT();
  const { isRTL } = useI18n();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      toast({
        title: isRTL ? "تم بنجاح" : "Success",
        description: isRTL ? "تم إنشاء المستخدم الجديد بنجاح." : "New user has been created successfully.",
      });
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[425px] overflow-hidden border-none shadow-2xl ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-2">
            <UserPlus className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-[#0f172a]">
            {t("users_form_addUser")}
          </DialogTitle>
          <p className="text-sm text-[#64748b] font-medium leading-relaxed">
            {isRTL ? "أضف مستخدماً جديداً إلى النظام وخصص له دوراً محدداً." : "Add a new user to the system and assign them a specific role."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="name" className={`text-[13px] font-bold text-[#334155] ${isRTL ? "text-right block w-full" : ""}`}>
              {t("users_form_fullName")}
            </Label>
            <Input
              id="name"
              placeholder={isRTL ? "مثل: أحمد محمد" : "e.g. John Doe"}
              className={`h-11 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-teal-500/30 ${isRTL ? "text-right" : ""}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={`text-[13px] font-bold text-[#334155] ${isRTL ? "text-right block w-full" : ""}`}>
              {t("users_form_email")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              className={`h-11 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-teal-500/30 ${isRTL ? "text-right" : ""}`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className={`text-[13px] font-bold text-[#334155] ${isRTL ? "text-right block w-full" : ""}`}>
                {t("users_form_role")}
              </Label>
              <Select defaultValue="User">
                <SelectTrigger className={`h-11 bg-slate-50 border-none ${isRTL ? "flex-row-reverse" : ""}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">{t("users_user")}</SelectItem>
                  <SelectItem value="Doctor">{t("users_doctor")}</SelectItem>
                  <SelectItem value="Marketing">{t("users_marketing")}</SelectItem>
                  <SelectItem value="IT">{t("users_it")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className={`text-[13px] font-bold text-[#334155] ${isRTL ? "text-right block w-full" : ""}`}>
                {t("users_form_status")}
              </Label>
              <Select defaultValue="active">
                <SelectTrigger className={`h-11 bg-slate-50 border-none ${isRTL ? "flex-row-reverse" : ""}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("users_active")}</SelectItem>
                  <SelectItem value="suspended">{t("users_suspended")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pass" className={`text-[13px] font-bold text-[#334155] ${isRTL ? "text-right block w-full" : ""}`}>
              {t("users_form_password")}
            </Label>
            <Input
              id="pass"
              type="password"
              placeholder="••••••••"
              className={`h-11 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-teal-500/30 ${isRTL ? "text-right" : ""}`}
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-11 font-bold text-[#64748b] hover:text-[#0f172a]"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 px-8 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 gap-2"
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
