"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/lib/i18n";
import { type Agent } from "@/lib/agents";

export function AgentHeader({ agent }: { agent: Agent }) {
  const { locale } = useLocale();
  return (
    <header className="w-full flex items-center justify-between p-4 border-b">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{t(agent.nameKey, locale)}</h1>
        <p className="text-sm text-muted-foreground">
          {t(agent.roleKey, locale)} · {t(agent.whenToUseKey, locale)}
        </p>
      </div>
      <Link
        href="/"
        className="text-sm underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t("backHome", locale)}
      </Link>
    </header>
  );
}


