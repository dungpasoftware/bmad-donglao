import fs from "node:fs/promises";
import path from "node:path";
import {
  AllowedDirectory,
  ensureAllowedExtension,
  getRepoRoot,
  sanitizeAndResolvePath,
} from "@/lib/fileWriter";
import { agents, AgentCommandId } from "@/lib/agents";

export type ValidationSeverity = "error" | "warning" | "info";

export type ValidationIssue = {
  code: string;
  severity: ValidationSeverity;
  message: string;
  path?: string;
};

export type ValidationSummary = {
  errors: number;
  warnings: number;
  infos: number;
};

export type ValidationStatus = "ok" | "pass_with_warnings" | "fail";

export type ValidationResult = {
  status: ValidationStatus;
  summary: ValidationSummary;
  issues: ValidationIssue[];
};

export type CompliancePayload = {
  artifacts?: { paths?: string[] };
  mapping?: { commands?: { id: string }[] };
  mode?: "strict" | "permissive";
};

const KNOWN_COMMAND_IDS: Set<string> = new Set(
  agents.flatMap((a) => a.commands.map((c) => c.id as AgentCommandId))
);

function toRepoRelative(inputPath: string, repoRoot: string): string {
  try {
    const rel = path.relative(repoRoot, inputPath);
    return rel || inputPath;
  } catch {
    return inputPath;
  }
}

export async function validateArtifacts(
  allowDirs: AllowedDirectory[],
  extensions: string[],
  inputPaths?: string[]
): Promise<ValidationIssue[]> {
  const repoRoot = getRepoRoot();
  const issues: ValidationIssue[] = [];

  if (!inputPaths || inputPaths.length === 0) {
    return issues;
  }

  await Promise.all(
    inputPaths.map(async (p) => {
      const absRequested = path.isAbsolute(p) ? p : path.join(repoRoot, p);
      const candidateRel = toRepoRelative(absRequested, repoRoot);

      try {
        // Extension whitelist early check for clearer error classification
        try {
          ensureAllowedExtension(absRequested);
        } catch {
          issues.push({
            code: "ARTIFACT_EXTENSION_NOT_ALLOWED",
            severity: "error",
            message: `Extension not allowed for ${candidateRel}`,
            path: candidateRel,
          });
          return;
        }

        const safePath = await sanitizeAndResolvePath(allowDirs, absRequested);

        try {
          await fs.access(safePath);
        } catch {
          issues.push({
            code: "ARTIFACT_MISSING",
            severity: "warning",
            message: `Artifact not found: ${candidateRel}`,
            path: candidateRel,
          });
          return;
        }
      } catch (err) {
        const e = err as { status?: number; message?: string };
        const isOutside = e?.message?.toLowerCase().includes("outside of allowed");
        const isTraversal = e?.message?.toLowerCase().includes("traversal") || e?.message?.toLowerCase().includes("symlink");
        issues.push({
          code: "ARTIFACT_PATH_OUTSIDE_SCOPE",
          severity: "error",
          message: isOutside
            ? `Path is outside of allowed scope: ${candidateRel}`
            : isTraversal
            ? `Path sanitization failed (traversal/symlink): ${candidateRel}`
            : `Invalid artifact path: ${candidateRel}`,
          path: candidateRel,
        });
      }
    })
  );

  return issues;
}

export function validateMapping(commands?: { id: string }[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!commands || commands.length === 0) {
    return issues;
  }

  const idFormat = /^[a-z]+:[a-z-]+$/;
  for (const { id } of commands) {
    if (typeof id !== "string" || !idFormat.test(id)) {
      issues.push({
        code: "MAPPING_COMMAND_ID_INVALID_FORMAT",
        severity: "warning",
        message: `Invalid command id format: ${id}`,
      });
      continue;
    }
    if (!KNOWN_COMMAND_IDS.has(id)) {
      issues.push({
        code: "MAPPING_COMMAND_ID_UNKNOWN",
        severity: "warning",
        message: `Unknown command id: ${id}`,
      });
    }
  }
  return issues;
}

function summarize(issues: ValidationIssue[]): ValidationSummary {
  return issues.reduce(
    (acc, it) => {
      if (it.severity === "error") acc.errors += 1;
      else if (it.severity === "warning") acc.warnings += 1;
      else acc.infos += 1;
      return acc;
    },
    { errors: 0, warnings: 0, infos: 0 } as ValidationSummary
  );
}

function decideStatus(summary: ValidationSummary, mode: "strict" | "permissive"): ValidationStatus {
  if (summary.errors > 0) {
    return mode === "permissive" ? "pass_with_warnings" : "fail";
  }
  if (summary.warnings > 0) return "pass_with_warnings";
  return "ok";
}

export async function runComplianceValidation(payload: CompliancePayload): Promise<ValidationResult> {
  const mode = payload.mode === "permissive" ? "permissive" : "strict";

  const artifactIssues = await validateArtifacts(
    ["docs", ".bmad-core"],
    [".md", ".json"],
    payload.artifacts?.paths
  );
  const mappingIssues = validateMapping(payload.mapping?.commands);

  const issues = [...artifactIssues, ...mappingIssues];
  const summary = summarize(issues);
  const status = decideStatus(summary, mode);
  return { status, summary, issues };
}


