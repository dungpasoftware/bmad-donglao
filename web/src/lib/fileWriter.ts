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

async function resolveRealpathOfExistingAncestor(targetDir: string): Promise<string> {
  let current = targetDir;
  // Walk up until we find an existing directory to realpath
  // This lets us detect symlinks in any existing parent
  // without requiring the final directory to already exist.
  while (true) {
    try {
      await fs.access(current);
      return await fs.realpath(current);
    } catch {
      const parent = path.dirname(current);
      if (parent === current) {
        // Reached filesystem root; best effort
        return current;
      }
      current = parent;
    }
  }
}

export async function sanitizeAndResolvePath(
  allowListDirs: AllowedDirectory[],
  requestedPath: string
): Promise<string> {
  if (requestedPath.includes("..")) {
    throw Object.assign(new Error("Path traversal is not allowed"), { status: 400 });
  }

  const absoluteRequested = path.isAbsolute(requestedPath)
    ? requestedPath
    : path.join(repoRoot, requestedPath);

  const normalized = path.normalize(absoluteRequested);
  ensureAllowedExtension(normalized);

  // Fast string-level containment check first
  const isWithinAllowed = allowListDirs.some((dir) => {
    const base = allowedBaseDirs[dir];
    return normalized.startsWith(base + path.sep);
  });
  if (!isWithinAllowed) {
    throw Object.assign(new Error("Path is outside of allowed directories"), { status: 404 });
  }

  // Symlink defense: compare realpaths of the nearest existing ancestor
  const parentDir = path.dirname(normalized);
  const [realParentDir, realAllowedBases] = await Promise.all([
    resolveRealpathOfExistingAncestor(parentDir),
    Promise.all(
      allowListDirs.map(async (dir) => {
        try {
          return await fs.realpath(allowedBaseDirs[dir]);
        } catch {
          // If the base directory doesn't exist, fall back to its normalized path
          return path.normalize(allowedBaseDirs[dir]);
        }
      })
    ),
  ]);

  const isWithinAllowedReal = realAllowedBases.some((realBase) =>
    realParentDir === realBase || realParentDir.startsWith(realBase + path.sep)
  );
  if (!isWithinAllowedReal) {
    throw Object.assign(new Error("Path resolves outside of allowed directories (symlink)"), { status: 404 });
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
  const wouldWritePath = await resolveConflictSuffix(pathWithinRepo);
  return {
    wouldWritePath,
    bytes: Buffer.byteLength(content, "utf8"),
    checksum: calculateChecksum(content),
  };
}

export async function writeFileSafely(targetPath: string, content: string) {
  ensureAllowedExtension(targetPath);
  const dirname = path.dirname(targetPath);
  await fs.mkdir(dirname, { recursive: true });
  const finalPath = await resolveConflictSuffix(targetPath);
  await fs.writeFile(finalPath, content, { encoding: "utf8" });
  return {
    path: finalPath,
    bytesWritten: Buffer.byteLength(content, "utf8"),
  };
}


