"use client";

import { useCallback } from "react";
import { t } from "@/lib/i18n";
import { useLocale } from "@/components/providers/locale-provider";
import { type AgentCommand } from "@/lib/agents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ActionCard({ command }: { command: AgentCommand }) {
  const { locale } = useLocale();

  const onActivate = useCallback(() => {
    // Stub: hiển thị alert với command id làm phản hồi UI
    alert(command.id);
  }, [command.id]);

  return (
    <button
      type="button"
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      className="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      aria-label={t(command.titleKey, locale)}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t(command.titleKey, locale)}</CardTitle>
          <CardDescription>{t(command.descKey, locale)}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-xs text-muted-foreground">{command.id}</span>
        </CardContent>
      </Card>
    </button>
  );
}


