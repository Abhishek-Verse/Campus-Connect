import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import {
  ArrowLeft,
  Armchair,
  BellRing,
  Building2,
  Clock,
  Hourglass,
  LogIn,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";
import { AuroraBackdrop } from "@/components/aurora";
import { CapacityBar, CategoryBadge, StatusBadge } from "@/components/bits";
import { EventCard, PosterArt } from "@/components/event-card";
import { RegisterButton } from "@/components/register-button";
import { QrTicketButton } from "@/components/qr-ticket";
import { SiteNav } from "@/components/site-nav";
import { getSessionUser } from "@/lib/auth";
import {
  getEventAnnouncements,
  getEventById,
  getUpcomingEvents,
  getViewerRegistration,
} from "@/lib/data";
import { formatDate, formatDay, formatFullDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getEventById(id);
  if (!data) notFound();
  const { event, card } = data;
  const user = await getSessionUser();
  const [announcements, moreEvents] = await Promise.all([
    getEventAnnouncements(id),
    getUpcomingEvents(4),
  ]);
  const viewerReg = user ? await getViewerRegistration(id, user.id) : null;

  const isFull = card.registeredCount >= card.capacity;
  const isPast = event.startAt <= new Date();
  const isCancelled = event.status === "cancelled";
  const activeReg = viewerReg && viewerReg.status !== "cancelled" ? viewerReg : null;

  let qrDataUrl: string | null = null;
  if (activeReg && activeReg.status === "confirmed" && !isPast) {
    qrDataUrl = await QRCode.toDataURL(`CC:${activeReg.id}:${activeReg.verifyCode}`, {
      width: 320,
      margin: 1,
      color: { dark: "#0a0a14", light: "#ffffff" },
    });
  }

  const moreFromClub = moreEvents.filter((e) => e.id !== id).slice(0, 3);

  return (
    <main className="relative min-h-screen">
      <AuroraBackdrop subtle />
      <SiteNav />
      <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 sm:px-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-[13px] text-ink/50 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All events
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* left column */}
          <div>
            <div className="group relative h-72 overflow-hidden rounded-2xl border-[1.5px] border-ink sm:h-[380px]">
              <PosterArt
                posterUrl={event.posterUrl}
                category={event.category}
                title={event.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 flex flex-wrap items-center gap-2">
                <CategoryBadge category={event.category} className="glass-strong border-0" />
                {event.requiresApproval && (
                  <span className="glass-strong inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-gold uppercase">
                    <ShieldCheck className="h-3 w-3" /> Approval needed
                  </span>
                )}
                {isCancelled && (
                  <span className="rounded-full border border-ink bg-rose px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-cream uppercase">
                    Cancelled
                  </span>
                )}
              </div>
            </div>

            <h1 className="font-display mt-6 text-[clamp(1.7rem,3.4vw,2.6rem)] leading-tight font-bold tracking-tight">
              {event.title}
            </h1>
            <div className="mt-3 flex items-center gap-2.5">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg font-display text-[11px] font-bold"
                style={{ background: `${card.clubColor}26`, color: card.clubColor }}
              >
                {card.clubName.slice(0, 2).toUpperCase()}
              </span>
              <span className="text-[13.5px] text-ink/60">
                Hosted by <span className="font-semibold text-ink/85">{card.clubName}</span>
              </span>
            </div>

            <p className="mt-6 max-w-2xl text-[14.5px] leading-relaxed whitespace-pre-line text-ink/60">
              {event.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {event.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-ink/10 bg-ink/[0.04] px-3 py-1 text-[11.5px] text-ink/55"
                >
                  #{t}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: <Clock className="h-4 w-4" />, label: "Date", value: formatDate(event.startAt) },
                { icon: <Hourglass className="h-4 w-4" />, label: "Time", value: formatTime(event.startAt) },
                { icon: <Building2 className="h-4 w-4" />, label: "Venue", value: event.venue },
                { icon: <Armchair className="h-4 w-4" />, label: "Capacity", value: `${event.capacity} seats` },
              ].map((m) => (
                <div key={m.label} className="glass rounded-2xl p-4">
                  <span className="text-ink/40">{m.icon}</span>
                  <p className="mt-2 font-mono text-[9.5px] tracking-[0.18em] text-ink/35 uppercase">
                    {m.label}
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold text-ink/85">{m.value}</p>
                </div>
              ))}
            </div>

            {/* announcements */}
            {announcements.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display flex items-center gap-2 text-lg font-bold">
                  <BellRing className="h-4.5 w-4.5 text-gold" /> Announcements
                </h2>
                <div className="mt-4 space-y-3">
                  {announcements.map((a) => (
                    <div key={a.id} className="glass rounded-2xl p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[14px] font-semibold">{a.title}</p>
                        <span className="shrink-0 font-mono text-[10px] tracking-[0.14em] text-ink/35 uppercase">
                          {formatDay(a.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/55">{a.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* right column — registration panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass rounded-[28px] p-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
                  Registration
                </p>
                {activeReg && (
                  <StatusBadge status={activeReg.status} checkedIn={activeReg.checkedIn} />
                )}
              </div>
              <div className="mt-4">
                <CapacityBar registered={card.registeredCount} capacity={card.capacity} />
              </div>

              <div className="mt-6 space-y-3">
                {activeReg ? (
                  <>
                    {activeReg.checkedIn ? (
                      <div className="flex items-center gap-2.5 rounded-xl border border-mint/30 bg-mint/10 px-4 py-3 text-[13px] text-mint">
                        <TicketCheck className="h-4 w-4" />
                        You checked in — attendance recorded.
                      </div>
                    ) : activeReg.status === "pending" ? (
                      <div className="flex items-center gap-2.5 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-[13px] text-gold">
                        <ShieldCheck className="h-4 w-4" />
                        Waiting for club approval.
                      </div>
                    ) : qrDataUrl ? (
                      <QrTicketButton
                        qrDataUrl={qrDataUrl}
                        verifyCode={activeReg.verifyCode}
                        eventTitle={event.title}
                        eventDate={`${formatDate(event.startAt)} · ${formatTime(event.startAt)}`}
                        venue={event.venue}
                        category={event.category}
                        holderName={user?.name ?? ""}
                      />
                    ) : null}
                    <Link
                      href="/dashboard/my-events"
                      className="block text-center text-[12.5px] text-ink/50 underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      Manage in My Events
                    </Link>
                  </>
                ) : isCancelled ? (
                  <div className="rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-center text-[13px] text-rose">
                    This event was cancelled by the club.
                  </div>
                ) : isPast ? (
                  <div className="rounded-xl border border-ink/10 bg-ink/[0.04] px-4 py-3 text-center text-[13px] text-ink/50">
                    Registration closed — this event already happened.
                  </div>
                ) : isFull ? (
                  <div className="rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-center text-[13px] font-semibold text-rose">
                    House full — all {card.capacity} seats are taken.
                  </div>
                ) : user && user.role === "student" ? (
                  <RegisterButton eventId={event.id} requiresApproval={event.requiresApproval} />
                ) : user ? (
                  <div className="rounded-xl border border-ink/10 bg-ink/[0.04] px-4 py-3 text-center text-[13px] text-ink/50">
                    Club accounts manage events from the console.
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 rounded-xl bg-ink py-3.5 text-sm font-semibold text-paper transition-shadow hover:shadow-[4px_4px_0_#d63b22]"
                  >
                    <LogIn className="h-4 w-4" /> Sign in to register
                  </Link>
                )}
              </div>

              <div className="mt-6 border-t border-ink/8 pt-5">
                <p className="text-[12px] leading-relaxed text-ink/40">
                  {formatFullDate(event.startAt)} at {formatTime(event.startAt)}
                  {event.endAt ? ` – ${formatTime(event.endAt)}` : ""}. Seats are
                  allocated instantly and attendance is recorded via QR scan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* more events */}
        {moreFromClub.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-bold tracking-tight">
              More <span className="font-accent text-gradient italic">happening soon</span>
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {moreFromClub.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
