import { describe, it, expect, beforeEach, vi } from "vitest";
import path from "node:path";
import { POST } from "./route";
import { getRepoRoot } from "@/lib/fileWriter";

describe("/api/orchestrator/validate route", () => {
  beforeEach(() => {
    // Mock telemetry fetch to avoid real network
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ status: "accepted" }), { status: 200 })) as any
    );
  });

  it("returns ok for empty payload", async () => {
    const req = new Request("http://localhost/api/orchestrator/validate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await POST(req as any);
    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.summary).toEqual({ errors: 0, warnings: 0, infos: 0 });
    expect(Array.isArray(json.issues)).toBe(true);
  });

  it("fails in strict mode for path outside allowed scope", async () => {
    const repo = getRepoRoot();
    const outsidePath = path.join(repo, "outside.md");
    const req = new Request("http://localhost/api/orchestrator/validate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ artifacts: { paths: [outsidePath] }, mode: "strict" }),
    });
    const res = await POST(req as any);
    const json = await res.json();
    expect(json.status).toBe("fail");
    const codes: string[] = json.issues.map((i: any) => i.code);
    expect(codes).toContain("ARTIFACT_PATH_OUTSIDE_SCOPE");
  });

  it("passes with warnings in permissive mode even with errors", async () => {
    const repo = getRepoRoot();
    const outsidePath = path.join(repo, "outside.md");
    const req = new Request("http://localhost/api/orchestrator/validate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ artifacts: { paths: [outsidePath] }, mode: "permissive" }),
    });
    const res = await POST(req as any);
    const json = await res.json();
    expect(json.status).toBe("pass_with_warnings");
  });
});


