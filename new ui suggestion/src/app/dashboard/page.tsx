import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CalendarCheck2,
  Code2,
  GraduationCap,
  Hourglass,
  Sparkles,
} from "lucide-react";
import { Avatar } from "@/components/bits";
import { Counter } from "@/components/counter";
import { EventCard } from "@/components/event-card";
import { FadeIn } from "@/components/reveal";
import { requireStudent } from "@/lib/auth";
import {
  getMyRegistrations,
  getRecommendations,
  getStudentStats,
} from "@/lib/data";
import { formatDate, formatTime, relativeDay } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard — CampusConnect" };

export default async function DashboardPage() {
  const user = await requireStudent();
  const [stats, recs, myRegs] = await Promise.all([
    getStudentStats(user.id),
    getRecommendations(user.id, user.interests, 3),
    getMyRegistrations(user.id),
  ]);

  const now = new Date();
  const nextEvent = myRegs
    .filter(
      (r) =>
        r.status === "confirmed" &&
        new Date(r.event.startAt) > now &&
        r.event.status === "published",
    )
    .sort((a, b) => +new Date(a.event.startAt) - +new Date(b.event.startAt))[0];

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-ink/40 uppercase">
              {greeting}
            </p>
            <h1 className="font-display mt-1.5 text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold tracking-tight">
              {user.name.split(" ")[0]},{" "}
              <span className="font-accent text-gradient italic">campus awaits.</span>
            </h1>
          </div>
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-shadow hover:shadow-[4px_4px_0_#d63b22]"
          >
            Find events
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </FadeIn>

      {/* stats */}
      <FadeIn delay={0.06}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              icon: <CalendarCheck2 className="h-4.5 w-4.5" />,
              color: "#5ce1e6",
              value: stats.attended,
              label: "Events attended",
              href: "/dashboard/my-events",
            },
            {
              icon: <GraduationCap className="h-4.5 w-4.5" />,
              color: "#ffb547",
              value: stats.workshops,
              label: "Workshops",
              href: "/dashboard/my-events",
            },
            {
              icon: <Code2 className="h-4.5 w-4.5" />,
              color: "#8b7cff",
              value: stats.hackathons,
              label: "Hackathons",
              href: "/dashboard/my-events",
            },
            {
              icon: <Award className="h-4.5 w-4.5" />,
              color: "#a3e635",
              value: stats.certificates,
              label: "Certificates",
              href: "/dashboard/certificates",
            },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="glass group rounded-3xl p-5 transition-all hover:-translate-y-0.5 hover:border-ink/20"
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${s.color}18`, color: s.color }}
                >
                  {s.icon}
                </span>
                <ArrowUpRight className="h-4 w-4 text-ink/20 transition-colors group-hover:text-ink/60" />
              </div>
              <p className="font-display mt-4 text-[34px] leading-none font-bold">
                <Counter value={s.value} />
              </p>
              <p className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-ink/40 uppercase">
                {s.label}
              </p>
            </Link>
          ))}
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* next event + interests */}
        <FadeIn delay={0.1} className="space-y-6">
          {nextEvent ? (
            <div className="glass relative overflow-hidden rounded-3xl p-6">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(90% 120% at 100% 0%, rgba(92,225,230,0.12), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-mint uppercase">
                    Next up · {relativeDay(nextEvent.event.startAt)}
                  </p>
                  <Hourglass className="h-4 w-4 text-mint/60" />
                </div>
                <h3 className="font-display mt-3 text-xl font-bold tracking-tight">
                  {nextEvent.event.title}
                </h3>
                <p className="mt-1 text-[13px] text-ink/50">
                  {formatDate(nextEvent.event.startAt)} ·{" "}
                  {formatTime(nextEvent.event.startAt)} · {nextEvent.event.venue}
                </p>
                <Link
                  href="/dashboard/my-events"
                  className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-mint hover:underline underline-offset-4"
                >
                  View ticket <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass rounded-3xl p-6">
              <p className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
                Next up
              </p>
              <p className="mt-3 text-[14px] text-ink/55">
                Nothing scheduled — your next favourite event is out there.
              </p>
              <Link
                href="/events"
                className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-mint hover:underline underline-offset-4"
              >
                Browse events <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
                Your interest profile
              </p>
              <Link
                href="/dashboard/settings"
                className="text-[11.5px] text-ink/50 underline-offset-4 hover:text-ink hover:underline"
              >
                Edit
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {user.interests.length > 0 ? (
                user.interests.map((i) => (
                  <span
                    key={i}
                    className="rounded-full border-[1.5px] border-ink bg-cream px-3 py-1.5 text-[12px] font-semibold text-ink shadow-[2px_2px_0_#d63b22]"
                  >
                    {i}
                  </span>
                ))
              ) : (
                <p className="text-[13px] text-ink/45">
                  No interests selected — add some to unlock smart recommendations.
                </p>
              )}
            </div>
          </div>
        </FadeIn>

        {/* recommendations */}
        <FadeIn delay={0.14}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-glow" />
            <h2 className="font-display text-lg font-bold tracking-tight">
              Picked for you
            </h2>
          </div>
          <div className="mt-4 space-y-4">
            {recs.length === 0 ? (
              <div className="glass rounded-3xl p-6 text-[13.5px] text-ink/50">
                You&apos;re registered for everything we&apos;d recommend. Impressive.
              </div>
            ) : (
              recs.map((r) => (
                <div key={r.card.id} className="relative">
                  <div className="grid gap-0">
                    <EventCard event={r.card} />
                  </div>
                  {r.matches.length > 0 && (
                    <div className="pointer-events-none absolute -top-2 right-4 z-10 flex gap-1">
                      {r.matches.slice(0, 2).map((m) => (
                        <span
                          key={m}
                          className="rounded-full border border-ink bg-cream px-2.5 py-0.5 text-[9.5px] font-bold tracking-wide text-flame uppercase shadow-[2px_2px_0_#181611]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </FadeIn>
      </div>

      {/* profile strip */}
      <FadeIn delay={0.18}>
        <div className="glass flex flex-wrap items-center gap-4 rounded-3xl p-5">
          <Avatar name={user.name} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-[15px] font-bold">{user.name}</p>
            <p className="truncate text-[12px] text-ink/40">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 pr-2">
            <div className="text-center">
              <p className="font-display text-xl font-bold">{stats.upcoming}</p>
              <p className="font-mono text-[9px] tracking-[0.16em] text-ink/35 uppercase">
                Upcoming
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold">{stats.pending}</p>
              <p className="font-mono text-[9px] tracking-[0.16em] text-ink/35 uppercase">
                Pending
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold text-gradient">{stats.attended}</p>
              <p className="font-mono text-[9px] tracking-[0.16em] text-ink/35 uppercase">
                Attended
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
