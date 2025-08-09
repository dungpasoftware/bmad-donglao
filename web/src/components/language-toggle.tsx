"use client";

import { useCallback } from "react";
import { useLocale } from "@/components/providers/locale-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const handleChange = useCallback(() => {
    setLocale(locale === "en" ? "vi" : "en");
  }, [locale, setLocale]);

  const isEn = locale === "en";

  return (
    <div className="inline-flex items-center gap-2" aria-label="Language toggle">
      <span className="text-sm text-muted-foreground">vi</span>
      <button
        type="button"
        aria-pressed={isEn}
        aria-label="Toggle language"
        onClick={handleChange}
        className="relative h-6 w-12 rounded-full bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span
          className={
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform " +
            (isEn ? "translate-x-6" : "translate-x-0")
          }
        />
      </button>
      <span className="text-sm text-muted-foreground">en</span>
    </div>
  );
}


