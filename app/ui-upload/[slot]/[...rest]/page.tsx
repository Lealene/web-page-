import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  listSlotEntries,
  type SlotEntry,
} from "@/lib/uploads";
import {
  SESSION_COOKIE_NAME,
  readSessionToken,
} from "@/lib/session";
import { isKnownUploadSlot } from "@/lib/card-slots";
import EntryRow from "@/app/ui-upload/entry-row";
import LiveRefresh from "@/app/ui-upload/live-refresh";

export const dynamic = "force-dynamic";

export default async function FolderViewPage({
  params,
}: {
  params: Promise<{ slot: string; rest: string[] }>;
}) {
  const { slot, rest } = await params;
  const relPath = rest?.join("/") ?? "";
  if (!isKnownUploadSlot(slot)) {
    notFound();
  }

  const cookieStore = await cookies();
  const session = readSessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value
  );
  const canDelete = session?.role === "admin";

  const entries = listSlotEntries(slot, relPath);
  const folderCount = entries.filter((e) => e.type === "folder").length;
  const fileCount = entries.filter((e) => e.type === "file").length;

  const parentPath = rest?.slice(0, -1) ?? [];
  const backHref =
    parentPath.length > 0
      ? `/ui-upload/${slot}/${parentPath.map(encodeURIComponent).join("/")}`
      : `/ui-upload`;

  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      <LiveRefresh />
      <header className="flex items-center border-b-2 border-[var(--color-ink)]/10 bg-[var(--color-yellow)] px-6 py-3 text-sm">
        <Link
          href={backHref}
          className="rounded-full bg-[var(--color-cream)] px-4 py-1.5 font-bold text-[var(--color-orange-deep)] shadow-[0_2px_0_0_var(--color-orange-deep)] transition hover:-translate-y-0.5"
        >
          ← Back
        </Link>
        <p className="ml-4 truncate font-semibold text-[var(--color-orange-deep)]">
          {slot} / {relPath}
        </p>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="display text-center text-3xl font-extrabold text-[var(--color-orange)]">
            {relPath}
          </h1>
          <p className="mt-2 text-center text-xs text-[var(--color-ink-soft)]">
            {fileCount} file{fileCount === 1 ? "" : "s"} · {folderCount} folder
            {folderCount === 1 ? "" : "s"}
          </p>

          {entries.length === 0 ? (
            <div className="mt-10 rounded-2xl border-2 border-dashed border-[var(--color-orange-deep)] bg-[var(--color-yellow)]/40 p-10 text-center text-sm text-[var(--color-orange-deep)]">
              This folder is empty.
            </div>
          ) : (
            <ul className="mt-10 space-y-3">
              {entries.map((entry) => (
                <EntryRow
                  key={entry.relPath}
                  slot={slot}
                  entry={entry}
                  canDelete={canDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}