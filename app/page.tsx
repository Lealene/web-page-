import Robot3D from "@/components/robot-3d";
import ScrollReveal from "@/components/scroll-reveal";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
      <path d="M5.5 10.2l3 3 6-6.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

const getStartedItems = [
  {
    title: "Thoughtfully designed",
    body:
      "Every component on this page was planned deliberately, from spacing to color, so the finished layout stays clear and easy to use.",
    icon: (
      <svg viewBox="0 0 60 60" className="h-14 w-14">
        <circle cx="30" cy="30" r="28" fill="#fff" stroke="#2B5566" strokeWidth="2" />
        <path d="M22 24q8-10 16 0" stroke="#2B5566" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="36" r="3" fill="#2B5566" />
      </svg>
    ),
  },
  {
    title: "Built for real projects",
    body:
      "This layout was made so designers and developers have a working reference to study, adapt, and build from — not just a picture to admire.",
    icon: (
      <svg viewBox="0 0 60 60" className="h-14 w-14">
        <rect x="12" y="16" width="36" height="26" rx="3" fill="#fff" stroke="#2B5566" strokeWidth="2" />
        <path d="M12 22h36" stroke="#2B5566" strokeWidth="2" />
        <circle cx="18" cy="19" r="1.4" fill="#2B5566" />
        <circle cx="23" cy="19" r="1.4" fill="#2B5566" />
      </svg>
    ),
  },
  {
    title: "A starting point, not a template",
    body:
      "Explore the code behind each section, then customize freely — colors, copy, and structure are all yours to make your own.",
    icon: (
      <svg viewBox="0 0 60 60" className="h-14 w-14">
        <path d="M20 14l-10 16 10 16M40 14l10 16-10 16" stroke="#2B5566" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const services = [
  {
    title: "Full site design",
    price: "From $1,000–$5,000",
    body: "A complete, ready-made site tailored to your business — no coding required on your end.",
    bullets: [
      "Skip the setup — get a finished, working website",
      "Scoped to your brand, content, and goals",
      "Message me to talk through packages and pricing",
    ],
    mascot: <Robot3D pose="box" className="h-32 w-32" />,
    featured: false,
  },
  {
    title: "Let's talk",
    price: "Send the details",
    body: "Tell me what you need and I'll get back to you with next steps.",
    bullets: [
      "0931 144 8575",
      "facebook.com/tennyyaang",
      "lealenefajardo20@gmail.com",
      "instagram.com/lle_fjrd",
    ],
    mascot: <Robot3D pose="thumbsup" className="h-32 w-32" />,
    featured: true,
  },
  {
    title: "Move only",
    price: "Starting at $700",
    body: "Already have a design? I'll handle the build and the move to your live site.",
    bullets: [
      "Content and asset migration",
      "Domain and hosting setup",
      "One round of post-launch fixes",
    ],
    mascot: <Robot3D pose="delivery" className="h-28 w-28" />,
    featured: false,
  },
];

const testimonials = [
  {
    quote:
      "Working together felt easy from the first message — clear updates, quick turnarounds, and a finished site that actually looked like us.",
    name: "Jane & Bart Wenthall",
  },
  {
    quote:
      "I sent a rough idea and got back exactly what I pictured, just better. Would send anyone this way without hesitation.",
    name: "Jamie Sweetly",
  },
  {
    quote:
      "The move to our new site was painless. No downtime, nothing broken, and support after launch when we needed a small fix.",
    name: "Rosa Aguado",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      {/* Top bar */}
      <header className="flex items-center justify-end gap-6 border-b-2 border-[var(--color-ink)]/10 bg-[var(--color-yellow)] px-6 py-2 text-xs">
        <a
          href="/"
          className="font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
        >
          Home
        </a>
        <a
          href="#contact"
          className="font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
        >
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
      <section className="bg-aurora relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <ScrollReveal direction="left">
            <div>
              <p className="text-sm font-semibold tracking-wide text-[var(--color-orange-deep)]">
                UI design
              </p>
              <h1 className="display mt-3 text-5xl font-bold leading-[1.05] text-[var(--color-ink)] sm:text-6xl">
                Nice choice
                <br />
                that you&rsquo;re here
              </h1>
              <p className="mt-5 max-w-md text-base text-[var(--color-ink-soft)]">
                A friendly, ready-to-explore layout for a design or moving
                service — built to be studied, adapted, and made your own.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#services"
                  className="btn-pop rounded-full bg-[var(--color-yellow)] px-7 py-3 text-sm font-semibold text-[var(--color-ink)] shadow-[0_4px_0_0_var(--color-orange-deep)]"
                >
                  Learn more
                </a>
                <a
                  href="/login"
                  className="btn-pop rounded-full border-2 border-[var(--color-ink)] px-7 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"
                >
                  Log in
                </a>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={150}>
            <div className="flex items-end justify-center gap-4">
              <Robot3D pose="wave" className="h-56 w-auto sm:h-64" />
              <Robot3D pose="box" className="h-56 w-auto sm:h-64" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Thank you / intro */}
      <section className="bg-[var(--color-yellow)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
          <ScrollReveal direction="left">
            <div className="glass-card mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-[var(--color-ink)] bg-gradient-to-br from-[#c9e8f0] to-[#f6d9ea]">
              <div className="flex h-full w-full items-center justify-center">
                <Robot3D pose="wave" className="h-4/5 w-4/5" />
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div>
              <h2 className="display text-3xl font-bold leading-tight text-[var(--color-ink)] sm:text-4xl">
                Thanks for stopping by my page
              </h2>
              <p className="mt-5 text-[var(--color-ink-soft)]">
                This page brings together a set of UI components you can
                explore, use, and customize for your own work. Alongside the
                visual layer, the underlying code is there for you to read and
                learn from.
              </p>
              <p className="mt-4 text-[var(--color-ink-soft)]">
                Take what&rsquo;s useful, adapt the parts that aren&rsquo;t
                quite right, and shape it into something that fits your own
                project and voice.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Get started with us */}
      <section className="bg-[var(--color-orange)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="up">
            <h2 className="display inline-block rounded-full border-2 border-[var(--color-ink)] px-6 py-2 text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
              Get started with us
            </h2>
          </ScrollReveal>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {getStartedItems.map((item, i) => (
              <ScrollReveal key={item.title} direction="up" delay={i * 100}>
                <div className="text-center sm:text-left">
                  <div className="glass-card mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-cream)] sm:mx-0">
                    {item.icon}
                  </div>
                  <h3 className="display mt-5 text-lg font-semibold text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3a2205]">
                    {item.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-[var(--color-cream)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="up">
            <h2 className="display inline-block rounded-full border-2 border-[var(--color-ink)] px-6 py-2 text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
              Services
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} direction="up" delay={i * 90}>
                <div
                  className={
                    "glass-card flex flex-col rounded-3xl border-2 border-[var(--color-ink)] p-8 " +
                    (service.featured
                      ? "bg-[var(--color-orange)] text-[var(--color-ink)] md:-translate-y-3 md:shadow-xl"
                      : "bg-[var(--color-yellow)]/60")
                  }
                >
                  <div className="mx-auto">{service.mascot}</div>
                  <h3 className="display mt-6 text-center text-xl font-bold">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-center text-sm font-semibold text-[var(--color-orange-deep)]">
                    {service.price}
                  </p>
                  <p className="mt-4 text-center text-sm text-[var(--color-ink-soft)]">
                    {service.body}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {service.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-orange-deep)]" />
                        <span className="text-[var(--color-ink-soft)]">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[var(--color-yellow)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="up">
            <h2 className="display inline-block rounded-full border-2 border-[var(--color-ink)] px-6 py-2 text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
              Our satisfied clients
            </h2>
          </ScrollReveal>
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} direction="up" delay={i * 100}>
                <figure>
                  <blockquote className="text-sm leading-relaxed text-[#4a3608]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-[var(--color-ink)]">
                    — {t.name}
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / contact */}
      <footer id="contact" className="bg-[var(--color-orange-deep)] text-[var(--color-cream)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
          <ScrollReveal direction="left">
            <Robot3D pose="delivery" className="mx-auto h-64 w-auto" />
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div>
              <p className="text-sm font-semibold tracking-wide text-[var(--color-yellow)]">
                Thanks for stopping by
              </p>

              <h3 className="display mt-4 text-lg font-bold">Main office</h3>
              <address className="mt-2 space-y-1 text-sm not-italic text-[#ffe9c2]">
                <p>Mulawin St. 5, Cupang Pandi, Bulacan</p>
                <p>Phone: 0931 144 8575</p>
                <p>Email: lealenefajardo20@gmail.com</p>
              </address>

              <h3 className="display mt-6 text-lg font-bold">Get social</h3>
              <div className="mt-3 flex gap-3">
                {[IconFacebook, IconTwitter, IconInstagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social link"
                    className="btn-pop flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-cream)] text-[var(--color-orange-deep)] hover:bg-[var(--color-yellow)]"
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
