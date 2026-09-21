import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getWritableDataPath, getDataPathForRead } from "./data-dir";

export type FeedbackEntry = {
  id: string;
  message: string;
  authorName: string | null;
  authorEmail: string | null;
  type: "feedback" | "quote";
  pinned: boolean;
  createdAt: string;
};

function feedbackFileWritable(): string {
  return getWritableDataPath("feedback.json");
}

function feedbackFileForRead(): string {
  return getDataPathForRead("feedback.json");
}

function load(): FeedbackEntry[] {
  const file = feedbackFileForRead();
  if (!existsSync(file)) return [];
  try {
    const raw = readFileSync(file, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as FeedbackEntry[];
  } catch {
    return [];
  }
}

function save(entries: FeedbackEntry[]) {
  const file = feedbackFileWritable();
  try {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(entries, null, 2), "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "EROFS" || (err as Error)?.message?.includes("read-only")) {
      const fallback = path.join("/tmp", "data", "feedback.json");
      mkdirSync(path.dirname(fallback), { recursive: true });
      writeFileSync(fallback, JSON.stringify(entries, null, 2), "utf8");
    } else {
      throw err;
    }
  }
}

export function listFeedback(): FeedbackEntry[] {
  const entries = load();
  return entries.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function addFeedback(input: {
  message: string;
  authorName?: string | null;
  authorEmail?: string | null;
  type?: "feedback" | "quote";
}): FeedbackEntry {
  const msg = input.message.trim();
  if (!msg) throw new Error("Please write a message.");
  if (msg.length > 2000) throw new Error("Message is too long (max 2000 chars).");
  const entries = load();
  const entry: FeedbackEntry = {
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    message: msg,
    authorName: input.authorName?.trim() ? input.authorName.trim() : null,
    authorEmail: input.authorEmail?.trim() ? input.authorEmail.trim().toLowerCase() : null,
    type: input.type === "quote" ? "quote" : "feedback",
    pinned: false,
    createdAt: new Date().toISOString(),
  };
  entries.unshift(entry);
  save(entries);
  return entry;
}

export function togglePin(id: string): FeedbackEntry | null {
  const entries = load();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  entries[idx] = { ...entries[idx], pinned: !entries[idx].pinned };
  save(entries);
  return entries[idx];
}

export function deleteFeedback(id: string): boolean {
  const entries = load();
  const next = entries.filter((e) => e.id !== id);
  if (next.length === entries.length) return false;
  save(next);
  return true;
}
