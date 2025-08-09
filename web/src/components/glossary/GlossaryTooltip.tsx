"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/lib/i18n";
import { getDefinition } from "@/lib/glossary";

export type GlossaryTooltipProps = {
  termId: string;
  children: React.ReactNode;
  onViewDetails?: (termId: string) => void;
};

export function GlossaryTooltip({ termId, children, onViewDetails }: GlossaryTooltipProps) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (tooltipRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const def = getDefinition(termId, locale);

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="underline underline-offset-4 decoration-dotted cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </span>

      {open && (
        <div
          ref={tooltipRef}
          role="dialog"
          aria-modal="false"
          className="absolute z-50 mt-2 w-64 rounded border bg-background p-3 shadow-lg"
          style={{ left: 0 }}
        >
          <p className="text-sm">{def}</p>
          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => {
                if (onViewDetails) onViewDetails(termId);
                else document.dispatchEvent(new CustomEvent("open-glossary", { detail: { termId } }));
              }}
              className="text-xs underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("viewDetails", locale)}
            </button>
          </div>
        </div>
      )}
    </span>
  );
}


