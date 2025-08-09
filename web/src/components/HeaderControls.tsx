"use client";

import { useRef, useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { CommandPalette } from "@/components/command/CommandPalette";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { GlossaryDrawer } from "@/components/glossary/GlossaryDrawer";
import { useHotkeys } from "@/hooks/useHotkeys";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/lib/i18n";

export function HeaderControls() {
  const { locale } = useLocale();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossaryInitialTermId, setGlossaryInitialTermId] = useState<string | undefined>(undefined);
  const [docOutToast, setDocOutToast] = useState(false);
  const paletteButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerButtonRef = useRef<HTMLButtonElement | null>(null);
  const glossaryButtonRef = useRef<HTMLButtonElement | null>(null);

  useHotkeys({
    onTogglePalette: () => setPaletteOpen((v) => !v),
    onCloseAll: () => {
      setPaletteOpen(false);
      setDrawerOpen(false);
      setGlossaryOpen(false);
      setGlossaryInitialTermId(undefined);
    },
  });

  // Cross-link: open glossary from tooltip
  // Attach global event listener; ensure cleanup on unmount
  if (typeof document !== "undefined") {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { termId?: string };
      setGlossaryInitialTermId(detail?.termId);
      setGlossaryOpen(true);
    };
    document.removeEventListener("open-glossary", handler as EventListener);
    document.addEventListener("open-glossary", handler as EventListener);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        ref={paletteButtonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={paletteOpen}
        aria-label={t("openPalette", locale)}
        onClick={() => setPaletteOpen((v) => !v)}
        className="rounded px-3 py-1 border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        ⌘K
      </button>
      <button
        ref={drawerButtonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={drawerOpen}
        aria-label={t("toggleChat", locale)}
        onClick={() => setDrawerOpen((v) => !v)}
        className="rounded px-3 py-1 border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t("chatDrawerTitle", locale)}
      </button>
      <button
        ref={glossaryButtonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={glossaryOpen}
        aria-label={t("openGlossary", locale)}
        onClick={() => setGlossaryOpen((v) => !v)}
        className="rounded px-3 py-1 border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t("glossaryTitle", locale)}
      </button>
      <button
        type="button"
        onClick={() => {
          setDocOutToast(true);
          // Auto-hide after 2.5s
          window.setTimeout(() => setDocOutToast(false), 2500);
        }}
        className="rounded px-3 py-1 border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-live="polite"
        aria-label={t("docOut", locale)}
      >
        {t("docOut", locale)}
      </button>
      <LanguageToggle />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        returnFocusRef={paletteButtonRef}
      />
      <ChatDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        returnFocusRef={drawerButtonRef}
      />
      <GlossaryDrawer
        open={glossaryOpen}
        onOpenChange={setGlossaryOpen}
        returnFocusRef={glossaryButtonRef}
        initialTermId={glossaryInitialTermId}
      />
      {docOutToast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 right-4 z-50 max-w-sm rounded bg-black/80 text-white px-4 py-2 shadow"
        >
          {t("docOutStub", locale)}
        </div>
      ) : null}
    </div>
  );
}


