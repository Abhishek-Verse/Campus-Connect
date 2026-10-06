"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  Keyboard,
  Loader2,
  ScanLine,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ScanResult = {
  state: "ok" | "already" | "invalid" | "wrong-event" | "cancelled" | "pending" | "error";
  message: string;
  name?: string;
  email?: string;
  at: string;
};

const stateStyles: Record<string, { border: string; text: string; label: string; icon: ReactNode }> = {
  ok: {
    border: "border-mint",
    text: "text-mint",
    label: "Checked in",
    icon: <CheckCircle2 className="h-6 w-6" />,
  },
  already: {
    border: "border-ink",
    text: "text-ink",
    label: "Already in",
    icon: <UserCheck className="h-6 w-6" />,
  },
  invalid: { border: "border-rose", text: "text-rose", label: "Invalid ticket", icon: <ShieldAlert className="h-6 w-6" /> },
  "wrong-event": { border: "border-gold", text: "text-gold", label: "Wrong event", icon: <ShieldAlert className="h-6 w-6" /> },
  cancelled: { border: "border-rose", text: "text-rose", label: "Cancelled", icon: <ShieldAlert className="h-6 w-6" /> },
  pending: { border: "border-gold", text: "text-gold", label: "Pending approval", icon: <ShieldAlert className="h-6 w-6" /> },
  error: { border: "border-rose", text: "text-rose", label: "Error", icon: <ShieldAlert className="h-6 w-6" /> },
};

