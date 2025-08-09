export type GlossaryTerm = {
  id: string;
  aliases?: string[];
  definition: {
    vi: string;
    en: string;
  };
};

// Minimal dataset for MVP; fallback logic handled at read-time
export const glossary: GlossaryTerm[] = [
  {
    id: "agent",
    aliases: ["bot", "assistant"],
    definition: {
      vi: "Agent là thực thể phần mềm thực hiện nhiệm vụ theo hướng dẫn.",
      en: "An agent is a software entity that performs tasks based on guidance.",
    },
  },
  {
    id: "command",
    aliases: ["action"],
    definition: {
      vi: "Command là hành động có thể thực thi bởi agent.",
      en: "A command is an executable action handled by an agent.",
    },
  },
  {
    id: "template",
    aliases: ["tmpl"],
    definition: {
      vi: "Template là khuôn mẫu tài liệu/luồng để tái sử dụng.",
      en: "A template is a reusable document/flow blueprint.",
    },
  },
];

export function getDefinition(termId: string, locale: "vi" | "en"): string {
  const item = glossary.find((t) => t.id === termId);
  if (!item) return termId;
  const def = item.definition[locale] || item.definition.vi;
  return def;
}

export function searchGlossary(query: string): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return glossary;
  return glossary.filter((t) => {
    if (t.id.toLowerCase().includes(q)) return true;
    return (t.aliases ?? []).some((a) => a.toLowerCase().includes(q));
  });
}


