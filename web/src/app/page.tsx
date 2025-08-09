"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { GlossaryTooltip } from "@/components/glossary/GlossaryTooltip";

export default function Home() {
  const { locale } = useLocale();
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>{t("appTitle", locale)}</CardTitle>
          <CardDescription>
            {t("appDescription", locale)} — 
            <GlossaryTooltip termId="agent">agent</GlossaryTooltip>, 
            <GlossaryTooltip termId="command">command</GlossaryTooltip>, 
            <GlossaryTooltip termId="template">template</GlossaryTooltip>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="default">{t("primary", locale)}</Button>
          <Button variant="secondary">{t("secondary", locale)}</Button>
        </CardContent>
      </Card>
      <div className="absolute left-4 top-4">
        <Link
          href="/agents/sm"
          className="underline underline-offset-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          /agents/sm
        </Link>
      </div>
    </main>
  );
}
