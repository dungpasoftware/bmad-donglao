"use client";

import { useEffect } from "react";

type HotkeysOptions = {
  onTogglePalette?: () => void;
  onCloseAll?: () => void;
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return true;
  // contenteditable elements
  const contentEditable = target.getAttribute("contenteditable");
  return contentEditable === "" || contentEditable === "true";
}

export function useHotkeys(options: HotkeysOptions) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e.target)) return;

      const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.platform);
      const isK = e.key.toLowerCase() === "k";
      const isEsc = e.key === "Escape";

      // ⌘K (macOS) or Ctrl+K (others)
      if (isK && ((isMac && e.metaKey) || (!isMac && e.ctrlKey))) {
        e.preventDefault();
        options.onTogglePalette?.();
        return;
      }

      if (isEsc) {
        options.onCloseAll?.();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [options]);
}


