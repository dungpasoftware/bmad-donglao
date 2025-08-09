export const supportedLocales = ["vi", "en"] as const;
export type Locale = typeof supportedLocales[number];

export function isValidLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (supportedLocales as readonly string[]).includes(value)
  );
}

export const i18nStrings: Record<Locale, Record<string, string>> = {
  vi: {
    appTitle: "Bmad Donglao",
    appDescription: "Shadcn/ui + Tailwind v4 smoke test",
    primary: "Chính",
    secondary: "Phụ",
    language: "Ngôn ngữ",
    vi: "Tiếng Việt",
    en: "English",
  },
  en: {
    appTitle: "Bmad Donglao",
    appDescription: "Shadcn/ui + Tailwind v4 smoke test",
    primary: "Primary",
    secondary: "Secondary",
    language: "Language",
    vi: "Vietnamese",
    en: "English",
  },
};

export type I18nKey = keyof typeof i18nStrings["vi"];

export function t(key: I18nKey, locale: Locale): string {
  return i18nStrings[locale][key];
}


