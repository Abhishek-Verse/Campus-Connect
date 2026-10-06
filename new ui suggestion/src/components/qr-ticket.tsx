"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, QrCode, X } from "lucide-react";
import { toast } from "sonner";
import { CategoryBadge } from "./bits";

export function QrTicketButton({
  qrDataUrl,
  verifyCode,
  eventTitle,
  eventDate,
  venue,
  category,
  holderName,
  compact = false,
}: {
  qrDataUrl: string;
  verifyCode: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  category: string;
  holderName: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          compact
            ? "inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-ink bg-cream px-3 py-1.5 text-[12px] font-semibold text-ink transition-all hover:shadow-[2px_2px_0_#181611]"
            : "flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-ink bg-ink py-3 text-sm font-semibold text-cream transition-all hover:shadow-[4px_4px_0_#d63b22]"
        }
      >
        <QrCode className="h-4 w-4" />
        View QR ticket
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.94, y: 24, opacity: 0, rotate: -1 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.96, y: 12, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border-[1.5px] border-ink bg-cream shadow-[10px_10px_0_#181611]"
            >
              {/* ticket header */}
              <div className="border-b-[1.5px] border-ink bg-ink px-6 pt-5 pb-4 text-cream">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CategoryBadge category={category} />
                    <h3 className="font-display mt-2.5 text-xl leading-snug font-bold">
                      {eventTitle}
                    </h3>
                    <p className="mt-1 text-[12.5px] text-cream/60">
                      {eventDate} · {venue}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-cream/25 p-2 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* perforation */}
              <div className="relative flex items-center justify-between px-0">
                <div className="absolute inset-x-4 top-1/2 border-t-2 border-dashed border-ink/25" />
                <div className="relative -left-3 h-6 w-6 rounded-full border-r-[1.5px] border-ink bg-paper" />
                <div className="relative -right-3 h-6 w-6 rounded-full border-l-[1.5px] border-ink bg-paper" />
              </div>

              <div className="px-6 pt-4 pb-6">
                <div className="mx-auto w-fit rounded-xl border-[1.5px] border-ink bg-white p-3 shadow-[4px_4px_0_#181611]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="QR ticket" className="h-48 w-48" />
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(verifyCode);
                    toast.success("Code copied");
                  }}
                  className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-ink/25 bg-cream px-4 py-2 font-mono text-[13px] font-bold tracking-[0.22em] text-ink/80 transition-all hover:shadow-[2px_2px_0_#181611]"
                >
                  {verifyCode}
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <p className="mt-4 text-center text-[11.5px] text-ink/45">
                  {holderName} · show this at the entrance for instant check-in
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
