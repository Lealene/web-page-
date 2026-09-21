import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type FeedbackEntry = {
  id: string;
  message: string;
  authorName: string | null;
  authorEmail: string | null;
  type: "feedback" | "quote";
  pinned: boolean;
  createdAt: string;
};

const feedbackFile = path.join(process.cwd(), "data", "feedback.json");

function load(): FeedbackEntry[] {
  if (!existsSync(feedbackFile)) return [];
  try {
    const raw = readFileSync(feedbackFile, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as FeedbackEntry[];
  } catch {
    return [];
  }
}

function save(entries: FeedbackEntry[]) {
  mkdirSync(path.dirname(feedbackFile), { recursive: true });
  writeFileSync(feedbackFile, JSON.stringify(entries, null, 2), "utf8");
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
