"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions/registrations";
import type { NotificationData } from "@/lib/types";


const kindColor: Record<string, string> = {
  info: "#1d4ed8",
  success: "#0b6a62",
  warning: "#a16207",
};

export function NotificationBell({ notifications }: { notifications: NotificationData[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-ink/20 bg-cream text-ink/60 transition-all hover:shadow-[2px_2px_0_#181611] hover:text-ink"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border border-ink bg-flame px-1 text-[9.5px] font-bold text-cream">
            {unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97, rotate: -0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-50 mt-3 w-[min(92vw,380px)] overflow-hidden rounded-2xl border-[1.5px] border-ink bg-cream shadow-[8px_8px_0_rgba(24,22,17,0.9)]"
          >
            <div className="flex items-center justify-between border-b-[1.5px] border-ink/15 px-4 py-3">
              <p className="font-display text-sm font-bold">Notifications</p>
              {unread > 0 && (
                <button
                  onClick={async () => {
                    await markAllNotificationsRead();
                    router.refresh();
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-mint transition-colors hover:text-ink"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[380px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-ink/40">
                  <BellOff className="h-5 w-5" />
                  <p className="text-[12.5px]">Nothing yet — register for an event!</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={async () => {
                      await markNotificationRead(n.id);
                      setOpen(false);
                      if (n.link) router.push(n.link);
                      else router.refresh();
                    }}
                    className={`flex w-full gap-3 border-b border-ink/8 px-4 py-3.5 text-left transition-colors hover:bg-paper ${
                      n.read ? "opacity-55" : ""
                    }`}
                  >
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: kindColor[n.kind] ?? kindColor.info }}
                    />
                    <span className="min-w-0">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[13px] font-semibold text-ink/90">
                          {n.title}
                        </span>
                        <span className="shrink-0 font-mono text-[9px] tracking-wider text-ink/35 uppercase">
                          {n.dateLabel}
                        </span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[12px] leading-snug text-ink/55">
                        {n.message}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
