import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import {
  isUploadSlot,
  NEW_UPLOAD_SLOTS,
  APPS_UI_SLOTS,
  type UploadSlot,
} from "./upload-slots";
import {
  getWritableDataPath,
  getDataPathForRead,
} from "./data-dir";

export type CardSection = "new" | "apps";

export interface CustomCard {
  id: string;
  label: string;
  section: CardSection;
  createdAt: string;
}

function cardsFileWritable(): string {
  return getWritableDataPath("cards.json");
}

function cardsFileForRead(): string {
  return getDataPathForRead("cards.json");
}

function loadCards(): CustomCard[] {
  const file = cardsFileForRead();
  if (!existsSync(file)) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
    return Array.isArray(parsed) ? (parsed as CustomCard[]) : [];
  } catch {
    return [];
  }
}

function saveCards(cards: CustomCard[]): void {
  const file = cardsFileWritable();
  try {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(cards, null, 2), "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "EROFS" || (err as Error)?.message?.includes("read-only")) {
      const fallback = path.join("/tmp", "data", "cards.json");
      mkdirSync(path.dirname(fallback), { recursive: true });
      writeFileSync(fallback, JSON.stringify(cards, null, 2), "utf8");
    } else {
      throw err;
    }
  }
}

export function listCustomCards(): CustomCard[] {
  return loadCards();
}

export function createCard(
  label: string,
  section: CardSection
): CustomCard {
  const trimmed = label.trim();
  if (!trimmed) {
    throw new Error("Please enter a title for the new page.");
  }
  const cards = loadCards();
  const card: CustomCard = {
    id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: trimmed,
    section,
    createdAt: new Date().toISOString(),
  };
  cards.push(card);
  saveCards(cards);
  return card;
}

export function deleteCard(id: string): boolean {
  const cards = loadCards();
  const next = cards.filter((c) => c.id !== id);
  if (next.length === cards.length) {
    return false;
  }
  saveCards(next);
  return true;
}

export function isCustomCard(id: string): boolean {
  return loadCards().some((c) => c.id === id);
}

export function allSlots(): {
  newSection: UploadSlot[];
  appsSection: UploadSlot[];
} {
  const custom = loadCards();
  return {
    newSection: [
      ...NEW_UPLOAD_SLOTS,
      ...custom
        .filter((c) => c.section === "new")
        .map((c) => ({ id: c.id, label: c.label })),
    ],
    appsSection: [
      ...APPS_UI_SLOTS,
      ...custom
        .filter((c) => c.section === "apps")
        .map((c) => ({ id: c.id, label: c.label })),
    ],
  };
}

export function isKnownUploadSlot(id: string): boolean {
  return isUploadSlot(id) || isCustomCard(id);
}