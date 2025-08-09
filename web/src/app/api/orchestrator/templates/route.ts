export async function GET() {
  const templates = [
    {
      id: "brief",
      name: "Brief",
      description: "Short project brief template",
      outputPattern: "docs/out/brief-{ts}.md",
    },
    {
      id: "prd",
      name: "PRD",
      description: "Product Requirements Document template",
      outputPattern: "docs/out/prd-{ts}.md",
    },
    {
      id: "story",
      name: "Story Doc",
      description: "User story doc template",
      outputPattern: "docs/stories/{epic}.{story}.{slug}.md",
    },
  ];
  return Response.json({ templates });
}


