import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  CheckCircle2,
  Megaphone,
  ScanLine,
  Ticket,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/bits";
import { Counter } from "@/components/counter";
import { AnnouncementForm } from "@/components/announcement-form";
import { FadeIn } from "@/components/reveal";
import { requireClub } from "@/lib/auth";
import {
  getClubAnnouncements,
  getClubEvents,
  getClubStats,
  getRecentRegistrations,
} from "@/lib/data";
import { formatDay, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Club Console — CampusConnect" };

export const clubScope = (role: string, clubId: string | null) =>
  role === "admin" ? null : clubId;

export default async function ClubOverviewPage() {
  const user = await requireClub();
  const scope = clubScope(user.role, user.clubId);
  const [stats, recent, events, announcements] = await Promise.all([
    getClubStats(scope),
    getRecentRegistrations(scope, 8),
    getClubEvents(scope),
    getClubAnnouncements(scope, 5),
  ]);
  const upcomingEvents = events.filter(
    (e) => e.status === "published" && new Date(e.startAt) > new Date(),
  );

  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-ink/40 uppercase">
              {user.role === "admin" ? "Administration" : "Club console"}
            </p>
            <h1 className="font-display mt-1.5 text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold tracking-tight">
              Command <span className="font-accent text-gradient italic">centre</span>
            </h1>
          </div>
          <div className="flex gap-2.5">
            <Link
              href="/club/checkin"
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-ink/80 transition-colors hover:border-ink/25 hover:text-ink"
            >
              <ScanLine className="h-4 w-4 text-mint" /> Check-in
            </Link>
            <Link
              href="/club/events/new"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-shadow hover:shadow-[4px_4px_0_#d63b22]"
            >
              New event <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: <CalendarRange className="h-4.5 w-4.5" />, color: "#8b7cff", value: stats.events, label: "Total events" },
            { icon: <Ticket className="h-4.5 w-4.5" />, color: "#ffb547", value: stats.upcoming, label: "Upcoming" },
            { icon: <Users className="h-4.5 w-4.5" />, color: "#5ce1e6", value: stats.registrations, label: "Registrations" },
            { icon: <CheckCircle2 className="h-4.5 w-4.5" />, color: "#a3e635", value: stats.checkedIn, label: "Checked in" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-3xl p-5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `${s.color}18`, color: s.color }}
              >
                {s.icon}
              </span>
              <p className="font-display mt-4 text-[34px] leading-none font-bold">
                <Counter value={s.value} />
              </p>
              <p className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-ink/40 uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* recent registrations */}
        <FadeIn delay={0.1}>
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display flex items-center gap-2 text-lg font-bold">
                <Users className="h-4.5 w-4.5 text-mint" /> Latest registrations
              </h2>
              <Link href="/club/events" className="text-[11.5px] text-ink/45 hover:text-ink">
                Manage
              </Link>
            </div>
            <div className="mt-4 space-y-2.5">
              {recent.length === 0 && (
                <p className="py-6 text-center text-[13px] text-ink/40">
                  No registrations yet — share your event link.
                </p>
              )}
              {recent.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-2xl border border-ink/6 bg-ink/[0.02] px-3.5 py-2.5"
                >
                  <Avatar name={r.userName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{r.userName}</p>
                    <p className="truncate text-[11.5px] text-ink/40">{r.eventTitle}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-mono text-[9.5px] tracking-[0.14em] uppercase ${
                        r.checkedIn
                          ? "text-mint"
                          : r.status === "pending"
                            ? "text-gold"
                            : "text-ink/40"
                      }`}
                    >
                      {r.checkedIn ? "Checked in" : r.status}
                    </p>
                    <p className="text-[10.5px] text-ink/30">{formatDay(r.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* broadcast */}
        <FadeIn delay={0.14} className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-bold">
              <Megaphone className="h-4.5 w-4.5 text-gold" /> Broadcast
            </h2>
            <AnnouncementForm
              events={upcomingEvents.map((e) => ({ id: e.id, title: e.title }))}
            />
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="font-display text-lg font-bold">Recent announcements</h2>
            <div className="mt-4 space-y-3">
              {announcements.length === 0 && (
                <p className="text-[13px] text-ink/40">Nothing sent yet.</p>
              )}
              {announcements.map((a) => (
                <div key={a.id} className="border-b border-ink/6 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13.5px] font-semibold">{a.title}</p>
                    <span className="shrink-0 font-mono text-[9.5px] text-ink/30 uppercase">
                      {formatDay(a.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-ink/45">
                    {a.eventTitle ? `→ ${a.eventTitle} · ` : ""}
                    {a.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* upcoming events quick list */}
      <FadeIn delay={0.18}>
        <div className="flex items-center justify-between">
          <h2 className="font-display flex items-center gap-2 text-lg font-bold">
            <CalendarRange className="h-4.5 w-4.5 text-glow" /> Upcoming events
          </h2>
          <Link
            href="/club/events"
            className="group inline-flex items-center gap-1 text-[12px] text-ink/45 hover:text-ink"
          >
            All events
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {upcomingEvents.slice(0, 4).map((e) => (
            <Link
              key={e.id}
              href={`/club/events/${e.id}`}
              className="glass group flex items-center justify-between gap-4 rounded-2xl p-4 transition-colors hover:border-ink/20"
            >
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold">{e.title}</p>
                <p className="mt-0.5 text-[11.5px] text-ink/40">
                  {formatDay(e.startAt)} · {formatTime(e.startAt)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-[15px] font-bold">
                  {e.registeredCount}
                  <span className="text-ink/35">/{e.capacity}</span>
                </p>
                <p className="font-mono text-[9px] tracking-[0.14em] text-ink/35 uppercase">
                  registered
                </p>
              </div>
            </Link>
          ))}
          {upcomingEvents.length === 0 && (
            <p className="glass col-span-2 rounded-2xl p-6 text-center text-[13px] text-ink/40">
              No upcoming events. Create your first one.
            </p>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
