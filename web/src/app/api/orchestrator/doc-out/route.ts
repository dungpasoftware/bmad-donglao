import { NextRequest } from "next/server";
import path from "node:path";
import { getRepoRoot, sanitizeAndResolvePath, writeFileSafely } from "@/lib/fileWriter";

type DocOutInput = {
  templateId: string;
  payload?: Record<string, unknown>;
};

function resolveOutputPath(input: DocOutInput): string | null {
  const ts = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 12);
  if (input.templateId === "brief") {
    return path.join("docs", "out", `brief-${ts}.md`);
  }
  if (input.templateId === "prd") {
    return path.join("docs", "out", `prd-${ts}.md`);
  }
  return null;
}

export async function POST(req: NextRequest) {
  let body: DocOutInput;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
  const { templateId } = body ?? {};
  if (!templateId) {
    return Response.json({ error: "Missing templateId" }, { status: 400 });
  }

  const relOut = resolveOutputPath({ templateId, payload: body.payload ?? {} });
  if (!relOut) {
    return Response.json({ error: "Unsupported templateId" }, { status: 400 });
  }

  const repoRoot = getRepoRoot();
  try {
    const absPath = await sanitizeAndResolvePath(["docs"], path.join(repoRoot, relOut));
    const content = `# ${templateId.toUpperCase()}\n\nGenerated at ${new Date().toISOString()}\n`;
    const result = await writeFileSafely(absPath, content);
    const relativePath = path.relative(repoRoot, result.path);
    // Telemetry (non-blocking)
    const telemetryUrl = new URL("/api/telemetry/event", req.url);
    fetch(telemetryUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: "doc_out",
        props: { templateId, path: relativePath },
        ts: Date.now(),
      }),
    }).catch(() => {});
    return Response.json({ status: "ok", path: relativePath, bytesWritten: result.bytesWritten });
  } catch (err) {
    const e = err as { status?: number; message?: string };
    const status = typeof e?.status === "number" ? e.status : 500;
    return Response.json({ error: e?.message ?? "Internal error" }, { status });
  }
}


