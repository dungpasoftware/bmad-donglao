import { NextRequest } from "next/server";
import path from "node:path";
import { getRepoRoot, sanitizeAndResolvePath, dryRunFileWrite, writeFileSafely } from "@/lib/fileWriter";

type Input = {
  path: string;
  content: string;
  dryRun?: boolean;
};

export async function POST(req: NextRequest) {
  let body: Input;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
  const { path: reqPath, content, dryRun } = body ?? {};
  if (!reqPath || typeof content !== "string") {
    return Response.json({ error: "Missing path or content" }, { status: 400 });
  }

  try {
    const repoRoot = getRepoRoot();
    const absRequested = path.isAbsolute(reqPath)
      ? reqPath
      : path.join(repoRoot, reqPath);
    const safePath = sanitizeAndResolvePath(["docs", ".bmad-core"], absRequested);
    if (dryRun) {
      const result = await dryRunFileWrite(safePath, content);
      return Response.json(result);
    }
    const write = await writeFileSafely(safePath, content);
    // Telemetry: fire and forget (do not block)
    const host = req.headers.get("host") ?? "localhost:3000";
    fetch(`http://${host}/api/telemetry/event`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "file_written", props: { path: write.path, bytes: write.bytesWritten }, ts: Date.now() }),
    }).catch(() => {});
    return Response.json(write);
  } catch (err) {
    const e = err as { status?: number; message?: string };
    const status = typeof e?.status === "number" ? e.status : 500;
    return Response.json({ error: e?.message ?? "Internal error" }, { status });
  }
}


