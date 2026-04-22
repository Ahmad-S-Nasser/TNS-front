import { Bell, Search, User, Languages } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationCenter } from "./NotificationCenter";
import { useI18n } from "@/i18n/i18n.context";

export function AdminHeader() {
  const { t, toggleLang, lang, isRTL } = useI18n();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="flex-1 flex items-center gap-3">
        <div className={`relative max-w-sm hidden md:block`}>
          <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
          <Input
            placeholder={t("header_search")}
            className={`${isRTL ? "pr-9" : "pl-9"} h-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLang}
          className="h-8 gap-1.5 px-3 text-xs font-bold border-dashed hover:border-solid transition-all"
          title={lang === "en" ? "Switch to Arabic" : "التبديل للإنجليزية"}
        >
          <Languages className="h-3.5 w-3.5" />
          {t("language_toggle")}
        </Button>

        {/* Notifications */}
        <NotificationCenter />

        {/* User */}
        <div className={`flex items-center gap-2 pl-2 ${isRTL ? "border-r pr-2" : "border-l pl-2"}`}>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold leading-none">{t("header_superAdmin")}</p>
            <p className="text-[10px] text-muted-foreground">admin@tipsandsteps.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
