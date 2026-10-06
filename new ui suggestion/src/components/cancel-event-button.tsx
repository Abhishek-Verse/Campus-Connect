"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cancelEventAction } from "@/lib/actions/club";

export function CancelEventButton({
  eventId,
  cancelled,
}: {
  eventId: string;
  cancelled: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      disabled={pending}
      onClick={() => {
        const msg = cancelled
          ? "Re-publish this event? Registration re-opens."
          : "Cancel this event? All registered students will be notified.";
        if (!confirm(msg)) return;
        startTransition(async () => {
          const res = await cancelEventAction(eventId);
          if (res.ok) toast.success(res.message);
          else toast.error(res.message);
          router.refresh();
        });
      }}
      className={
        cancelled
          ? "inline-flex items-center gap-2 rounded-full border border-mint/35 bg-mint/10 px-4 py-2 text-[12.5px] font-semibold text-mint transition-colors hover:bg-mint/20 disabled:opacity-50"
          : "inline-flex items-center gap-2 rounded-full border border-rose/30 bg-rose/10 px-4 py-2 text-[12.5px] font-semibold text-rose transition-colors hover:bg-rose/20 disabled:opacity-50"
      }
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : cancelled ? (
        <RotateCcw className="h-3.5 w-3.5" />
      ) : (
        <Ban className="h-3.5 w-3.5" />
      )}
      {cancelled ? "Re-publish event" : "Cancel event"}
    </button>
  );
}
