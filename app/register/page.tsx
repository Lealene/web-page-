"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Robot3D from "@/components/robot-3d";
import ScrollReveal from "@/components/scroll-reveal";

function Logo() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8 rounded-full" aria-hidden>
      <circle cx="20" cy="20" r="20" fill="#7EC8E3" />
      <path d="M0 26c6-6 12-2 18-6s14-2 22 2v18H0z" fill="#8CC152" />
      <circle cx="14" cy="12" r="6" fill="#FFF7DC" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#1877F2">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.1C16.5 3 15.5 3 14.3 3c-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.2h2.7V21z"
        fill="#fff"
      />
    </svg>
  );
}

function IconWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#25D366">
      <circle cx="12" cy="12" r="12" fill="#fff" />
      <path
        d="M12 3.5A8.4 8.4 0 0 0 4.9 16l-1 3.5 3.6-1a8.4 8.4 0 1 0 4.5-15zM12 19a6.8 6.8 0 0 1-3.5-1l-.25-.15-2.1.55.56-2-.16-.26A6.8 6.8 0 1 1 12 19zm3.9-5.1c-.2-.1-1.2-.6-1.4-.65-.19-.07-.33-.1-.46.1-.14.2-.53.65-.65.78-.12.14-.24.15-.44.05-.2-.1-.86-.32-1.63-1-.6-.54-1-1.2-1.13-1.4-.12-.2-.01-.32.09-.42.1-.1.2-.24.3-.36.1-.12.14-.2.2-.34.07-.14.03-.26-.02-.36-.05-.1-.46-1.1-.63-1.5-.16-.4-.34-.34-.46-.35h-.4c-.14 0-.36.05-.55.26-.19.2-.72.7-.72 1.7s.74 1.98.84 2.11c.1.14 1.46 2.23 3.54 3.13.5.2.88.33 1.18.42.5.16.94.14 1.3.08.4-.06 1.2-.5 1.37-.98.17-.48.17-.9.12-.98-.05-.09-.18-.14-.38-.24z"
        fill="#25D366"
      />
    </svg>
  );
}

function IconGmail() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <rect x="1" y="4" width="22" height="16" rx="2.5" fill="#fff" stroke="#e0e0e0" />
      <path d="M2 6l10 7 10-7" stroke="#EA4335" strokeWidth="1.6" fill="none" />
      <path d="M2 6v12h4V9z" fill="#4285F4" />
      <path d="M22 6v12h-4V9z" fill="#34A853" />
      <path d="M2 6l10 7 10-7" fill="none" stroke="#FBBC05" strokeWidth="0" />
    </svg>
  );
}

function SocialLink({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="btn-pop flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-yellow)]"
    >
      {children}
    </a>
  );
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !repeatPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, "repeat-password": repeatPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message ?? "Couldn't create your account. Please try again."
        );
      }

      const data = await res.json().catch(() => null);
      window.location.href = data?.redirect ?? "/ui-upload";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-cream)]">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b-2 border-[var(--color-ink)]/20 bg-[var(--color-yellow)] px-6 py-3">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 text-xs">
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
        </nav>
      </header>

      {/* Register card */}
      <div className="bg-aurora flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md text-center">
          <ScrollReveal direction="scale">
            <h1 className="display text-5xl font-extrabold text-[var(--color-orange)] sm:text-6xl">
              Hi, welcome
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="glass-card mx-auto mt-8 w-full max-w-md rounded-3xl border-2 border-[var(--color-orange)] bg-[var(--color-cream)]/80 px-8 py-8 text-left shadow-sm sm:px-10"
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold uppercase tracking-wide text-[var(--color-orange-deep)]"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-full border-2 border-[var(--color-orange)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus-visible:border-[var(--color-orange-deep)] focus-visible:shadow-[0_0_0_4px_rgba(247,148,29,0.25)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold uppercase tracking-wide text-[var(--color-orange-deep)]"
                  >
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-full border-2 border-[var(--color-orange)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus-visible:border-[var(--color-orange-deep)] focus-visible:shadow-[0_0_0_4px_rgba(247,148,29,0.25)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-wide text-[var(--color-orange-deep)]"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-full border-2 border-[var(--color-orange)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus-visible:border-[var(--color-orange-deep)] focus-visible:shadow-[0_0_0_4px_rgba(247,148,29,0.25)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="repeatPassword"
                    className="block text-xs font-bold uppercase tracking-wide text-[var(--color-orange-deep)]"
                  >
                    Repeat password
                  </label>
                  <input
                    id="repeatPassword"
                    type="password"
                    autoComplete="new-password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-full border-2 border-[var(--color-orange)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus-visible:border-[var(--color-orange-deep)] focus-visible:shadow-[0_0_0_4px_rgba(247,148,29,0.25)]"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-4 text-center text-xs font-semibold text-[#b3261e]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-pop mx-auto mt-6 block rounded-full bg-[var(--color-yellow)] px-12 py-3 text-base font-extrabold text-[var(--color-orange-deep)] shadow-[0_3px_0_0_var(--color-orange)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Registering…" : "Register"}
              </button>

              <p className="mt-5 text-center text-sm text-[var(--color-ink-soft)]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[var(--color-orange-deep)] underline-offset-2 hover:underline"
                >
                  Log in
                </Link>
              </p>

              <p className="mt-5 text-center text-sm font-semibold text-[var(--color-orange-deep)]">
                Login with
              </p>

              <div className="mt-3 flex items-center justify-center gap-5">
                <a href="#" aria-label="Continue with Facebook" className="btn-pop">
                  <IconFacebook />
                </a>
                <a href="#" aria-label="Continue with WhatsApp" className="btn-pop">
                  <IconWhatsapp />
                </a>
                <a href="#" aria-label="Continue with Gmail" className="btn-pop">
                  <IconGmail />
                </a>
              </div>

              <Robot3D pose="thumbsup" className="mx-auto mt-4 h-24 w-auto sm:h-28" />

              {submitting && (
                <p
                  className="mt-2 text-center text-[10px] font-semibold tracking-wide text-[var(--color-orange-deep)]"
                  aria-live="polite"
                >
                  Loading account, please wait…
                </p>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>

      {/* Footer / contact */}
      <footer id="contact" className="bg-[var(--color-orange-deep)] text-[var(--color-cream)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-16">
          <ScrollReveal direction="left">
            <Robot3D pose="delivery" className="mx-auto h-40 w-auto md:h-56" />
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div>
              <p className="text-sm font-semibold tracking-wide text-[var(--color-yellow)]">
                Thanks for stopping by
              </p>

              <h3 className="display mt-4 text-lg font-bold">Main office</h3>
              <address className="mt-2 space-y-1 text-sm not-italic text-[#ffe9c2]">
                <p>Mulawin St. 5, Cupang Pandi, Bulacan</p>
                <p>Phone: 0955 776 908</p>
                <p>Email: lealenefajardo20@gmail.com</p>
              </address>

              <h3 className="display mt-6 text-lg font-bold">Get social</h3>
              <div className="mt-3 flex gap-3">
                <SocialLink label="Facebook">
                  <IconFacebook />
                </SocialLink>
                <SocialLink label="WhatsApp">
                  <IconWhatsapp />
                </SocialLink>
                <SocialLink label="Gmail">
                  <IconGmail />
                </SocialLink>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </main>
  );
}
