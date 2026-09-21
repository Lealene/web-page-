import Link from "next/link";
import { type UploadSlot } from "@/lib/upload-slots";
import { allSlots } from "@/lib/card-slots";
import { listSlotEntries, type SlotEntry } from "@/lib/uploads";
import EntryRow from "@/app/ui-upload/entry-row";
import LiveRefresh from "@/app/ui-upload/live-refresh";
import Robot3D from "@/components/robot-3d";
import ScrollReveal from "@/components/scroll-reveal";
import FeedbackUser from "@/components/feedback-user";

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

type FolderCard = {
  slot: UploadSlot;
  entries: SlotEntry[];
  canDelete: boolean;
};

function FolderCard({ card }: { card: FolderCard }) {
  const { slot, entries, canDelete } = card;
  const fileCount = entries.filter((e) => e.type === "file").length;
  const folderCount = entries.filter((e) => e.type === "folder").length;
  return (
    <div className="glass-card rounded-2xl border-2 border-[var(--color-orange-deep)] bg-[var(--color-yellow)]/70 p-5 text-center">
      <h3 className="display text-sm font-bold text-[var(--color-ink)]">
        {slot.label}
      </h3>
      {entries.length > 0 && (
        <>
          <ul className="mt-3 space-y-2">
            {entries.slice(0, 6).map((entry) => (
              <EntryRow
                key={entry.relPath}
                slot={slot.id}
                entry={entry}
                canDelete={canDelete}
              />
            ))}
            {entries.length > 6 && (
              <li className="text-[11px] font-semibold text-[var(--color-orange-deep)]">
                +{entries.length - 6} more
              </li>
            )}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-orange-deep)]">
            Browse all files inside
            <br />
            {fileCount} file{fileCount === 1 ? "" : "s"} · {folderCount} folder
            {folderCount === 1 ? "" : "s"} here
          </p>
        </>
      )}
    </div>
  );
}

function SectionBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-card mx-auto max-w-4xl rounded-full border-2 border-[var(--color-orange-deep)] bg-[var(--color-cream)] py-2 text-center">
      <span className="display text-sm font-bold tracking-wide text-[var(--color-orange-deep)]">
        {children}
      </span>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function UiUploadPage() {
  const slots = allSlots();

  const newUploadCards: FolderCard[] = slots.newSection
    .filter((slot) => slot.id !== "new-page")
    .map((slot) => ({
      slot,
      entries: listSlotEntries(slot.id),
      canDelete: false,
    }));

  const appsUiCards: FolderCard[] = slots.appsSection.map((slot) => ({
    slot,
    entries: listSlotEntries(slot.id),
    canDelete: false,
  }));

  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      <LiveRefresh />
      {/* Top bar */}
      <header className="flex items-center justify-end gap-6 border-b-2 border-[var(--color-ink)]/10 bg-[var(--color-yellow)] px-6 py-2 text-xs">
        <Link href="/" className="font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
          Home
        </Link>
        <a href="#contact" className="font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
          Contact
        </a>
        <a
          href="/api/logout"
          className="btn-pop rounded-full bg-[var(--color-orange-deep)] px-4 py-1.5 font-bold text-white"
        >
          Logout
        </a>
      </header>

      {/* Hero */}
      <section className="bg-aurora relative overflow-hidden px-6 pb-10 pt-8 text-center">
        <ScrollReveal direction="scale">
          <p className="display text-sm font-semibold text-[var(--color-orange-deep)]">
            Discover some UI design !!
          </p>
          <h1 className="display mt-2 text-4xl font-extrabold text-[var(--color-orange)] sm:text-5xl">
            Welcome !!
          </h1>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={150}>
          <div className="mt-6 flex items-end justify-center gap-4">
            <Robot3D pose="wave" className="h-28 w-auto" />
            <Robot3D pose="box" className="h-28 w-auto" />
          </div>
        </ScrollReveal>
      </section>

      {/* New UI uploaded */}
      <section className="bg-[var(--color-yellow)] px-6 py-10">
        <ScrollReveal direction="up">
          <SectionBanner>New UI uploaded</SectionBanner>
        </ScrollReveal>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 items-start gap-6 sm:grid-cols-3">
          {newUploadCards.map((card, i) => (
            <ScrollReveal key={card.slot.id} direction="up" delay={i * 90}>
              <FolderCard card={card} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Apps UI design */}
      <section className="bg-[var(--color-orange)] px-6 py-10">
        <ScrollReveal direction="up">
          <SectionBanner>Apps UI design</SectionBanner>
        </ScrollReveal>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 items-start gap-6 sm:grid-cols-3">
          {appsUiCards.map((card, i) => (
            <ScrollReveal key={card.slot.id} direction="up" delay={i * 90}>
              <FolderCard card={card} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Customer feedback & request quotes - comment posts */}
      <section className="bg-[var(--color-cream)] px-6 py-12">
        <ScrollReveal direction="up">
          <FeedbackUser />
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[var(--color-orange-deep)] px-6 py-14 text-[var(--color-cream)]">
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <ScrollReveal direction="left">
            <Robot3D pose="delivery" className="mx-auto h-48 w-auto" />
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div>
              <p className="text-sm font-semibold text-[var(--color-yellow)]">
                Thank you for stopping by !!
              </p>
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
    </main>
  );
}
