import fs from "node:fs/promises";
import path from "node:path";
import { renderMarkdownToHtml } from "@/lib/markdown";
import { t } from "@/lib/i18n";
import { Locale } from "@/lib/i18n";

async function readBriefMarkdown(): Promise<string> {
  const repoRoot = path.resolve(process.cwd(), "..");
  const briefPath = path.join(repoRoot, "docs", "brief.md");
  try {
    const buf = await fs.readFile(briefPath);
    return buf.toString("utf8");
  } catch {
    return "# Missing docs/brief.md\n\nNo brief found.";
  }
}

export default async function PreviewPage() {
  // Default to vi per PRD for static render; UI copy uses vi strings
  const locale: Locale = "vi";
  const md = await readBriefMarkdown();
  const html = renderMarkdownToHtml(md);

  return (
    <main className="min-h-screen w-full p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{t("previewTitle", locale)}</h1>
      <article
        className="prose prose-zinc max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}


