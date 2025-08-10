import { NextRequest } from "next/server";
import { runComplianceValidation, CompliancePayload } from "@/lib/validator/bmadValidator";
import { getRepoRoot } from "@/lib/fileWriter";
import path from "node:path";

export async function POST(req: NextRequest) {
  const started = Date.now();
  let payload: CompliancePayload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  try {
    const result = await runComplianceValidation(payload ?? {});
    const durationMs = Date.now() - started;

    // Telemetry (non-blocking)
    try {
      const telemetryUrl = new URL("/api/telemetry/event", req.url);
      fetch(telemetryUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event: "validation_run",
          props: { errors: result.summary.errors, warnings: result.summary.warnings, durationMs },
          ts: Date.now(),
        }),
      }).catch(() => {});
    } catch {}

    // Ensure any absolute paths in issues become repo-relative
    const repoRoot = getRepoRoot();
    const issues = result.issues.map((it) =>
      it.path ? { ...it, path: path.relative(repoRoot, path.isAbsolute(it.path) ? it.path : path.join(repoRoot, it.path)) } : it
    );

    return Response.json({ status: result.status, summary: result.summary, issues });
  } catch (err) {
    const e = err as { status?: number; message?: string };
    const status = typeof e?.status === "number" ? e.status : 500;
    return Response.json({ error: e?.message ?? "Internal error" }, { status });
  }
}


