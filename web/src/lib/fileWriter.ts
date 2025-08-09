import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type AllowedDirectory = "docs" | ".bmad-core";

const repoRoot = path.resolve(process.cwd(), "..");
const allowedBaseDirs: Record<AllowedDirectory, string> = {
  docs: path.join(repoRoot, "docs"),
  ".bmad-core": path.join(repoRoot, ".bmad-core"),
};

const allowedExtensions = new Set([".md", ".json"]);

export function calculateChecksum(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function ensureAllowedExtension(targetPath: string): void {
  const ext = path.extname(targetPath).toLowerCase();
  if (!allowedExtensions.has(ext)) {
    throw Object.assign(new Error(`Unsupported extension: ${ext}`), { status: 400 });
  }
}

export function getRepoRoot(): string {
  return repoRoot;
}

export function sanitizeAndResolvePath(
  allowListDirs: AllowedDirectory[],
  requestedPath: string
): string {
  if (requestedPath.includes("..")) {
    throw Object.assign(new Error("Path traversal is not allowed"), { status: 400 });
  }

  const absoluteRequested = path.isAbsolute(requestedPath)
    ? requestedPath
    : path.join(repoRoot, requestedPath);

  const normalized = path.normalize(absoluteRequested);
  ensureAllowedExtension(normalized);

  const isWithinAllowed = allowListDirs.some((dir) => {
    const base = allowedBaseDirs[dir];
    return normalized.startsWith(base + path.sep);
  });

  if (!isWithinAllowed) {
    throw Object.assign(new Error("Path is outside of allowed directories"), { status: 404 });
  }

  return normalized;
}

export async function resolveConflictSuffix(targetPath: string): Promise<string> {
  const ext = path.extname(targetPath);
  const base = targetPath.slice(0, targetPath.length - ext.length);
  let candidate = targetPath;
  let counter = 1;
  try {
    // If access succeeds, file exists → iterate
    await fs.access(candidate);
    while (true) {
      candidate = `${base}-${counter}${ext}`;
      try {
        await fs.access(candidate);
        counter += 1;
      } catch {
        return candidate;
      }
    }
  } catch {
    return candidate;
  }
}

export async function dryRunFileWrite(pathWithinRepo: string, content: string) {
  const wouldWritePath = pathWithinRepo;
  return {
    wouldWritePath,
    bytes: Buffer.byteLength(content, "utf8"),
    checksum: calculateChecksum(content),
  };
}

export async function writeFileSafely(targetPath: string, content: string) {
  const dirname = path.dirname(targetPath);
  await fs.mkdir(dirname, { recursive: true });
  const finalPath = await resolveConflictSuffix(targetPath);
  await fs.writeFile(finalPath, content, { encoding: "utf8" });
  return {
    path: finalPath,
    bytesWritten: Buffer.byteLength(content, "utf8"),
  };
}


