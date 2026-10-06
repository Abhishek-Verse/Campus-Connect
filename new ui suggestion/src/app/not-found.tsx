import Link from "next/link";
import { Compass } from "lucide-react";
import { AuroraBackdrop } from "@/components/aurora";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <AuroraBackdrop />
      <Logo className="absolute top-6 left-6" />
      <p className="sticker inline-block rounded-full px-4 py-1.5 font-mono text-[11px] font-bold tracking-[0.3em] text-ink/60 uppercase">
        Error 404
      </p>
      <h1 className="font-display mt-6 text-[clamp(3rem,10vw,7rem)] leading-none font-black tracking-tight text-ink">
        Off <span className="font-accent text-flame font-medium italic">campus.</span>
      </h1>
      <p className="mt-4 max-w-sm text-[14.5px] text-ink/55">
        This page wandered off between lectures. Let&apos;s get you back to
        where the action is.
      </p>
      <Link
        href="/events"
        className="mt-8 inline-flex items-center gap-2 rounded-xl border-[1.5px] border-ink bg-ink px-6 py-3 text-sm font-bold text-cream transition-all hover:shadow-[5px_5px_0_#d63b22]"
      >
        <Compass className="h-4 w-4" /> Browse events
      </Link>
    </main>
  );
}