export function Scanner({
  events,
  initialEventId,
  initialCheckedIn,
}: {
  events: { id: string; title: string; meta: string }[];
  initialEventId?: string;
  initialCheckedIn: { name: string; at: string }[];
}) {
  const [eventId, setEventId] = useState(initialEventId ?? events[0]?.id ?? "");
  const [running, setRunning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [feed, setFeed] = useState<{ name: string; at: string; state: string }[]>(
    initialCheckedIn.map((c) => ({ ...c, state: "ok" })),
  );
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
  const lastScan = useRef<{ code: string; time: number } | null>(null);
  const mounted = useRef(true);

  const verify = useCallback(
    async (code: string) => {
      if (!eventId) return;
      setBusy(true);
      try {
        const res = await fetch("/api/club/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, eventId }),
        });
        const data = (await res.json()) as {
          state: ScanResult["state"];
          message: string;
          name?: string;
          email?: string;
        };
        if (!mounted.current) return;
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setResult({ ...data, at: now });
        if (data.state === "ok" && data.name) {
          setFeed((f) => [{ name: data.name!, at: now, state: "ok" }, ...f].slice(0, 25));
        }
      } catch {
        if (mounted.current) setResult({ state: "error", message: "Network error.", at: "" });
      } finally {
        if (mounted.current) setBusy(false);
      }
    },
    [eventId],
  );

  const stopCamera = useCallback(async () => {
    try {
      await scannerRef.current?.stop();
      scannerRef.current?.clear();
    } catch {
      /* already stopped */
    }
    scannerRef.current = null;
    setRunning(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
      const instance = new Html5Qrcode("qr-reader", {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      scannerRef.current = instance;
      await instance.start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 230, height: 230 } },
        (decoded: string) => {
          const now = Date.now();
          if (lastScan.current && lastScan.current.code === decoded && now - lastScan.current.time < 4000) {
            return;
          }
          lastScan.current = { code: decoded, time: now };
          verify(decoded);
        },
        () => {},
      );
      setRunning(true);
    } catch {
      setCameraError(
        "Camera unavailable. Check browser permissions — or use manual code entry below.",
      );
      setRunning(false);
    }
  }, [verify]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      void stopCamera();
    };
  }, [stopCamera]);

  const style = result ? stateStyles[result.state] ?? stateStyles.error : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        {/* event picker */}
        <div className="glass rounded-2xl p-4">
          <label className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-ink/50 uppercase">
            Checking in for
          </label>
          <select
            value={eventId}
            onChange={async (e) => {
              await stopCamera();
              setEventId(e.target.value);
              setResult(null);
            }}
            className="w-full rounded-xl border-[1.5px] border-ink/20 bg-cream px-4 py-3 text-sm outline-none focus:border-ink"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} — {e.meta}
              </option>
            ))}
          </select>
        </div>

        {/* camera */}
        <div className="glass relative overflow-hidden rounded-3xl p-4">
          <div
            className={cn(
              "relative mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-2xl border-2 border-dashed",
              running ? "border-mint/60 bg-ink" : "border-ink/25 bg-ink/[0.06]",
            )}
          >
            <div id="qr-reader" className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />
            {!running && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink/40">
                <Camera className="h-8 w-8" />
                <p className="max-w-[220px] text-center text-[12.5px]">
                  Start the camera and point it at a student&apos;s QR ticket
                </p>
              </div>
            )}
            {running && (
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-flame to-transparent opacity-80" />
                <ScanLine className="absolute inset-0 m-auto h-56 w-56 text-cream/25" />
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            {running ? (
              <button
                onClick={stopCamera}
                className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-rose bg-rose/10 px-5 py-2.5 text-[13px] font-bold text-rose transition-colors hover:bg-rose/20"
              >
                <CameraOff className="h-4 w-4" /> Stop camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-ink bg-ink px-5 py-2.5 text-[13px] font-bold text-cream transition-all hover:shadow-[4px_4px_0_#d63b22]"
              >
                <Camera className="h-4 w-4" /> Start camera
              </button>
            )}
          </div>
          {cameraError && (
            <p className="mt-3 text-center text-[12.5px] text-gold">{cameraError}</p>
          )}
        </div>

        {/* manual entry */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manual.trim()) {
              verify(manual.trim());
              setManual("");
            }
          }}
          className="glass rounded-2xl p-4"
        >
          <label className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-ink/50 uppercase">
            <Keyboard className="h-3.5 w-3.5" /> Manual code entry
          </label>
          <div className="flex gap-2">
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value.toUpperCase())}
              placeholder="e.g. K7PX9W2QTA"
              className="flex-1 rounded-xl border-[1.5px] border-ink/20 bg-cream px-4 py-3 font-mono text-sm tracking-[0.2em] outline-none placeholder:text-ink/30 focus:border-ink"
            />
            <button
              type="submit"
              disabled={busy || !manual.trim()}
              className="rounded-xl border-[1.5px] border-ink bg-flame px-5 text-[13px] font-bold text-cream transition-all hover:shadow-[3px_3px_0_#181611] disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
            </button>
          </div>
        </form>
      </div>

      {/* result + feed */}
      <div className="space-y-5">
        <AnimatePresence mode="wait">
          {result && style ? (
            <motion.div
              key={result.message + result.at + (result.name ?? "")}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className={cn("rounded-3xl border-2 bg-cream p-6 text-center shadow-[6px_6px_0_#181611]", style.border)}
            >
              <div className={cn("mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-ink/15 bg-paper", style.text)}>
                {style.icon}
              </div>
              <p className={cn("font-display mt-4 text-xl font-bold", style.text)}>
                {result.name ?? style.label}
              </p>
              <p className="mt-1 text-[12.5px] text-ink/55">{result.message}</p>
              {result.email && (
                <p className="mt-1 font-mono text-[11px] text-ink/40">{result.email}</p>
              )}
              {result.state === "ok" && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                  Certificate issued
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl border-dashed p-6 text-center text-ink/40"
            >
              <ScanLine className="mx-auto h-7 w-7" />
              <p className="mt-3 text-[13px]">
                Scan a QR ticket or enter a code — verification appears here instantly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[15px] font-bold">Check-in feed</h3>
            <span className="rounded-full border border-mint/40 bg-mint/10 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-mint">
              {feed.length}
            </span>
          </div>
          <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {feed.length === 0 && (
              <p className="py-4 text-center text-[12.5px] text-ink/40">
                No one checked in yet.
              </p>
            )}
            <AnimatePresence initial={false}>
              {feed.map((f, i) => (
                <motion.div
                  key={`${f.name}-${f.at}-${i}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2.5 rounded-xl border border-ink/12 bg-cream px-3 py-2"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-mint" />
                  <span className="flex-1 truncate text-[12.5px] font-medium">{f.name}</span>
                  <span className="font-mono text-[10px] text-ink/40">{f.at}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
