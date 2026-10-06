import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BellRing,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  QrCode,
  ScanLine,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { AuroraBackdrop } from "@/components/aurora";
import { CapacityBar, CategoryBadge } from "@/components/bits";
import { Counter } from "@/components/counter";
import { EventCard, PosterArt } from "@/components/event-card";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { SiteNav } from "@/components/site-nav";
import { CATEGORIES } from "@/lib/constants";
import { getPlatformStats, getUpcomingEvents } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [featured, stats] = await Promise.all([
    getUpcomingEvents(6),
    getPlatformStats(),
  ]);
  const heroEvents = featured.slice(0, 3);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AuroraBackdrop />
      <SiteNav />

      {/* ------------------------------- HERO ------------------------------- */}
      <section className="relative mx-auto grid max-w-7xl gap-14 px-5 pt-36 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-44">
        <div>
          <Reveal>
            <div className="sticker inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-medium text-ink/75">
              <span className="pulse-ring flex h-2 w-2 rounded-full bg-flame" />
              Thakur College of Engineering &amp; Technology
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display mt-7 text-[clamp(2.9rem,6.4vw,5.2rem)] leading-[0.98] font-black tracking-[-0.03em] text-ink">
              Every event.
              <br />
              One <span className="text-flame">campus.</span>
              <br />
              <span className="font-accent font-medium italic">Zero FOMO.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-lg text-[15.5px] leading-relaxed text-ink/60">
              CampusConnect is TCET&apos;s home for club events, fests, hackathons
              and workshops — register in seconds, check in with a QR code, and
              build a participation record that actually means something.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 rounded-xl border-[1.5px] border-ink bg-ink px-6 py-3.5 text-sm font-bold text-cream transition-all hover:shadow-[6px_6px_0_#d63b22]"
              >
                Explore events
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-ink bg-cream px-6 py-3.5 text-sm font-bold text-ink transition-all hover:shadow-[6px_6px_0_#181611]"
              >
                Create free account
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-14 grid max-w-md grid-cols-3 divide-x divide-ink/15 border-y-[1.5px] border-ink/20">
              {[
                { v: stats.events, label: "Events hosted" },
                { v: stats.registrations, label: "Registrations" },
                { v: stats.checkins, label: "QR check-ins" },
              ].map((s) => (
                <div key={s.label} className="px-4 py-6 first:pl-0">
                  <div className="font-display text-3xl font-black tracking-tight text-ink">
                    <Counter value={s.v} />
                    <span className="text-flame">+</span>
                  </div>
                  <div className="mt-1 font-mono text-[9.5px] tracking-[0.16em] text-ink/45 uppercase">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* floating poster stack */}
        <Reveal delay={0.2} className="relative hidden h-[540px] lg:block">
          <div className="absolute inset-0">
            {heroEvents.map((e, i) => (
              <Link
                key={e.id}
                href={`/events/${e.id}`}
                className="float-gentle group absolute block w-[290px] overflow-hidden rounded-2xl border-[1.5px] border-ink bg-cream transition-all duration-300 hover:z-30 hover:shadow-[10px_10px_0_#181611]"
                style={{
                  top: `${i * 130}px`,
                  left: `${i * 120}px`,
                  transform: `rotate(${[-4, 3, -2][i]}deg)`,
                  animationDelay: `${i * -2.2}s`,
                  zIndex: i,
                  boxShadow: "6px 6px 0 rgba(24,22,17,0.85)",
                }}
              >
                <div className="relative h-[160px] border-b-[1.5px] border-ink">
                  <PosterArt posterUrl={e.posterUrl} category={e.category} title={e.title} />
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={e.category} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-display truncate text-[14.5px] font-bold text-ink">{e.title}</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-ink/45 uppercase">
                    {formatDate(e.startAt)} · {formatTime(e.startAt)}
                  </p>
                  <div className="mt-3">
                    <CapacityBar
                      registered={e.registeredCount}
                      capacity={e.capacity}
                      showLabel={false}
                    />
                  </div>
                </div>
              </Link>
            ))}
            <div className="sticker absolute bottom-4 left-10 z-40 flex -rotate-2 items-center gap-3 rounded-2xl px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink bg-mint/15 text-mint">
                <QrCode className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[12.5px] font-bold">QR ticket issued</p>
                <p className="text-[11px] text-ink/50">Scan at the door — done</p>
              </div>
              <CheckCircle2 className="ml-2 h-4 w-4 text-mint" />
            </div>
            {/* rotating badge */}
            <div className="spin-slow absolute top-2 right-4 z-40 flex h-28 w-28 items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                <defs>
                  <path id="circ" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-ink font-mono text-[9.5px] tracking-[0.22em]">
                  <textPath href="#circ">CAMPUSCONNECT · TCET · MUMBAI ·</textPath>
                </text>
              </svg>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink bg-flame text-cream">
                <Sparkles className="h-5 w-5" />
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ----------------------------- MARQUEE ------------------------------ */}
      <section id="categories" className="relative border-y-[1.5px] border-ink bg-ink py-4 text-cream">
        <div className="marquee-track gap-12">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-12">
              {CATEGORIES.map((c) => (
                <span
                  key={`${copy}-${c.id}`}
                  className="flex items-center gap-3 font-display text-lg font-bold tracking-tight"
                >
                  <Sparkles className="h-4 w-4" style={{ color: c.color === "#181611" ? "#e8442e" : c.color }} />
                  {c.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------- FEATURED EVENTS ------------------------ */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-bold tracking-[0.24em] text-flame uppercase">
                01 · This season on campus
              </p>
              <h2 className="font-display mt-3 text-[clamp(1.9rem,3.6vw,2.8rem)] font-black tracking-tight text-ink">
                Upcoming &amp; <span className="font-accent font-medium italic">unmissable</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="group inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ink px-4 py-2 text-[12.5px] font-bold text-ink transition-all hover:shadow-[3px_3px_0_#181611]"
            >
              View all events
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.07}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------ FEATURES ---------------------------- */}
      <section id="features" className="border-t-[1.5px] border-ink/15 bg-cream/60">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal>
            <p className="font-mono text-center text-[11px] font-bold tracking-[0.24em] text-flame uppercase">
              02 · Built different
            </p>
            <h2 className="font-display mx-auto mt-3 max-w-xl text-center text-[clamp(1.9rem,3.6vw,2.8rem)] font-black tracking-tight text-ink">
              Not just a notice board —{" "}
              <span className="font-accent font-medium italic">a campus OS</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <ScanLine className="h-5 w-5" />,
                color: "#0b6a62",
                title: "QR check-in",
                body: "Every registration mints a unique QR ticket. Clubs scan at the door and attendance records itself.",
                foot: (
                  <div className="mt-5 grid grid-cols-7 gap-[3px]">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <span
                        key={i}
                        className="aspect-square rounded-[2px]"
                        style={{
                          background:
                            (i * 7 + Math.floor(i / 7)) % 3 === 0
                              ? "#181611"
                              : "rgba(24,22,17,0.12)",
                        }}
                      />
                    ))}
                  </div>
                ),
              },
              {
                icon: <BrainCircuit className="h-5 w-5" />,
                color: "#1d4ed8",
                title: "Smart picks",
                body: "Tell us your interests — coding, design, music — and the feed re-ranks itself around what you'll actually love.",
                foot: (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {["Coding", "AI / ML", "Design", "Music"].map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-blue-700/40 bg-blue-700/10 px-2.5 py-1 text-[10.5px] font-semibold text-blue-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ),
              },
              {
                icon: <Award className="h-5 w-5" />,
                color: "#a16207",
                title: "Certificates",
                body: "Check in, and a verifiable PDF certificate lands in your profile automatically. No chasing coordinators.",
                foot: (
                  <div className="mt-5 rounded-xl border border-gold/40 bg-gold/10 p-3">
                    <p className="font-accent text-sm text-gold italic">Certificate of Participation</p>
                    <p className="mt-1 font-mono text-[9.5px] tracking-[0.18em] text-ink/45">
                      VERIFIED · CAMPUSCONNECT
                    </p>
                  </div>
                ),
              },
              {
                icon: <TrendingUp className="h-5 w-5" />,
                color: "#d63b22",
                title: "Live capacity",
                body: "Seat counters update in real time. Hit the limit and events close themselves — no overbooking, ever.",
                foot: (
                  <div className="mt-6 space-y-3">
                    <CapacityBar registered={47} capacity={50} />
                    <CapacityBar registered={50} capacity={50} />
                  </div>
                ),
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="group flex h-full flex-col rounded-2xl border-[1.5px] border-ink bg-paper p-6 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#181611]">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/20 transition-transform duration-300 group-hover:-rotate-6"
                    style={{ background: `${f.color}14`, color: f.color }}
                  >
                    {f.icon}
                  </span>
                  <h3 className="font-display mt-4 text-lg font-black tracking-tight text-ink">{f.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink/55">{f.body}</p>
                  <div className="mt-auto">{f.foot}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- HOW IT WORKS -------------------------- */}
      <section id="how" className="border-y-[1.5px] border-ink bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal>
            <p className="font-mono text-[11px] font-bold tracking-[0.24em] text-flame uppercase">
              03 · Three steps, zero friction
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.9rem,3.6vw,2.8rem)] font-black tracking-tight">
              From <span className="font-accent font-medium text-cream/60 italic">“what&apos;s happening?”</span>{" "}
              to <span className="font-accent font-medium text-[#ff7a5c] italic">“I was there.”</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                n: "01",
                icon: <CalendarDays className="h-5 w-5" />,
                title: "Discover",
                body: "Browse by category — technical fests to open mics — or let recommendations find events that match your interests.",
              },
              {
                n: "02",
                icon: <QrCode className="h-5 w-5" />,
                title: "Register",
                body: "One tap reserves your seat, respects capacity limits, and drops a signed QR ticket into My Events instantly.",
              },
              {
                n: "03",
                icon: <BellRing className="h-5 w-5" />,
                title: "Show up & shine",
                body: "Scan in at the venue, collect your certificate automatically, and watch your participation profile grow.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="relative border-t border-cream/15 pt-8">
                  <div className="absolute -top-5 right-0 font-display text-[72px] leading-none font-black text-cream/8">
                    {s.n}
                  </div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cream/25 bg-cream/10 text-cream">
                    {s.icon}
                  </span>
                  <h3 className="font-display mt-4 text-xl font-black">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-cream/55">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- CTA -------------------------------- */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border-[1.5px] border-ink bg-flame px-8 py-16 text-center text-cream shadow-[10px_10px_0_#181611] sm:px-16">
            <div
              className="poster-dots pointer-events-none absolute inset-0 opacity-60"
              style={{ backgroundImage: "radial-gradient(rgba(253,251,244,0.22) 1.2px, transparent 1.2px)" }}
            />
            <div className="relative">
              <Users className="mx-auto h-8 w-8" />
              <h2 className="font-display mx-auto mt-5 max-w-2xl text-[clamp(2rem,3.8vw,3rem)] font-black tracking-tight">
                Your campus is already buzzing.
                <br />
                <span className="font-accent font-medium italic">Plug in, TCET.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[14.5px] text-cream/80">
                Students, clubs and admins — everyone gets a console built for
                them. Free forever for TCET.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <Link
                  href="/register"
                  className="rounded-xl border-[1.5px] border-ink bg-ink px-7 py-3.5 text-sm font-bold text-cream transition-all hover:shadow-[5px_5px_0_rgba(253,251,244,0.5)]"
                >
                  Join as a student
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border-[1.5px] border-cream px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cream hover:text-flame"
                >
                  Club sign-in
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------- FOOTER ------------------------------ */}
      <footer className="border-t-[1.5px] border-ink bg-cream/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row sm:px-8">
          <Logo />
          <p className="font-mono text-[10px] tracking-[0.16em] text-ink/40 uppercase">
            Thakur College of Engineering &amp; Technology · Kandivali, Mumbai
          </p>
          <div className="flex items-center gap-5 text-[12.5px] font-medium text-ink/55">
            <Link href="/events" className="transition-colors hover:text-flame">
              Events
            </Link>
            <Link href="/login" className="transition-colors hover:text-flame">
              Sign in
            </Link>
            <Link href="/register" className="transition-colors hover:text-flame">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
