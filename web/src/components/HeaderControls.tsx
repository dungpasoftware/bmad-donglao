"use client";

import { useRef, useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { CommandPalette } from "@/components/command/CommandPalette";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { useHotkeys } from "@/hooks/useHotkeys";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/lib/i18n";

export function HeaderControls() {
  const { locale } = useLocale();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const paletteButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerButtonRef = useRef<HTMLButtonElement | null>(null);

  useHotkeys({
    onTogglePalette: () => setPaletteOpen((v) => !v),
    onCloseAll: () => {
      setPaletteOpen(false);
      setDrawerOpen(false);
    },
  });

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
    </div>
  );
}


