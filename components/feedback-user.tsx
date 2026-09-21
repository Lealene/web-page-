"use client";

import { useEffect, useState } from "react";

type FeedbackEntry = {
  id: string;
  message: string;
  authorName: string | null;
  authorEmail: string | null;
  type: "feedback" | "quote";
  pinned: boolean;
  createdAt: string;
};

export default function FeedbackUser({ compact = false }: { compact?: boolean }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"feedback" | "quote">("feedback");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  async function load() {
    try {
      setLoadingList(true);
      const res = await fetch("/api/feedback", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { entries: FeedbackEntry[] };
      setEntries(data.entries ?? []);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOkMsg(null);
    if (!message.trim()) {
      setError("Please write your message.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), name: name.trim() || undefined, type }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.message ?? "Couldn't post your comment.");
      }
      const d = (await res.json()) as { entry: FeedbackEntry };
      setMessage("");
      setOkMsg(type === "quote" ? "Quote request sent! Admin will review it soon." : "Thanks for your feedback!");
      setEntries((prev) => [d.entry, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={compact ? "" : "mx-auto max-w-4xl"}>
      {!compact && (
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="display inline-block rounded-full border-2 border-[var(--color-orange-deep)] px-6 py-2 text-lg font-bold text-[var(--color-orange-deep)]">
            Customer feedback & request a quote
          </h2>
          <span className="rounded-full bg-[var(--color-yellow)] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-orange-deep)]">
            Comments are posted & admin-pinned
          </span>
        </div>
      )}
      {compact && (
        <h3 className="display text-base font-bold text-[var(--color-orange-deep)]">Leave a comment</h3>
      )}
      <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-soft)]">
        Share your thoughts or request a quote — your comment will be posted immediately and highlighted by admin when pinned.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-[var(--color-orange-deep)]">
            <input type="radio" name="fb-type" checked={type === "feedback"} onChange={() => setType("feedback")} />
            Feedback
          </label>
          <label className="flex items-center gap-2 text-[var(--color-orange-deep)] text-xs font-bold">
            <input type="radio" name="fb-type" checked={type === "quote"} onChange={() => setType("quote")} />
            Request a quote
          </label>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full rounded-2xl border-2 border-[var(--color-orange-deep)]/40 bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus-visible:border-[var(--color-orange)] focus-visible:shadow-[0_0_0_4px_rgba(247,148,29,0.25)]"
        />

        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={type === "quote" ? "Describe what you need a quote for…" : "Type your feedback or comment here…"}
          className="w-full rounded-2xl border-2 border-[var(--color-orange-deep)] bg-transparent px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus-visible:border-[var(--color-orange)] focus-visible:shadow-[0_0_0_4px_rgba(247,148,29,0.25)]"
        />

        {error && <p className="text-xs font-semibold text-[#b3261e]">{error}</p>}
        {okMsg && <p className="text-xs font-semibold text-emerald-700">{okMsg}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="btn-pop rounded-full bg-[var(--color-orange-deep)] px-7 py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_0_var(--color-orange)] disabled:opacity-60"
        >
          {submitting ? "Posting…" : type === "quote" ? "Request quote" : "Post comment"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="display text-sm font-bold text-[var(--color-ink)]">
          {entries.length === 0 ? "No comments yet" : `Community posts (${entries.length})`}
        </h3>
        <p className="mt-1 text-[11px] text-[var(--color-ink-soft)]">Pinned posts appear first. Admin highlights the best ones.</p>

        {loadingList ? (
          <p className="mt-4 text-xs text-[var(--color-ink-soft)]">Loading comments…</p>
        ) : entries.length === 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-[var(--color-orange-deep)]/30 bg-[var(--color-yellow)]/20 p-8 text-center text-sm text-[var(--color-ink-soft)]">
            Be the first to leave a comment!
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {entries.slice(0, 20).map((fb) => (
              <li
                key={fb.id}
                className={`glass-card rounded-2xl border-2 p-4 text-left ${
                  fb.pinned ? "border-[var(--color-orange-deep)] bg-[var(--color-yellow)]/40" : "border-white/50 bg-white/40"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {fb.pinned && (
                    <span className="rounded-full bg-[var(--color-orange-deep)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      📌 Pinned by admin
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
                    {fb.authorName ?? "Anonymous"} · {new Date(fb.createdAt).toLocaleDateString()} {new Date(fb.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ink)]">{fb.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
