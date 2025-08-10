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
    const safePath = await sanitizeAndResolvePath(["docs", ".bmad-core"], absRequested);
    if (dryRun) {
      const result = await dryRunFileWrite(safePath, content);
      const relativeWouldWritePath = path.relative(repoRoot, result.wouldWritePath);
      return Response.json({ ...result, wouldWritePath: relativeWouldWritePath });
    }
    const write = await writeFileSafely(safePath, content);
    const relativeWrittenPath = path.relative(repoRoot, write.path);
    // Telemetry: fire and forget (do not block)
    const telemetryUrl = new URL("/api/telemetry/event", req.url);
    fetch(telemetryUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "file_written", props: { path: relativeWrittenPath, bytes: write.bytesWritten }, ts: Date.now() }),
    }).catch(() => {});
    return Response.json({ path: relativeWrittenPath, bytesWritten: write.bytesWritten });
  } catch (err) {
    const e = err as { status?: number; message?: string };
    const status = typeof e?.status === "number" ? e.status : 500;
    return Response.json({ error: e?.message ?? "Internal error" }, { status });
  }
}


