import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import {
  type UploadedFile,
} from "./upload-slots";
import { isKnownUploadSlot } from "./card-slots";
import {
  getWritableDataPath,
  getDataPathForRead,
} from "./data-dir";

function uploadsDirWritable(): string {
  return getWritableDataPath("uploads");
}

function uploadsDirForRead(slotId?: string): string {
  // Prefer writable; fallback to bundled if writable missing
  const writable = slotId ? getWritableDataPath("uploads", slotId) : getWritableDataPath("uploads");
  if (existsSync(writable)) return getWritableDataPath("uploads");
  const bundled = path.join(process.cwd(), "data", "uploads");
  if (existsSync(bundled)) return bundled;
  return writable;
}

function getUploadsBase(): string {
  return uploadsDirWritable();
}

function slotDir(slotId: string): string {
  return path.join(getUploadsBase(), slotId);
}

function slotDirForRead(slotId: string): string {
  const writable = path.join(getWritableDataPath("uploads"), slotId);
  if (existsSync(writable)) return writable;
  const bundled = path.join(process.cwd(), "data", "uploads", slotId);
  if (existsSync(bundled)) return bundled;
  return writable;
}

function resolveSlotPathForRead(slotId: string, relPath: string): string | null {
  // try writable first, then bundled
  const writableBase = path.join(getWritableDataPath("uploads"), slotId);
  const bundledBase = path.join(process.cwd(), "data", "uploads", slotId);
  for (const base of [writableBase, bundledBase]) {
    const segments = relPath
      .split("/")
      .filter((s) => s.length > 0)
      .map(cleanSegment)
      .filter((s) => s.length > 0 && s !== "." && s !== "..");
    if (segments.length === 0) continue;
    const full = path.join(base, ...segments);
    if (!full.startsWith(base)) continue;
    if (existsSync(full)) return full;
  }
  // fallback to writable path (for creation checks)
  return resolveSlotPath(slotId, relPath);
}

function cleanSegment(segment: string): string {
  return segment
    .replace(/[^a-zA-Z0-9._ -]/g, "_")
    .trim()
    .replace(/^[._ -]+/, "")
    .replace(/[._ -]+$/, "");
}

function resolveSlotPath(slotId: string, relPath: string): string | null {
  const base = slotDir(slotId);
  const segments = relPath
    .split("/")
    .filter((s) => s.length > 0)
    .map(cleanSegment)
    .filter((s) => s.length > 0 && s !== "." && s !== "..");
  if (segments.length === 0) {
    return null;
  }
  const full = path.join(base, ...segments);
  if (!full.startsWith(base)) {
    return null;
  }
  return full;
}

function uniqueFileName(dir: string, name: string): string {
  if (!existsSync(path.join(dir, name))) {
    return name;
  }
  const dot = name.lastIndexOf(".");
  const stem = dot === -1 ? name : name.slice(0, dot);
  const ext = dot === -1 ? "" : name.slice(dot);
  for (let i = 1; ; i += 1) {
    const candidate = `${stem}-${i}${ext}`;
    if (!existsSync(path.join(dir, candidate))) {
      return candidate;
    }
  }
}

function encodedRelPath(relPath: string): string {
  return relPath.split("/").map(encodeURIComponent).join("/");
}

export interface SlotItem {
  file: File;
  relPath: string;
}

export interface SlotEntry {
  type: "folder" | "file";
  name: string;
  relPath: string;
  url: string;
}

export interface SlotTree {
  slotId: string;
  entries: SlotEntry[];
}

