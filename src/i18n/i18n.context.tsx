import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, type Lang, type TranslationKey } from "./translations";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "tips_steps_lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored === "ar" || stored === "en") ? stored : "en";
    } catch {
      return "en";
    }
  });

  const isRTL = lang === "ar";

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try { localStorage.setItem(STORAGE_KEY, newLang); } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "ar" : "en");
  }, [lang, setLang]);

  // Apply RTL direction and font family to the document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", isRTL ? "rtl" : "ltr");
    root.setAttribute("lang", lang);
    root.style.fontFamily = isRTL
      ? "'Cairo', 'Tajawal', sans-serif"
      : "'Inter', sans-serif";

    // inject Arabic Google Font if needed
    if (isRTL) {
      const existing = document.getElementById("arabic-font");
      if (!existing) {
        const link = document.createElement("link");
        link.id = "arabic-font";
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700&display=swap";
        document.head.appendChild(link);
      }
    }
  }, [isRTL, lang]);

  const t = useCallback((key: TranslationKey): string => {
    return translations[key]?.[lang] ?? translations[key]?.en ?? key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

// Shorthand hook for components that only need t()
export function useT() {
  return useI18n().t;
}
