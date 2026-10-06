import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_GRADIENTS, categoryMeta } from "@/lib/constants";
import type { EventCardData } from "@/lib/types";

import { CapacityBar, CategoryBadge, EventMetaLine } from "./bits";

export function PosterArt({
  posterUrl,
  category,
  title,
  className = "h-full w-full",
}: {
  posterUrl: string | null;
  category: string;
  title: string;
  className?: string;
}) {
  if (posterUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={posterUrl}
        alt={title}
        className={`${className} object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]`}
      />
    );
  }
  const [from, to] = CATEGORY_GRADIENTS[category] ?? ["#1a1a2e", "#d63b22"];
  const meta = categoryMeta(category);
  return (
    <div
      className={`${className} poster-dots relative overflow-hidden`}
      style={{
        background: `radial-gradient(120% 140% at 20% 10%, ${to}40 0%, transparent 55%), linear-gradient(150deg, ${from}, #14110b 85%)`,
      }}
    >
      <span
        className="absolute top-4 left-5 font-display text-[64px] leading-none font-bold italic opacity-25"
        style={{ color: meta.color === "#181611" ? "#d63b22" : meta.color }}
      >
        {meta.label.slice(0, 2).toUpperCase()}
      </span>
      <div
        className="absolute -right-8 -bottom-10 h-36 w-36 rounded-full blur-3xl"
        style={{ background: `${meta.color}55` }}
      />
    </div>
  );
}

export function EventCard({ event }: { event: EventCardData }) {
  const full = event.registeredCount >= event.capacity;
  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border-[1.5px] border-ink bg-cream transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[7px_7px_0_#181611]"
    >
      <div className="relative h-44 overflow-hidden border-b-[1.5px] border-ink">
        <PosterArt
          posterUrl={event.posterUrl}
          category={event.category}
          title={event.title}
        />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={event.category} className="shadow-[2px_2px_0_#181611]" />
        </div>
        <div className="sticker absolute right-3 bottom-3 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-ink/75 uppercase">
          {event.relativeLabel}
        </div>
        {full && (
          <div className="absolute top-3 right-3 rotate-3 rounded-md border border-ink bg-flame px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.14em] text-cream uppercase shadow-[2px_2px_0_#181611]">
            Full
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-[18px] leading-snug font-bold tracking-tight text-ink transition-colors group-hover:text-flame">
            {event.title}
          </h3>
          <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-ink/45 uppercase">
            {event.clubName}
          </p>
        </div>
        <EventMetaLine dateLabel={event.dateLabel} timeLabel={event.timeLabel} venue={event.venue} />
        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <CapacityBar registered={event.registeredCount} capacity={event.capacity} />
          <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/25 text-ink/50 transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-cream">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
