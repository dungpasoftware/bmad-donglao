"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/lib/i18n";
import { searchGlossary, type GlossaryTerm } from "@/lib/glossary";

export type GlossaryDrawerProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  initialTermId?: string;
};

export function GlossaryDrawer({ open, onOpenChange, returnFocusRef, initialTermId }: GlossaryDrawerProps) {
  const { locale } = useLocale();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const results = useMemo<GlossaryTerm[]>(() => searchGlossary(query), [query]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // focus search on open; if initialTermId provided, set active
    if (initialTermId) setActiveId(initialTermId);
    searchInputRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        (returnFocusRef?.current ?? previouslyFocused)?.focus?.();
      }

      if (results.length > 0) {
        const currentIndex = results.findIndex((t) => t.id === activeId);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const nextIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, results.length - 1);
          setActiveId(results[nextIndex].id);
          listRef.current?.querySelector<HTMLElement>(`li[data-id="${results[nextIndex].id}"] button`)?.focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prevIndex = currentIndex < 0 ? 0 : Math.max(currentIndex - 1, 0);
          setActiveId(results[prevIndex].id);
          listRef.current?.querySelector<HTMLElement>(`li[data-id="${results[prevIndex].id}"] button`)?.focus();
        }
      }
    }

    function onFocusIn(e: FocusEvent) {
      const root = rootRef.current;
      if (!root) return;
      if (root.contains(e.target as Node)) return;
      // keep focus trapped
      closeButtonRef.current?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open, onOpenChange, returnFocusRef, results, activeId, initialTermId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40" aria-hidden={!open}>
      <div className="absolute inset-0 bg-black/30" />
      <aside
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-title"
        className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl p-4 flex flex-col"
      >
        <header className="mb-2 flex items-center justify-between gap-2">
          <h2 id="glossary-title" className="text-sm font-medium">
            {t("glossaryTitle", locale)}
          </h2>
          <div className="flex items-center gap-2">
            <input
              ref={searchInputRef}
              type="search"
              placeholder={t("glossarySearchPlaceholder", locale)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 rounded border px-2 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded px-2 py-1 border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("close", locale)}
            </button>
          </div>
        </header>

        <ul ref={listRef} className="flex-1 overflow-auto divide-y" aria-label={t("glossaryTitle", locale)}>
          {results.length === 0 && (
            <li className="p-3 text-sm text-muted-foreground">{t("noResults", locale)}</li>
          )}
          {results.map((term) => (
            <li key={term.id} data-id={term.id} className="p-2">
              <button
                type="button"
                aria-current={activeId === term.id}
                onClick={() => setActiveId(term.id)}
                className="w-full rounded border px-3 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{term.id}</span>
                  {term.aliases && term.aliases.length > 0 && (
                    <span className="text-xs text-muted-foreground">{term.aliases.join(", ")}</span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>

        <footer className="mt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded px-3 py-2 border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("done", locale)}
          </button>
        </footer>
      </aside>
    </div>
  );
}


