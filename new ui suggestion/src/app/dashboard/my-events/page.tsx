import Link from "next/link";
import QRCode from "qrcode";
import { Award, CalendarRange, Compass, History, TicketCheck } from "lucide-react";
import {
  CategoryBadge,
  EmptyState,
  EventMetaLine,
  StatusBadge,
} from "@/components/bits";
import { CancelRegistrationButton } from "@/components/cancel-registration-button";
import { PosterArt } from "@/components/event-card";
import { FadeIn } from "@/components/reveal";
import { QrTicketButton } from "@/components/qr-ticket";
import { requireStudent } from "@/lib/auth";
import { getMyRegistrations } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Events — CampusConnect" };

export default async function MyEventsPage() {
  const user = await requireStudent();
  const regs = await getMyRegistrations(user.id);
  const now = new Date();

  const qrMap = new Map<string, string>();
  for (const r of regs) {
    if (
      r.status === "confirmed" &&
      !r.checkedIn &&
      new Date(r.event.startAt) > now &&
      r.event.status === "published"
    ) {
      qrMap.set(
        r.registrationId,
        await QRCode.toDataURL(`CC:${r.registrationId}:${r.verifyCode}`, {
          width: 320,
          margin: 1,
          color: { dark: "#0a0a14", light: "#ffffff" },
        }),
      );
    }
  }

  const upcoming = regs.filter(
    (r) =>
      r.status !== "cancelled" &&
      !r.checkedIn &&
      new Date(r.event.startAt) > now &&
      r.event.status === "published",
  );
  const attended = regs.filter((r) => r.checkedIn);
  const archived = regs.filter(
    (r) => !upcoming.includes(r) && !attended.includes(r),
  );

  function Row({ r }: { r: (typeof regs)[number] }) {
    const qr = qrMap.get(r.registrationId);
    return (
      <div className="glass flex flex-col gap-4 rounded-3xl p-4 transition-colors hover:border-ink/18 sm:flex-row sm:items-center">
        <Link
          href={`/events/${r.event.id}`}
          className="group relative h-24 w-full shrink-0 overflow-hidden rounded-2xl sm:w-36"
        >
          <PosterArt posterUrl={r.event.posterUrl} category={r.event.category} title={r.event.title} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={r.event.category} />
            <StatusBadge status={r.status} checkedIn={r.checkedIn} />
            {r.event.status === "cancelled" && (
              <span className="rounded-full border border-rose/30 bg-rose/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-rose uppercase">
                Event cancelled
              </span>
            )}
          </div>
          <Link href={`/events/${r.event.id}`} className="transition-colors hover:text-mint">
            <h3 className="font-display mt-2 truncate text-[16px] font-bold">{r.event.title}</h3>
          </Link>
          <EventMetaLine dateLabel={r.event.dateLabel} timeLabel={r.event.timeLabel} venue={r.event.venue} className="mt-1" />
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          {r.checkedIn && r.certificateId ? (
            <a
              href={`/api/certificates/${r.certificateId}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/12 px-3 py-1.5 text-[12px] font-medium text-gold transition-colors hover:bg-gold/20"
            >
              <Award className="h-3.5 w-3.5" /> Certificate
            </a>
          ) : null}
          {qr ? (
            <>
              <QrTicketButton
                compact
                qrDataUrl={qr}
                verifyCode={r.verifyCode}
                eventTitle={r.event.title}
                eventDate={`${formatDate(r.event.startAt)} · ${formatTime(r.event.startAt)}`}
                venue={r.event.venue}
                category={r.event.category}
                holderName={user.name}
              />
              <CancelRegistrationButton registrationId={r.registrationId} />
            </>
          ) : null}
          {r.status === "pending" && new Date(r.event.startAt) > now && (
            <CancelRegistrationButton registrationId={r.registrationId} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <FadeIn>
        <h1 className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold tracking-tight">
          My <span className="font-accent text-gradient italic">events</span>
        </h1>
        <p className="mt-2 text-[14px] text-ink/50">
          Tickets, attendance and everything you&apos;ve signed up for.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="flex items-center gap-2 text-ink/80">
          <CalendarRange className="h-4.5 w-4.5 text-mint" />
          <h2 className="font-display text-lg font-bold">Upcoming</h2>
          <span className="rounded-full bg-ink/8 px-2 py-0.5 font-mono text-[10.5px] text-ink/50">
            {upcoming.length}
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={<Compass className="h-6 w-6" />}
              title="Nothing on the calendar"
              subtitle="Browse what's happening on campus and grab a seat."
              action={
                <Link
                  href="/events"
                  className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper"
                >
                  Explore events
                </Link>
              }
            />
          ) : (
            upcoming.map((r) => <Row key={r.registrationId} r={r} />)
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex items-center gap-2 text-ink/80">
          <TicketCheck className="h-4.5 w-4.5 text-glow" />
          <h2 className="font-display text-lg font-bold">Attended</h2>
          <span className="rounded-full bg-ink/8 px-2 py-0.5 font-mono text-[10.5px] text-ink/50">
            {attended.length}
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {attended.length === 0 ? (
            <p className="glass rounded-3xl px-6 py-8 text-center text-[13px] text-ink/45">
              Check in at an event with your QR ticket and it lands here — with a certificate.
            </p>
          ) : (
            attended.map((r) => <Row key={r.registrationId} r={r} />)
          )}
        </div>
      </FadeIn>

      {archived.length > 0 && (
        <FadeIn delay={0.14}>
          <div className="flex items-center gap-2 text-ink/80">
            <History className="h-4.5 w-4.5 text-ink/50" />
            <h2 className="font-display text-lg font-bold">Archive</h2>
            <span className="rounded-full bg-ink/8 px-2 py-0.5 font-mono text-[10.5px] text-ink/50">
              {archived.length}
            </span>
          </div>
          <div className="mt-4 space-y-3 opacity-75">
            {archived.map((r) => <Row key={r.registrationId} r={r} />)}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