export async function saveSlotItems(
  slotId: string,
  items: SlotItem[]
): Promise<UploadedFile[]> {
  if (!isKnownUploadSlot(slotId)) {
    return [];
  }
  const base = slotDir(slotId);
  try {
    mkdirSync(base, { recursive: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "EROFS" || (err as Error)?.message?.includes("read-only")) {
      const fallback = path.join("/tmp", "data", "uploads", slotId);
      mkdirSync(fallback, { recursive: true });
    } else {
      throw err;
    }
  }

  const saved: UploadedFile[] = [];
  for (const item of items) {
    const dirParts = item.relPath.split("/").map(cleanSegment);
    const rawName = dirParts.pop() ?? "";
    const name = uniqueFileName(
      path.join(base, ...dirParts),
      rawName && rawName !== "." && rawName !== ".." ? rawName : "file"
    );
    const full = path.join(base, ...dirParts, name);
    if (!full.startsWith(base)) {
      continue;
    }
    const buffer = Buffer.from(await item.file.arrayBuffer());
    try {
      mkdirSync(path.dirname(full), { recursive: true });
      writeFileSync(full, buffer);
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code === "EROFS" || (err as Error)?.message?.includes("read-only")) {
        const fallbackBase = path.join("/tmp", "data", "uploads", slotId);
        const fallbackFull = path.join(fallbackBase, ...dirParts, name);
        mkdirSync(path.dirname(fallbackFull), { recursive: true });
        writeFileSync(fallbackFull, buffer);
      } else {
        throw err;
      }
    }
    saved.push({
      name,
      size: item.file.size,
      url: `/api/uploads/${slotId}/${encodedRelPath([...dirParts, name].join("/"))}`,
    });
  }
  return saved;
}

export function listSlotEntries(
  slotId: string,
  relPath = ""
): SlotEntry[] {
  // Collect dirs to read: writable and bundled (for EROFS fallback + seeded data)
  const dirs: string[] = [];
  if (relPath) {
    const writableFull = resolveSlotPath(slotId, relPath);
    const readFallback = resolveSlotPathForRead(slotId, relPath);
    if (writableFull) dirs.push(writableFull);
    if (readFallback && readFallback !== writableFull) dirs.push(readFallback);
    // also check bundled directly if fallback didn't find
    const bundledFull = path.join(process.cwd(), "data", "uploads", slotId, ...relPath.split("/").map(cleanSegment).filter(Boolean));
    if (existsSync(bundledFull) && !dirs.includes(bundledFull)) dirs.push(bundledFull);
  } else {
    const writableBase = slotDir(slotId);
    const bundledBase = path.join(process.cwd(), "data", "uploads", slotId);
    if (existsSync(writableBase)) dirs.push(writableBase);
    if (existsSync(bundledBase) && !dirs.includes(bundledBase)) dirs.push(bundledBase);
    if (dirs.length === 0) {
      // No dir exists yet, fallback to writable for empty result
      return [];
    }
  }

  const seen = new Set<string>();
  const combined: SlotEntry[] = [];
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    try {
      const entries = readdirSync(dir, { withFileTypes: true })
        .map((entry) => {
          const clean = cleanSegment(entry.name);
          if (!clean || clean === "." || clean === "..") {
            return null;
          }
          const entryRel = relPath ? `${relPath}/${clean}` : clean;
          const url =
            entry.isDirectory()
              ? `/ui-upload/${slotId}/${encodedRelPath(entryRel)}`
              : `/api/uploads/${slotId}/${encodedRelPath(entryRel)}`;
          return {
            type: entry.isDirectory() ? ("folder" as const) : ("file" as const),
            name: entry.name,
            relPath: entryRel,
            url,
          };
        })
        .filter((entry): entry is SlotEntry => entry !== null);
      for (const e of entries) {
        if (!seen.has(e.relPath)) {
          seen.add(e.relPath);
          combined.push(e);
        }
      }
    } catch {
      // ignore this dir
    }
  }

  return combined.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

