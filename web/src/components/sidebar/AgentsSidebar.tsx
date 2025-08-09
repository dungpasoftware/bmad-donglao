"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { agents } from "@/lib/agents";
import { t } from "@/lib/i18n";

export function AgentsSidebar({ selectedId }: { selectedId?: string }) {
  const { locale } = useLocale();
  return (
    <nav aria-label={t("agentsLabel", locale)} className="w-64 p-4 border-r">
      <ul className="space-y-2">
        {agents.map((a) => {
          const isActive = a.id === selectedId;
          return (
            <li key={a.id}>
              <Link
                href={`/agents/${a.id}`}
                className={
                  "block w-full text-left px-3 py-2 rounded border hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                  (isActive ? "bg-muted aria-[current=true]:ring-2" : "")
                }
                aria-current={isActive ? "page" : undefined}
              >
                {t(a.nameKey, locale)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


