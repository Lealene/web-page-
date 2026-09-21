"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { notifyUploadsChanged } from "@/app/ui-upload/live-refresh";
import Robot3D from "@/components/robot-3d";
import ScrollReveal from "@/components/scroll-reveal";

type StoredEntry = {
  type: "folder" | "file";
  name: string;
  relPath: string;
  url: string;
};

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.1C16.5 3 15.5 3 14.3 3c-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.2h2.7V21z" />
    </svg>
  );
}
function IconTwitter() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.7A11.5 11.5 0 0 1 3.6 4.6a4 4 0 0 0 1.3 5.4c-.6 0-1.3-.2-1.8-.5v.1a4.1 4.1 0 0 0 3.3 4 4 4 0 0 1-1.8.1 4.1 4.1 0 0 0 3.8 2.9A8.2 8.2 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.6-6.4 11.6-11.9v-.5c.8-.6 1.5-1.3 2.1-2z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.1" />
    </svg>
  );
}

type UploadSlot = { id: string; label: string };
type StagedItem = { file: File; relPath: string };

const newUploadSlots: UploadSlot[] = [
  { id: "new-page", label: "New page" },
  { id: "login-page-file", label: "Login page file" },
  { id: "sheet-page", label: "Sheet page" },
];

const appsUiSlots: UploadSlot[] = [
  { id: "apps-page", label: "Apps page" },
  { id: "apps-login-page-file", label: "Login page file" },
  { id: "apps-sheet-page", label: "Sheet page" },
];

const fixedSlotIds = [
  ...newUploadSlots.map((s) => s.id),
  ...appsUiSlots.map((s) => s.id),
];

const placeholderSlotIds = ["new-page", "apps-page"];

function relPathsOf(files: File[]): string[] {
  return files.map(
    (f) =>
      (f as File & { webkitRelativePath?: string }).webkitRelativePath ||
      f.name
  );
}

