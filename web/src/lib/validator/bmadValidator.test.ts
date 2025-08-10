import { describe, it, expect } from "vitest";
import path from "node:path";
import { getRepoRoot } from "@/lib/fileWriter";
import {
  validateArtifacts,
  validateMapping,
  runComplianceValidation,
} from "@/lib/validator/bmadValidator";

describe("bmadValidator", () => {
  it("validateMapping flags invalid format and unknown ids", () => {
    const issues = validateMapping([
      { id: "badformat" },
      { id: "sm:unknown-cmd" },
      { id: "sm:help" },
    ]);
    const codes = issues.map((i) => i.code);
    expect(codes).toContain("MAPPING_COMMAND_ID_INVALID_FORMAT");
    expect(codes).toContain("MAPPING_COMMAND_ID_UNKNOWN");
  });

  it("validateArtifacts flags outside scope and extension", async () => {
    const repo = getRepoRoot();
    const outside = path.join(repo, "outside.txt");
    const traversal = "../outside.md";
    const issues = await validateArtifacts(["docs", ".bmad-core"], [".md", ".json"], [outside, traversal]);
    const codes = issues.map((i) => i.code);
    expect(codes).toContain("ARTIFACT_EXTENSION_NOT_ALLOWED");
    expect(codes).toContain("ARTIFACT_PATH_OUTSIDE_SCOPE");
  });

  it("runComplianceValidation aggregates and sets status", async () => {
    const res = await runComplianceValidation({
      artifacts: { paths: ["docs/out/brief-nonexistent.md"] },
      mapping: { commands: [{ id: "sm:help" }, { id: "xx:bad" }] },
      mode: "strict",
    });
    expect(res.summary.warnings).toBeGreaterThanOrEqual(1);
    expect(["ok", "pass_with_warnings", "fail"]).toContain(res.status);
  });
});


