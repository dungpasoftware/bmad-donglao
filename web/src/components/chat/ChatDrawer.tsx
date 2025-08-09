"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/lib/i18n";

export type ChatDrawerProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export function ChatDrawer({ open, onOpenChange, returnFocusRef }: ChatDrawerProps) {
  const { locale } = useLocale();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // focus the close button on open
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        (returnFocusRef?.current ?? previouslyFocused)?.focus?.();
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
  }, [open, onOpenChange, returnFocusRef]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40"
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/30" />
      <aside
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatdrawer-title"
        className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl p-4 flex flex-col"
      >
        <header className="mb-2 flex items-center justify-between">
          <h2 id="chatdrawer-title" className="text-sm font-medium">
            {t("chatDrawerTitle", locale)}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded px-2 py-1 border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("close", locale)}
          </button>
        </header>
        <div className="flex-1 overflow-auto space-y-3">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className="rounded border p-3">
              <p className="text-sm text-muted-foreground">Elicitation {idx + 1}</p>
            </div>
          ))}
        </div>
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


