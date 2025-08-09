"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/lib/i18n";
import { agents } from "@/lib/agents";

type CommandTarget = {
  id: string;
  title: string;
  type: "agent" | "command" | "template";
};

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export function CommandPalette({ open, onOpenChange, returnFocusRef }: CommandPaletteProps) {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const data: CommandTarget[] = useMemo(() => {
    const items: CommandTarget[] = [];
    for (const a of agents) {
      items.push({ id: `agent:${a.id}`, title: t(a.nameKey, locale), type: "agent" });
      for (const c of a.commands) {
        items.push({ id: `cmd:${c.id}`, title: t(c.titleKey, locale), type: "command" });
      }
    }
    // templates (stub)
    items.push({ id: "tmpl:story", title: t("tmplStory", locale), type: "template" });
    return items.filter((it) =>
      it.title.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [locale, query]);

  useEffect(() => {
    if (!open) return;
    // focus the input when opened
    inputRef.current?.focus();
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        (returnFocusRef?.current ?? previouslyFocused)?.focus?.();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((idx) => Math.min(idx + 1, Math.max(data.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((idx) => Math.max(idx - 1, 0));
      } else if (e.key === "Enter") {
        if (data.length > 0) {
          e.preventDefault();
          // stub: alert selected id
          alert(data[Math.max(0, Math.min(activeIndex, data.length - 1))].id);
          onOpenChange(false);
          (returnFocusRef?.current ?? previouslyFocused)?.focus?.();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange, activeIndex, data, returnFocusRef]);

  useEffect(() => {
    if (!open) return;
    // rudimentary focus trap inside dialog
    function handleFocus(e: FocusEvent) {
      const root = dialogRef.current;
      if (!root) return;
      if (root.contains(e.target as Node)) return;
      // redirect focus back into dialog
      inputRef.current?.focus();
    }
    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cmdp-title"
      className="fixed inset-0 z-50 flex items-start justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative w-full max-w-lg rounded-md border bg-background shadow-lg">
        <header className="p-3 border-b">
          <h2 id="cmdp-title" className="text-sm font-medium">
            {t("paletteTitle", locale)}
          </h2>
        </header>
        <div className="p-3">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            className="w-full rounded border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder={t("searchPlaceholder", locale)}
          />
        </div>
        <ul className="max-h-64 overflow-auto p-2">
          {data.map((it, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li key={it.id} className="p-1">
                <button
                  type="button"
                  className={
                    "w-full text-left px-3 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                    (isActive ? "bg-muted" : "")
                  }
                  aria-current={isActive ? "true" : undefined}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => {
                    alert(it.id);
                    onOpenChange(false);
                  }}
                >
                  <span className="text-sm">{it.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {it.type === "agent" ? t("typeAgent", locale) : it.type === "command" ? t("typeCommand", locale) : t("typeTemplate", locale)}
                  </span>
                </button>
              </li>
            );
          })}
          {data.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">{t("noResults", locale)}</li>
          )}
        </ul>
      </div>
    </div>
  );
}


