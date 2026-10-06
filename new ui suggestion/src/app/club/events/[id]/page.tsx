import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Armchair,
  ArrowLeft,
  CheckCircle2,
  Hourglass,
  ScanLine,
  TicketCheck,
  Users,
} from "lucide-react";
import { CapacityBar, CategoryBadge } from "@/components/bits";
import { CancelEventButton } from "@/components/cancel-event-button";
import { AnnouncementForm } from "@/components/announcement-form";
import { PosterArt } from "@/components/event-card";
import { FadeIn } from "@/components/reveal";
import { RegistrationsTable } from "@/components/registrations-table";
import { requireClub } from "@/lib/auth";
import { getEventAnnouncements, getEventById, getEventRegistrations } from "@/lib/data";
import { formatDay, formatFullDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Manage Event — CampusConnect" };

export default async function ClubEventManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireClub();
  const data = await getEventById(id);
  if (!data) notFound();
  if (user.role !== "admin" && data.event.clubId !== user.clubId) redirect("/club/events");

  const { event, card } = data;
  const [rows, announcements] = await Promise.all([
    getEventRegistrations(id),
    getEventAnnouncements(id),
  ]);
  const pendingCount = rows.filter((r) => r.status === "pending").length;
  const confirmedCount = rows.filter((r) => r.status === "confirmed").length;
  const checkedInCount = rows.filter((r) => r.checkedIn).length;

  return (
    <div className="space-y-8">
      <FadeIn>
        <Link
          href="/club/events"
          className="inline-flex items-center gap-1.5 text-[13px] text-ink/50 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All events
        </Link>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row">
          <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-2xl border-[1.5px] border-ink lg:w-80">
            <PosterArt posterUrl={event.posterUrl} category={event.category} title={event.title} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={event.category} />
              {event.status === "cancelled" && (
                <span className="rounded-full border border-ink bg-rose px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-cream uppercase">
                  Cancelled
                </span>
              )}
              {new Date(event.startAt) > new Date() ? (
                <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-mint uppercase">
                  Upcoming
                </span>
              ) : (
                <span className="rounded-full border border-ink/15 bg-ink/5 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-ink/50 uppercase">
                  Completed
                </span>
              )}
            </div>
            <h1 className="font-display mt-3 text-[clamp(1.6rem,3vw,2.3rem)] leading-tight font-bold tracking-tight">
              {event.title}
            </h1>
            <p className="mt-2 text-[13.5px] text-ink/50">
              {formatFullDate(event.startAt)} · {formatTime(event.startAt)} · {event.venue}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Link
                href={`/club/checkin?event=${event.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12.5px] font-semibold text-paper transition-shadow hover:shadow-[3px_3px_0_#d63b22]"
              >
                <ScanLine className="h-3.5 w-3.5" /> Open check-in
              </Link>
              <Link
                href={`/events/${event.id}`}
                className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-semibold text-ink/75 hover:text-ink"
              >
                Public page
              </Link>
              <CancelEventButton eventId={event.id} cancelled={event.status === "cancelled"} />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: <Users className="h-4 w-4" />, color: "#5ce1e6", value: card.registeredCount, label: `of ${event.capacity} seats filled` },
            { icon: <Hourglass className="h-4 w-4" />, color: "#ffb547", value: pendingCount, label: "Pending approval" },
            { icon: <Armchair className="h-4 w-4" />, color: "#8b7cff", value: confirmedCount, label: "Confirmed" },
            { icon: <CheckCircle2 className="h-4 w-4" />, color: "#a3e635", value: checkedInCount, label: "Checked in" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${s.color}18`, color: s.color }}>
                {s.icon}
              </span>
              <p className="font-display mt-3 text-2xl font-bold">{s.value}</p>
              <p className="mt-0.5 font-mono text-[9.5px] tracking-[0.14em] text-ink/40 uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <div className="glass mt-3 rounded-2xl p-4">
          <CapacityBar registered={card.registeredCount} capacity={event.capacity} />
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h2 className="font-display mb-1 flex items-center gap-2 text-lg font-bold">
          <TicketCheck className="h-4.5 w-4.5 text-mint" /> Registrations
        </h2>
        <p className="mb-4 text-[12.5px] text-ink/40">
          Approve requests, cancel seats, and export the participant list.
        </p>
        <RegistrationsTable rows={rows} eventId={event.id} />
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-2">
        <FadeIn delay={0.14}>
          <div className="glass rounded-3xl p-6">
            <h2 className="font-display mb-1 text-lg font-bold">Announce to attendees</h2>
            <p className="mb-4 text-[12.5px] text-ink/40">
              Goes to every student with an active registration for this event.
            </p>
            <AnnouncementForm eventId={event.id} />
          </div>
        </FadeIn>
        <FadeIn delay={0.18}>
          <div className="glass rounded-3xl p-6">
            <h2 className="font-display text-lg font-bold">Sent announcements</h2>
            <div className="mt-4 space-y-3">
              {announcements.length === 0 && (
                <p className="text-[13px] text-ink/40">Nothing sent for this event yet.</p>
              )}
              {announcements.map((a) => (
                <div key={a.id} className="border-b border-ink/6 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13.5px] font-semibold">{a.title}</p>
                    <span className="shrink-0 font-mono text-[9.5px] text-ink/30 uppercase">
                      {formatDay(a.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[12px] text-ink/45">{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
