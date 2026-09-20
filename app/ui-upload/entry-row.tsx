"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SlotEntry } from "@/lib/uploads";
import { notifyUploadsChanged } from "@/app/ui-upload/live-refresh";

export default function EntryRow({
  slot,
  entry,
  canDelete,
}: {
  slot: string;
  entry: SlotEntry;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${entry.relPath}"? This can't be undone.`)) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/files?slot=${encodeURIComponent(slot)}&path=${encodeURIComponent(entry.relPath)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Couldn't delete that item.");
      }
      notifyUploadsChanged();
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDeleting(false);
    }
  }

  const linkClass =
    entry.type === "folder"
      ? "bg-[var(--color-orange)] text-[var(--color-ink)]"
      : "bg-[var(--color-yellow)] text-[var(--color-orange-deep)]";

  return (
    <li className="flex items-center gap-2">
      <Link
        href={entry.url}
        {...(entry.type === "file"
          ? { target: "_blank", rel: "noreferrer" }
          : {})}
        className={`inline-block flex-1 truncate rounded-full px-5 py-2 text-xs font-bold transition hover:-translate-y-0.5 ${linkClass}`}
        title={entry.relPath}
      >
        {entry.type === "folder" ? "Open folder — " : "Browse — "}
        {entry.name}
      </Link>
      {canDelete && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="shrink-0 rounded-full bg-[#b3261e] px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {deleting ? "…" : "Delete"}
        </button>
      )}
    </li>
  );
}