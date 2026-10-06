"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw, TriangleAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    // Cold-start / sandbox wake-up: try again automatically once.
    const t = setTimeout(() => reset(), 1800);
    return () => clearTimeout(t);
  }, [error, reset]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <div className="sticker inline-flex h-14 w-14 items-center justify-center rounded-2xl text-flame">
        <TriangleAlert className="h-7 w-7" />
      </div>
      <h1 className="font-display mt-6 text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight">
        Warming up<span className="font-accent text-flame font-medium italic">…</span>
      </h1>
      <p className="mt-3 max-w-sm text-[14.5px] text-ink/55">
        The server just woke up — this usually fixes itself in a second. If not,
        hit retry.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-ink bg-ink px-6 py-3 text-sm font-bold text-cream transition-all hover:shadow-[5px_5px_0_#d63b22]"
        >
          <RefreshCcw className="h-4 w-4" /> Retry
        </button>
        <Link
          href="/"
          className="rounded-xl border-[1.5px] border-ink/25 bg-cream px-6 py-3 text-sm font-bold text-ink transition-all hover:shadow-[5px_5px_0_#181611]"
        >
          Go home
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-ink/30 uppercase">
          Ref {error.digest}
        </p>
      )}
    </main>
  );
}
