"use client";

import { useEffect, useState, useCallback } from "react";
import { type Locale, isValidLocale } from "@/lib/i18n";

export function LanguageToggle() {
  const [locale, setLocale] = useState<Locale>("vi");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("locale");
    if (isValidLocale(stored)) {
      setLocale(stored);
      document.documentElement.lang = stored;
    } else {
      setLocale("vi");
      document.documentElement.lang = "vi";
    }
  }, []);

  const handleChange = useCallback(
    (next: Locale) => {
      setLocale(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("locale", next);
      }
      document.documentElement.lang = next;
    },
    []
  );

  const isEn = locale === "en";

  return (
    <div className="inline-flex items-center gap-2" aria-label="Language toggle">
      <span className="text-sm text-muted-foreground">vi</span>
      <button
        type="button"
        role="switch"
        aria-checked={isEn}
        aria-label="Toggle language"
        onClick={() => handleChange(isEn ? "vi" : "en")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleChange(isEn ? "vi" : "en");
          }
        }}
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