export function readUploadedFile(
  slotId: string,
  relPath: string
): { content: Buffer; mimeType: string } | null {
  if (!isKnownUploadSlot(slotId)) {
    return null;
  }
  const candidates = [
    resolveSlotPath(slotId, relPath),
    resolveSlotPathForRead(slotId, relPath),
    path.join(process.cwd(), "data", "uploads", slotId, ...relPath.split("/").map(cleanSegment).filter(Boolean)),
  ].filter((p): p is string => !!p);
  for (const full of candidates) {
    if (!existsSync(full)) continue;
    try {
      const stats = statSync(full);
      if (!stats.isFile()) continue;
      return {
        content: readFileSync(full),
        mimeType: mimeTypeFor(relPath),
      };
    } catch {
      continue;
    }
  }
  return null;
}

function mimeTypeFor(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const map: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".json": "application/json",
    ".zip": "application/zip",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
  };
  return map[ext] ?? "application/octet-stream";
}

function collectTree(slotId: string, entries: SlotEntry[]): SlotEntry[] {
  const result: SlotEntry[] = [];
  for (const entry of entries) {
    result.push(entry);
    if (entry.type === "folder") {
      result.push(...collectTree(slotId, listSlotEntries(slotId, entry.relPath)));
    }
  }
  return result;
}

export function listSlotTree(slotId: string): SlotEntry[] {
  return collectTree(slotId, listSlotEntries(slotId));
}

export function deleteUploadedEntry(
  slotId: string,
  relPath: string
): { ok: boolean; type?: "folder" | "file"; error?: string } {
  if (!isKnownUploadSlot(slotId)) {
    return { ok: false, error: "Unknown upload folder." };
  }
  const candidates = [
    resolveSlotPath(slotId, relPath),
    resolveSlotPathForRead(slotId, relPath),
    path.join(process.cwd(), "data", "uploads", slotId, ...relPath.split("/").map(cleanSegment).filter(Boolean)),
  ].filter((p): p is string => !!p);
  const existing = candidates.find((p) => existsSync(p));
  if (!existing) {
    return { ok: false, error: "That file no longer exists." };
  }
  // Prefer writable candidate if it exists, otherwise first existing
  const full = candidates.find((p) => p.startsWith(getWritableDataPath("uploads")) && existsSync(p)) ?? existing;
  if (!full) {
    return { ok: false, error: "Invalid path." };
  }
  try {
    const stats = statSync(full);
    rmSync(full, { recursive: true, force: true });
    return { ok: true, type: stats.isDirectory() ? "folder" : "file" };
  } catch (err) {
    // If EROFS, try fallback writable path via /tmp
    if ((err as NodeJS.ErrnoException)?.code === "EROFS" || (err as Error)?.message?.includes("read-only")) {
      const fallback = path.join("/tmp", "data", "uploads", slotId, ...relPath.split("/").map(cleanSegment).filter(Boolean));
      if (existsSync(fallback)) {
        try {
          const stats = statSync(fallback);
          rmSync(fallback, { recursive: true, force: true });
          return { ok: true, type: stats.isDirectory() ? "folder" : "file" };
        } catch {}
      }
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Couldn't delete that file.",
    };
  }
}

export function clearSlot(slotId: string): { ok: boolean; deleted: number; error?: string } {
  if (!isKnownUploadSlot(slotId)) {
    return { ok: false, deleted: 0, error: "Unknown upload folder." };
  }
  // Clear both writable and bundled (but bundled may be read-only, so ignore EROFS)
  const bases = [
    slotDir(slotId),
    path.join(process.cwd(), "data", "uploads", slotId),
    path.join("/tmp", "data", "uploads", slotId),
  ];
  let deleted = 0;
  let lastError: string | undefined;
  for (const base of bases) {
    if (!existsSync(base)) continue;
    try {
      for (const child of readdirSync(base)) {
        rmSync(path.join(base, child), { recursive: true, force: true });
        deleted += 1;
      }
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code === "EROFS" || (err as Error)?.message?.includes("read-only")) {
        continue; // skip read-only bundled
      }
      lastError = err instanceof Error ? err.message : "Couldn't empty that box.";
    }
  }
  if (lastError && deleted === 0) {
    return { ok: false, deleted, error: lastError };
  }
  return { ok: true, deleted };
}
