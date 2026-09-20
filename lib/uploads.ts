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

const uploadsDir = path.join(process.cwd(), "data", "uploads");

function slotDir(slotId: string): string {
  return path.join(uploadsDir, slotId);
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
  mkdirSync(base, { recursive: true });

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
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, Buffer.from(await item.file.arrayBuffer()));
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
  const base = slotDir(slotId);
  const dir = relPath
    ? (resolveSlotPath(slotId, relPath) ?? "")
    : base;
  if (!dir || !existsSync(dir)) {
    return [];
  }
  try {
    return readdirSync(dir, { withFileTypes: true })
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
      .filter((entry): entry is SlotEntry => entry !== null)
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
  } catch {
    return [];
  }
}

export function readUploadedFile(
  slotId: string,
  relPath: string
): { content: Buffer; mimeType: string } | null {
  if (!isKnownUploadSlot(slotId)) {
    return null;
  }
  const full = resolveSlotPath(slotId, relPath);
  if (!full || !existsSync(full)) {
    return null;
  }
  const stats = statSync(full);
  if (!stats.isFile()) {
    return null;
  }
  return {
    content: readFileSync(full),
    mimeType: mimeTypeFor(relPath),
  };
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
  const full = resolveSlotPath(slotId, relPath);
  if (!full) {
    return { ok: false, error: "Invalid path." };
  }
  if (!existsSync(full)) {
    return { ok: false, error: "That file no longer exists." };
  }
  try {
    const stats = statSync(full);
    rmSync(full, { recursive: true, force: true });
    return { ok: true, type: stats.isDirectory() ? "folder" : "file" };
  } catch (err) {
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
  const base = slotDir(slotId);
  if (!existsSync(base)) {
    return { ok: true, deleted: 0 };
  }
  let deleted = 0;
  try {
    for (const child of readdirSync(base)) {
      rmSync(path.join(base, child), { recursive: true, force: true });
      deleted += 1;
    }
    return { ok: true, deleted };
  } catch (err) {
    return {
      ok: false,
      deleted,
      error: err instanceof Error ? err.message : "Couldn't empty that box.",
    };
  }
}
