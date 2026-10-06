import type { ReactNode } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { categoryMeta } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const meta = categoryMeta(category);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.14em] uppercase",
        className,
      )}
      style={{
        color: meta.color,
        borderColor: `${meta.color}55`,
        background: "#fdfbf4",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  );
}

export function StatusBadge({
  status,
  checkedIn = false,
  className,
}: {
  status: string;
  checkedIn?: boolean;
  className?: string;
}) {
  const map: Record<string, { label: string; cls: string }> = {
    confirmed: {
      label: "Confirmed",
      cls: "border-mint/40 bg-mint/10 text-mint",
    },
    pending: {
      label: "Pending approval",
      cls: "border-gold/40 bg-gold/10 text-gold",
    },
    cancelled: {
      label: "Cancelled",
      cls: "border-rose/40 bg-rose/10 text-rose",
    },
    attended: {
      label: "Checked in",
      cls: "border-ink bg-ink text-cream",
    },
  };
  const key = checkedIn ? "attended" : status;
  const item = map[key] ?? map.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.12em] uppercase",
        item.cls,
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {item.label}
    </span>
  );
}

export function CapacityBar({
  registered,
  capacity,
  showLabel = true,
}: {
  registered: number;
  capacity: number;
  showLabel?: boolean;
}) {
  const pct = Math.min(100, Math.round((registered / capacity) * 100));
  const full = registered >= capacity;
  const almost = !full && pct >= 80;
  const barColor = full
    ? "#d63b22"
    : almost
      ? "#a16207"
      : "#0b6a62";
  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-ink/50 uppercase">
          <span>
            {registered} / {capacity} registered
          </span>
          <span
            className={cn(
              "font-bold",
              full ? "text-flame" : almost ? "text-gold" : "text-ink/50",
            )}
          >
            {full ? "Full" : `${capacity - registered} left`}
          </span>
        </div>
      )}
      <div className="h-2 w-full rounded-full border border-ink/15 bg-ink/8 p-[1.5px]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.max(pct, 4)}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

export function EventMetaLine({
  dateLabel,
  timeLabel,
  venue,
  className,
}: {
  dateLabel: string;
  timeLabel: string;
  venue: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-ink/55",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5 text-ink/40" />
        {dateLabel} · {timeLabel}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-ink/40" />
        {venue}
      </span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-3xl border-dashed px-8 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-ink/15 bg-cream text-ink/45">
        {icon}
      </div>
      <p className="font-display text-lg font-semibold text-ink/85">{title}</p>
      {subtitle && <p className="mt-1.5 max-w-sm text-sm text-ink/50">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "h-7 w-7 text-[10px]", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" };
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-cream",
        sizes[size],
        className,
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${h} 62% 38%), hsl(${(h + 50) % 360} 58% 30%))`,
      }}
    >
      {name
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </span>
  );
}