function UploadCard({
  slot,
  stored,
  uploading,
  onUpload,
  onDelete,
  onDeleteAll,
  deleting,
  deletingAll,
}: {
  slot: UploadSlot;
  stored: StoredEntry[];
  uploading: boolean;
  onUpload: (added: StagedItem[]) => void;
  onDelete: (entry: StoredEntry) => void;
  onDeleteAll: () => void;
  deleting: string | null;
  deletingAll: boolean;
}) {
  const fileInputId = `file-${slot.id}`;
  const folderInputId = `folder-${slot.id}`;

  function addFromInput(input: HTMLInputElement | null, folderMode: boolean) {
    const picked = input?.files ? Array.from(input.files) : [];
    if (picked.length === 0 || uploading) return;
    const relPaths = folderMode ? relPathsOf(picked) : picked.map((f) => f.name);
    onUpload(picked.map((file, i) => ({ file, relPath: relPaths[i] })));
    if (input) input.value = "";
  }

  return (
    <div className="glass-card rounded-2xl border-2 border-white/40 bg-[var(--color-orange-deep)]/40 p-5 text-center">
      <h3 className="display text-sm font-bold text-[var(--color-cream)]">
        {slot.label}
      </h3>
      <p className="mt-4 text-[11px] leading-relaxed text-[var(--color-cream)]/90">
        This admin panel allows uploading files
        <br />
        Multiple formats supported
        <br />
        Max 10&nbsp;MB per file
      </p>

      {stored.length > 0 && (
        <div className="mt-4 rounded-xl border border-[var(--color-cream)]/30 bg-[var(--color-cream)]/10 p-3 text-left">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-yellow)]">
            Stored here
          </p>
          <ul className="mt-2 space-y-1.5">
            {stored.slice(0, 6).map((entry) => (
              <li key={entry.relPath} className="flex items-center justify-between gap-2">
                <span
                  className="truncate text-[11px] font-semibold text-[var(--color-cream)]"
                  title={entry.relPath}
                >
                  {entry.type === "folder" ? "📁" : "📄"} {entry.relPath}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(entry)}
                  disabled={deleting === entry.relPath}
                  className="btn-pop shrink-0 rounded-full bg-[#b3261e] px-2.5 py-0.5 text-[10px] font-bold text-white disabled:opacity-50"
                >
                  {deleting === entry.relPath ? "…" : "Delete"}
                </button>
              </li>
            ))}
          </ul>
          {stored.length > 6 && (
            <p className="mt-1.5 text-center text-[10px] text-[var(--color-cream)]/70">
              +{stored.length - 6} more
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-2">
        <label
          htmlFor={fileInputId}
          className="btn-pop cursor-pointer rounded-full bg-[var(--color-yellow)] px-4 py-1.5 text-xs font-bold text-[var(--color-orange-deep)] shadow-[0_3px_0_0_rgba(0,0,0,0.15)]"
        >
          {uploading ? "Uploading…" : "Add file"}
        </label>
        <input id={fileInputId} type="file" multiple className="sr-only" onChange={(e) => addFromInput(e.target, false)} />

        <label
          htmlFor={folderInputId}
          className="btn-pop cursor-pointer rounded-full border-2 border-[var(--color-yellow)] px-4 py-1.5 text-xs font-bold text-[var(--color-yellow)]"
        >
          Upload folder
        </label>
        <input
          id={folderInputId}
          type="file"
          multiple
          className="sr-only"
          {...({ webkitdirectory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
          onChange={(e) => addFromInput(e.target, true)}
        />

        <button
          type="button"
          onClick={onDeleteAll}
          disabled={deletingAll}
          className="btn-pop shrink-0 rounded-full bg-[#b3261e] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-50"
        >
          {deletingAll ? "…" : "Delete all"}
        </button>
      </div>
    </div>
  );
}

function SectionBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-card mx-auto max-w-4xl rounded-full border-2 border-[var(--color-cream)] bg-[var(--color-orange-deep)] py-2 text-center">
      <span className="display text-sm font-bold tracking-wide text-[var(--color-cream)]">
        {children}
      </span>
    </div>
  );
}

type FeedbackEntry = {
  id: string;
  message: string;
  authorName: string | null;
  authorEmail: string | null;
  type: "feedback" | "quote";
  pinned: boolean;
  createdAt: string;
};

export default function AdminPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [stored, setStored] = useState<Record<string, StoredEntry[]>>({});
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState<string | null>(null);
  const [removedSlots, setRemovedSlots] = useState<string[]>([]);
  const [newSection, setNewSection] = useState<UploadSlot[]>(newUploadSlots);
  const [appsSection, setAppsSection] = useState<UploadSlot[]>(appsUiSlots);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [cardSection, setCardSection] = useState<"new" | "apps">("new");
  const [creatingCard, setCreatingCard] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [fbLoading, setFbLoading] = useState(true);

  const loadStored = useCallback(async () => {
    try {
      const res = await fetch("/api/cards", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as {
        slots: { newSection: UploadSlot[]; appsSection: UploadSlot[] };
        folders: Record<string, StoredEntry[]>;
      };
      setNewSection(data.slots?.newSection ?? newUploadSlots);
      setAppsSection(data.slots?.appsSection ?? appsUiSlots);
      setStored(data.folders ?? {});
    } catch {
      // ignore — panel still works for uploads
    }
  }, []);

  const loadFeedbacks = useCallback(async () => {
    try {
      setFbLoading(true);
      const res = await fetch("/api/feedback", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { entries: FeedbackEntry[] };
      setFeedbacks(data.entries ?? []);
    } finally {
      setFbLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStored();
  }, [loadStored]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  async function handleTogglePin(id: string) {
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.message ?? "Couldn't update pin.");
      }
      const d = (await res.json()) as { entry: FeedbackEntry };
      setFeedbacks((prev) => {
        const next = prev.map((f) => (f.id === id ? d.entry : f));
        return next.sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      });
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Pin failed.");
    }
  }

  async function handleDeleteFeedback(id: string) {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`/api/feedback?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.message ?? "Couldn't delete.");
      }
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      setStatus("Comment deleted.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  async function handleUpload(slotId: string, added: StagedItem[]) {
    if (added.length === 0) return;
    setUploadingSlot(slotId);
    setStatus(null);
    try {
      const form = new FormData();
      added.forEach((item) => form.append(slotId, item.file));
      form.append(`paths-${slotId}`, JSON.stringify(added.map((item) => item.relPath)));
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Upload failed. Please try again.");
      }
      setStatus(`Uploaded ${added.length} file(s).`);
      await loadStored();
      notifyUploadsChanged();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingSlot(null);
    }
  }

  async function handleDelete(entry: StoredEntry, slotId: string) {
    const key = `${slotId}/${entry.relPath}`;
    setDeleting(key);
    try {
      const res = await fetch(
        `/api/files?slot=${encodeURIComponent(slotId)}&path=${encodeURIComponent(entry.relPath)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Couldn't delete that file.");
      }
      setStatus(`Deleted ${entry.type === "folder" ? "folder" : "file"}: ${entry.relPath}`);
      setStored((prev) => ({
        ...prev,
        [slotId]: (prev[slotId] ?? []).filter(
          (e) => e.relPath !== entry.relPath && !e.relPath.startsWith(`${entry.relPath}/`)
        ),
      }));
      notifyUploadsChanged();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDeleting(null);
    }
  }

  async function handleDeleteAll(slotId: string) {
    const isCustom =
      [...newSection, ...appsSection].some((s) => s.id === slotId) && !fixedSlotIds.includes(slotId);

    if (
      !window.confirm(
        isCustom ? "Delete this entire page/card? This can't be undone." : "Delete this entire box? This can't be undone."
      )
    ) {
      return;
    }
    setDeletingAll(slotId);
    try {
      if (isCustom) {
        const res = await fetch(`/api/cards?id=${encodeURIComponent(slotId)}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message ?? "Couldn't delete this card.");
        }
        setNewSection((prev) => prev.filter((s) => s.id !== slotId));
        setAppsSection((prev) => prev.filter((s) => s.id !== slotId));
      } else {
        const res = await fetch(`/api/files?slot=${encodeURIComponent(slotId)}&all=1`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message ?? "Couldn't empty this box.");
        }
        setRemovedSlots((prev) => [...prev, slotId]);
        setStored((prev) => ({ ...prev, [slotId]: [] }));
      }
      setStatus(isCustom ? "Page/card deleted." : "Box deleted.");
      notifyUploadsChanged();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDeletingAll(null);
    }
  }

  async function handleCreateCard() {
    const title = cardTitle.trim();
    if (!title) {
      setStatus("Please enter a title for the new page.");
      return;
    }
    setCreatingCard(true);
    setStatus(null);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: title, section: cardSection }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Couldn't create the page.");
      }
      const data = (await res.json()) as { card: UploadSlot };
      if (cardSection === "apps") {
        setAppsSection((prev) => [...prev, data.card]);
        setStored((prev) => ({ ...prev, [data.card.id]: [] }));
      } else {
        setNewSection((prev) => [...prev, data.card]);
        setStored((prev) => ({ ...prev, [data.card.id]: [] }));
      }
      setCardTitle("");
      setShowCardModal(false);
      setStatus(`Created "${data.card.label}".`);
      notifyUploadsChanged();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCreatingCard(false);
    }
  }

  async function handleFinishCreateCard() {
    await handleCreateCard();
  }

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-orange)]">
      {/* Top bar */}
      <header className="flex items-center justify-end gap-6 border-b-2 border-[var(--color-cream)]/20 bg-[var(--color-yellow)] px-6 py-2 text-xs">
        <Link href="/" className="font-semibold text-[var(--color-ink-soft)] transition hover:text-[var(--color-ink)]">
          Home
        </Link>
        <a href="#contact" className="font-semibold text-[var(--color-ink-soft)] transition hover:text-[var(--color-ink)]">
          Contact
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-pop rounded-full bg-[var(--color-orange-deep)] px-4 py-1.5 font-bold text-white"
        >
          Logout
        </button>
      </header>

      {/* Hero */}
      <section className="bg-aurora relative overflow-hidden px-6 pb-14 pt-10 text-center">
        <ScrollReveal direction="scale">
          <p className="display text-sm font-semibold text-[var(--color-orange-deep)]">Admin page</p>
          <h1 className="display mt-2 text-4xl font-extrabold text-[var(--color-orange)] sm:text-5xl">
            Welcome !!
          </h1>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={150}>
          <div className="mt-8 flex items-end justify-center gap-6">
            <Robot3D pose="wave" className="h-32 w-auto sm:h-36" />
            <Robot3D pose="box" className="h-32 w-auto sm:h-36" />
          </div>
        </ScrollReveal>
      </section>

      {/* New UI uploaded */}
      <section className="px-6 py-14">
        <ScrollReveal direction="up">
          <SectionBanner>New UI uploaded</SectionBanner>
        </ScrollReveal>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 items-start gap-6 sm:grid-cols-3">
          {newSection
            .filter((slot) => !removedSlots.includes(slot.id) && !placeholderSlotIds.includes(slot.id))
            .map((slot, i) => (
              <ScrollReveal key={slot.id} direction="up" delay={i * 90}>
                <UploadCard
                  slot={slot}
                  stored={stored[slot.id] ?? []}
                  uploading={uploadingSlot === slot.id}
                  onUpload={(added) => handleUpload(slot.id, added)}
                  onDelete={(entry) => handleDelete(entry, slot.id)}
                  onDeleteAll={() => handleDeleteAll(slot.id)}
                  deleting={deleting}
                  deletingAll={deletingAll === slot.id}
                />
              </ScrollReveal>
            ))}
        </div>
      </section>

      {/* Apps UI design */}
      <section className="bg-[var(--color-orange-deep)]/20 px-6 py-14">
        <ScrollReveal direction="up">
          <SectionBanner>Apps UI design</SectionBanner>
        </ScrollReveal>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 items-start gap-6 sm:grid-cols-3">
          {appsSection
            .filter((slot) => !removedSlots.includes(slot.id) && !placeholderSlotIds.includes(slot.id))
            .map((slot, i) => (
              <ScrollReveal key={slot.id} direction="up" delay={i * 90}>
                <UploadCard
                  slot={slot}
                  stored={stored[slot.id] ?? []}
                  uploading={uploadingSlot === slot.id}
                  onUpload={(added) => handleUpload(slot.id, added)}
                  onDelete={(entry) => handleDelete(entry, slot.id)}
                  onDeleteAll={() => handleDeleteAll(slot.id)}
                  deleting={deleting}
                  deletingAll={deletingAll === slot.id}
                />
              </ScrollReveal>
            ))}
        </div>

        <ScrollReveal direction="scale">
          <div className="mx-auto mt-8 max-w-4xl text-center">
            <button
              type="button"
              onClick={() => setShowCardModal(true)}
              disabled={creatingCard}
              className="btn-pop rounded-full bg-[var(--color-yellow)] px-8 py-2.5 text-sm font-extrabold text-[var(--color-orange-deep)] shadow-[0_3px_0_0_var(--color-orange-deep)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingCard ? "Creating…" : "Upload files"}
            </button>
            {status && (
              <p className="mt-3 text-sm font-semibold text-[var(--color-cream)]">{status}</p>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Customer feedback & request quotes */}
      <section className="bg-[var(--color-cream)] px-6 py-14">
        <ScrollReveal direction="up" className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="display inline-block rounded-full border-2 border-[var(--color-orange-deep)] px-6 py-2 text-lg font-bold text-[var(--color-orange-deep)]">
              Customer feedback & request quotes
            </h2>
            <span className="rounded-full bg-[var(--color-yellow)] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-orange-deep)]">
              Posts from ui-upload
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-soft)]">
            Comments and quote requests posted on the ui-upload page appear here. Pin the best ones to highlight them for everyone — pinned posts stay at the top.
          </p>

          {fbLoading ? (
            <p className="mt-6 text-xs font-semibold text-[var(--color-ink-soft)]">Loading customer posts…</p>
          ) : feedbacks.length === 0 ? (
            <div className="mt-6 rounded-2xl border-2 border-dashed border-[var(--color-orange-deep)]/30 bg-[var(--color-yellow)]/15 p-8 text-center">
              <p className="text-sm font-semibold text-[var(--color-ink-soft)]">No customer posts yet.</p>
              <p className="mt-1 text-xs text-[var(--color-ink-soft)]">When someone comments on the ui-upload page, it will show up here.</p>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {feedbacks.map((fb) => (
                <li
                  key={fb.id}
                  className={`glass-card rounded-2xl border-2 p-4 text-left ${
                    fb.pinned ? "border-[var(--color-orange-deep)] bg-[var(--color-yellow)]/35" : "border-white/50 bg-white/50"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {fb.pinned && (
                      <span className="rounded-full bg-[var(--color-orange-deep)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        📌 Pinned
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        fb.type === "quote" ? "bg-[#1c2b30] text-[var(--color-yellow)]" : "bg-[var(--color-orange)] text-white"
                      }`}
                    >
                      {fb.type === "quote" ? "Quote request" : "Feedback"}
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--color-ink-soft)]">
                      {fb.authorName ?? "Anonymous"}
                      {fb.authorEmail ? ` · ${fb.authorEmail}` : ""} · {new Date(fb.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ink)]">{fb.message}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleTogglePin(fb.id)}
                      className="btn-pop rounded-full border-2 border-[var(--color-orange-deep)] px-4 py-1 text-xs font-bold text-[var(--color-orange-deep)]"
                    >
                      {fb.pinned ? "Unpin" : "Pin to top"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFeedback(fb.id)}
                      className="btn-pop rounded-full bg-[#b3261e] px-4 py-1 text-xs font-bold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[var(--color-orange-deep)] px-6 py-16 text-[var(--color-cream)]">
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <ScrollReveal direction="left">
            <Robot3D pose="delivery" className="mx-auto h-56 w-auto" />
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div>
              <p className="text-sm font-semibold text-[var(--color-yellow)]">Thank you for stopping by !!</p>
              <h3 className="display mt-4 text-base font-bold">Main office</h3>
              <address className="mt-2 space-y-1 text-sm not-italic text-[#ffe9c2]">
                <p>Mulawin St. 5, Cupang Pandi, Bulacan</p>
                <p>Phone: 0931 144 8575</p>
                <p>Email: lealenefajardo20@gmail.com</p>
              </address>
              <h3 className="display mt-6 text-base font-bold">Get social</h3>
              <div className="mt-3 flex gap-3">
                {[IconFacebook, IconTwitter, IconInstagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social link"
                    className="btn-pop flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-cream)] text-[var(--color-orange-deep)] hover:bg-[var(--color-yellow)]"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </footer>

      {showCardModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          style={{ animation: "aurora-drift 0.01s" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCardModal(false);
          }}
        >
          <div className="glass-card w-full max-w-md rounded-3xl border-2 border-[var(--color-orange-deep)] bg-[var(--color-cream)] p-6 text-center shadow-2xl">
            <h2 className="display text-xl font-extrabold text-[var(--color-orange)]">Create a new page</h2>
            <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
              Enter a title for your new page. It will appear as a new card.
            </p>

            <label htmlFor="new-card-title" className="mt-5 block text-left text-xs font-bold text-[var(--color-orange-deep)]">
              Page title
            </label>
            <input
              id="new-card-title"
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleFinishCreateCard();
              }}
              placeholder="My New Page"
              autoFocus
              className="mt-2 w-full rounded-2xl border-2 border-[var(--color-orange-deep)] bg-transparent px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus-visible:border-[var(--color-orange)] focus-visible:shadow-[0_0_0_4px_rgba(247,148,29,0.25)]"
            />

            <div className="mt-5 flex items-center justify-center gap-4 text-xs font-bold">
              <label className="flex items-center gap-2 text-[var(--color-orange-deep)]">
                <input
                  type="radio"
                  name="new-card-section"
                  value="new"
                  checked={cardSection === "new"}
                  onChange={() => setCardSection("new")}
                />
                New UI uploaded
              </label>
              <label className="flex items-center gap-2 text-[var(--color-orange-deep)]">
                <input
                  type="radio"
                  name="new-card-section"
                  value="apps"
                  checked={cardSection === "apps"}
                  onChange={() => setCardSection("apps")}
                />
                Apps UI design
              </label>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="btn-pop rounded-full border-2 border-[var(--color-orange-deep)] px-6 py-2 text-xs font-bold text-[var(--color-orange-deep)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinishCreateCard}
                disabled={creatingCard}
                className="btn-pop rounded-full bg-[var(--color-orange-deep)] px-6 py-2 text-xs font-bold text-[var(--color-cream)] shadow-[0_3px_0_0_var(--color-orange)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingCard ? "Working…" : "Finish / Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
