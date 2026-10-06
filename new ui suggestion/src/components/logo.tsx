import { Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  compact = false,
  inverted = false,
  className,
}: {
  href?: string;
  compact?: boolean;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2.5", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-ink shadow-[3px_3px_0_#d63b22] transition-transform duration-300 group-hover:rotate-3">
        <Zap className="h-4.5 w-4.5 text-cream" fill="currentColor" strokeWidth={1} />
      </span>
      {!compact && (
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "font-display text-[18px] font-bold tracking-tight",
              inverted ? "text-cream" : "text-ink",
            )}
          >
            Campus<span className="text-flame">Connect</span>
          </span>
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.14em]",
              inverted ? "border-cream/40 text-cream/70" : "border-ink/30 text-ink/60",
            )}
          >
            TCET
          </span>
        </span>
      )}
    </Link>
  );
}
