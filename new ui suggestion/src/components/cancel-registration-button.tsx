"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cancelMyRegistration } from "@/lib/actions/registrations";

export function CancelRegistrationButton({ registrationId }: { registrationId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm("Cancel this registration? Your seat will be released.")) return;
        startTransition(async () => {
          const res = await cancelMyRegistration(registrationId);
          if (res.ok) toast.success(res.message);
          else toast.error(res.message);
          router.refresh();
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-ink/10 px-3 py-1.5 text-[12px] text-ink/50 transition-colors hover:border-rose/40 hover:text-rose disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
      Cancel
    </button>
  );
}
