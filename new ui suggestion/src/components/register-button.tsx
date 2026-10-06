"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Ticket } from "lucide-react";
import { toast } from "sonner";
import { registerForEvent } from "@/lib/actions/registrations";

export function RegisterButton({
  eventId,
  requiresApproval,
}: {
  eventId: string;
  requiresApproval: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handle = () => {
    startTransition(async () => {
      const res = await registerForEvent(eventId);
      if (res.ok) {
        toast.success(res.message, {
          description: requiresApproval
            ? "The club will review your request shortly."
            : "Find your QR ticket under My Events.",
          icon: <CheckCircle2 className="h-4 w-4 text-mint" />,
        });
        router.refresh();
      } else {
        toast.error(res.message);
        router.refresh();
      }
    });
  };

  return (
    <button
      onClick={handle}
      disabled={pending}
      className="beam group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border-[1.5px] border-ink bg-flame py-3.5 text-sm font-bold text-cream transition-all hover:shadow-[5px_5px_0_#181611] disabled:opacity-70"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Ticket className="h-4 w-4 transition-transform group-hover:-rotate-12" />
          {requiresApproval ? "Request to join" : "Register now"}
        </>
      )}
    </button>
  );
}
