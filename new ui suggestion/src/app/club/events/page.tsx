import Link from "next/link";
import { ArrowRight, CalendarX2, PlusCircle } from "lucide-react";
import { CapacityBar, CategoryBadge, EmptyState, StatusBadge } from "@/components/bits";
import { PosterArt } from "@/components/event-card";
import { FadeIn } from "@/components/reveal";
import { requireClub } from "@/lib/auth";
import { getClubEvents } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Manage Events — CampusConnect" };

export default async function ClubEventsPage() {
  const user = await requireClub();
  const scope = user.role === "admin" ? null : user.clubId;
  const events = await getClubEvents(scope);
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.startAt) > now && e.status !== "completed");
  const past = events.filter((e) => !upcoming.includes(e));

  function EventRow({ e }: { e: (typeof events)[number] }) {
    return (
      <Link
        href={`/club/events/${e.id}`}
        className="glass group flex flex-col gap-4 rounded-3xl p-4 transition-all hover:border-ink/20 sm:flex-row sm:items-center"
      >
        <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-2xl sm:w-36">
          <PosterArt posterUrl={e.posterUrl} category={e.category} title={e.title} />
          {e.status === "cancelled" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded-full border border-ink bg-rose px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.14em] text-cream uppercase">
                Cancelled
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={e.category} />
            {user.role === "admin" && (
              <span className="font-mono text-[10px] tracking-[0.14em] text-ink/35 uppercase">
                {e.clubName}
              </span>
            )}
            {e.requiresApproval && (
              <StatusBadge status="pending" className="normal-case" />
            )}
          </div>
          <h3 className="font-display mt-1.5 truncate text-[16px] font-bold transition-colors group-hover:text-mint">
            {e.title}
          </h3>
          <p className="mt-0.5 text-[12.5px] text-ink/45">
            {formatDate(e.startAt)} · {formatTime(e.startAt)} · {e.venue}
          </p>
        </div>
        <div className="flex w-full shrink-0 items-center gap-4 sm:w-56">
          <CapacityBar registered={e.registeredCount} capacity={e.capacity} />
          <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-all group-hover:translate-x-1 group-hover:text-ink" />
        </div>
      </Link>
    );
  }

  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold tracking-tight">
              Your <span className="font-accent text-gradient italic">events</span>
            </h1>
            <p className="mt-2 text-[14px] text-ink/50">
              {events.length} events · click any row to manage registrations.
            </p>
          </div>
          <Link
            href="/club/events/new"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-shadow hover:shadow-[4px_4px_0_#d63b22]"
          >
            <PlusCircle className="h-4 w-4" /> New event
          </Link>
        </div>
      </FadeIn>

      {events.length === 0 ? (
        <FadeIn delay={0.05}>
          <EmptyState
            icon={<CalendarX2 className="h-6 w-6" />}
            title="No events yet"
            subtitle="Create your first event — poster, capacity, QR check-in, everything included."
            action={
              <Link
                href="/club/events/new"
                className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper"
              >
                Create event
              </Link>
            }
          />
        </FadeIn>
      ) : (
        <>
          <FadeIn delay={0.05}>
            <h2 className="font-display text-lg font-bold text-ink/85">Live &amp; upcoming</h2>
            <div className="mt-4 space-y-3">
              {upcoming.map((e) => <EventRow key={e.id} e={e} />)}
            </div>
          </FadeIn>
          {past.length > 0 && (
            <FadeIn delay={0.1}>
              <h2 className="font-display text-lg font-bold text-ink/60">Past</h2>
              <div className="mt-4 space-y-3 opacity-70">
                {past.map((e) => <EventRow key={e.id} e={e} />)}
              </div>
            </FadeIn>
          )}
        </>
      )}
    </div>
  );
}
