import Link from "next/link";
import { type UploadSlot } from "@/lib/upload-slots";
import { allSlots } from "@/lib/card-slots";
import {
  listSlotEntries,
  type SlotEntry,
} from "@/lib/uploads";
import EntryRow from "@/app/ui-upload/entry-row";
import LiveRefresh from "@/app/ui-upload/live-refresh";

function RobotWaving({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 260" className={className} fill="none">
      <rect x="30" y="20" width="120" height="130" rx="28" fill="#A8DDE8" stroke="#2B5566" strokeWidth="4" />
      <circle cx="70" cy="75" r="12" fill="#fff" stroke="#2B5566" strokeWidth="3" />
      <circle cx="70" cy="75" r="4" fill="#2B5566" />
      <circle cx="112" cy="75" r="12" fill="#fff" stroke="#2B5566" strokeWidth="3" />
      <circle cx="112" cy="75" r="4" fill="#2B5566" />
      <path d="M75 108 Q91 118 107 108" stroke="#2B5566" strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect x="70" y="150" width="42" height="60" rx="14" fill="#A8DDE8" stroke="#2B5566" strokeWidth="4" />
      <rect x="60" y="205" width="20" height="45" rx="8" fill="#A8DDE8" stroke="#2B5566" strokeWidth="4" />
      <rect x="102" y="205" width="20" height="45" rx="8" fill="#A8DDE8" stroke="#2B5566" strokeWidth="4" />
      <path d="M40 100 Q10 80 20 45" stroke="#2B5566" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="42" r="7" fill="#A8DDE8" stroke="#2B5566" strokeWidth="4" />
    </svg>
  );
}

function RobotBox({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 260" className={className} fill="none">
      <rect x="70" y="20" width="120" height="130" rx="28" fill="#A8DDE8" stroke="#2B5566" strokeWidth="4" />
      <circle cx="112" cy="75" r="12" fill="#fff" stroke="#2B5566" strokeWidth="3" />
      <circle cx="112" cy="75" r="4" fill="#2B5566" />
      <circle cx="152" cy="75" r="12" fill="#fff" stroke="#2B5566" strokeWidth="3" />
      <circle cx="152" cy="75" r="4" fill="#2B5566" />
      <path d="M117 108 Q131 116 145 108" stroke="#2B5566" strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect x="112" y="150" width="42" height="60" rx="14" fill="#A8DDE8" stroke="#2B5566" strokeWidth="4" />
      <rect x="102" y="205" width="20" height="45" rx="8" fill="#A8DDE8" stroke="#2B5566" strokeWidth="4" />
      <rect x="144" y="205" width="20" height="45" rx="8" fill="#A8DDE8" stroke="#2B5566" strokeWidth="4" />
      <path d="M78 105 L40 130 L20 105 L58 82 Z" fill="#F7941D" stroke="#2B5566" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

function RobotDelivery({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 320" className={className} fill="none">
      <path d="M170 40 L190 15 M195 25 L215 20" stroke="#2B5566" strokeWidth="6" strokeLinecap="round" />
      <rect x="90" y="50" width="130" height="145" rx="30" fill="#A8DDE8" stroke="#2B5566" strokeWidth="5" />
      <circle cx="90" cy="115" r="14" fill="#fff" stroke="#2B5566" strokeWidth="4" />
      <circle cx="90" cy="115" r="5" fill="#2B5566" />
      <path d="M135 108 Q150 118 165 108" stroke="#2B5566" strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="135" y="195" width="46" height="65" rx="16" fill="#A8DDE8" stroke="#2B5566" strokeWidth="5" />
      <rect x="122" y="260" width="24" height="50" rx="9" fill="#A8DDE8" stroke="#2B5566" strokeWidth="5" />
      <rect x="170" y="260" width="24" height="50" rx="9" fill="#A8DDE8" stroke="#2B5566" strokeWidth="5" />
      <path d="M95 150 L35 175 L55 210 L110 185 Z" fill="#F7941D" stroke="#2B5566" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  );
}

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
    <div className="rounded-2xl border-2 border-[var(--color-orange-deep)] bg-[var(--color-yellow)]/70 p-5 text-center">
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
    <div className="mx-auto max-w-4xl rounded-full border-2 border-[var(--color-orange-deep)] bg-[var(--color-cream)] py-2 text-center">
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
        <Link href="/" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
          Page 1
        </Link>
        <Link href="/login" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
          Page 2
        </Link>
        <span className="font-bold text-[var(--color-ink)]">Page 3</span>
        <Link href="/admin" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
          Page 4
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 pb-10 pt-8 text-center">
        <p className="display text-sm font-semibold text-[var(--color-orange-deep)]">
          Discover some UI design !!
        </p>
        <h1 className="display mt-2 text-4xl font-extrabold text-[var(--color-orange)] sm:text-5xl">
          Welcome !!
        </h1>
        <div className="mt-6 flex items-end justify-center gap-4">
          <RobotWaving className="h-28 w-auto" />
          <RobotBox className="h-28 w-auto" />
        </div>
      </section>

      {/* New UI uploaded */}
      <section className="bg-[var(--color-yellow)] px-6 py-10">
        <SectionBanner>New UI uploaded</SectionBanner>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 items-start gap-6 sm:grid-cols-3">
          {newUploadCards.map((card) => (
            <FolderCard key={card.slot.id} card={card} />
          ))}
        </div>
      </section>

      {/* Apps UI design */}
      <section className="bg-[var(--color-orange)] px-6 py-10">
        <SectionBanner>Apps UI design</SectionBanner>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 items-start gap-6 sm:grid-cols-3">
          {appsUiCards.map((card) => (
            <FolderCard key={card.slot.id} card={card} />
          ))}
        </div>
      </section>

      {/* Feedback */}
      <section className="bg-[var(--color-cream)] px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="display inline-block rounded-full border-2 border-[var(--color-orange-deep)] px-6 py-2 text-lg font-bold text-[var(--color-orange-deep)]">
            Feedback
          </h2>
          <p className="mt-3 text-xs text-[var(--color-ink-soft)]">
            Let me know what you think of these files, or what you&rsquo;d like
            to see next.
          </p>
          <textarea
            rows={4}
            placeholder="Type your feedback here…"
            className="mt-4 w-full rounded-2xl border-2 border-[var(--color-orange-deep)] bg-transparent px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus-visible:border-[var(--color-orange)]"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-orange-deep)] px-6 py-14 text-[var(--color-cream)]">
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <RobotDelivery className="mx-auto h-48 w-auto" />
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
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-cream)] text-[var(--color-orange-deep)] transition hover:bg-[var(--color-yellow)]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}