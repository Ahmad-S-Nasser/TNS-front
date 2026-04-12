import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Globe, Check } from "lucide-react";
import { useI18n, useT } from "@/i18n/i18n.context";
import type { Lang } from "@/i18n/translations";

const LANGUAGES: { code: Lang; label_en: string; label_native: string; dir: string; flag: string }[] = [
  { code: "en", label_en: "English",    label_native: "English", dir: "ltr", flag: "🇺🇸" },
  { code: "ar", label_en: "Arabic",     label_native: "العربية", dir: "rtl", flag: "🇸🇦" },
];

const SettingsPage = () => {
  const t = useT();
  const { lang, setLang, isRTL } = useI18n();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings_title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("settings_subtitle")}</p>
      </div>

      {/* Language Settings — featured prominently */}
      <Card className="animate-fade-in border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            {t("settings_language")}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{t("settings_languageDesc")}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  lang === l.code
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                }`}
              >
                <span className="text-2xl">{l.flag}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{l.label_native}</p>
                  <p className="text-xs text-muted-foreground">{l.label_en} · {l.dir.toUpperCase()}</p>
                </div>
                {lang === l.code && (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">App Name</Label>
            <Input defaultValue="Tips & Steps" className="h-9" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Support Email</Label>
            <Input defaultValue="support@tipsandsteps.com" className="h-9" />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Session Timeout</p>
              <p className="text-xs text-muted-foreground">Auto-logout after inactivity (30 min)</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Audit Logging</p>
              <p className="text-xs text-muted-foreground">Log all admin actions</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          {t("save")}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
