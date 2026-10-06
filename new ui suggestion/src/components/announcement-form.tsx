"use client";

import { useActionState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, Loader2, Megaphone } from "lucide-react";
import { sendAnnouncementAction } from "@/lib/actions/club";

const inputCls =
  "w-full rounded-xl border-[1.5px] border-ink/20 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/35 outline-none transition-all focus:border-ink focus:shadow-[3px_3px_0_rgba(24,22,17,0.85)]";

export function AnnouncementForm({
  eventId,
  events,
}: {
  eventId?: string;
  events?: { id: string; title: string }[];
}) {
  const [state, action, pending] = useActionState(sendAnnouncementAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const lastSuccess = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state?.success && state.success !== lastSuccess.current) {
      lastSuccess.current = state.success;
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-rose/60 bg-rose/10 px-4 py-2.5 text-[13px] text-rose">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-mint/60 bg-mint/10 px-4 py-2.5 text-[13px] text-mint">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {state.success}
        </div>
      )}
      {eventId ? (
        <input type="hidden" name="eventId" value={eventId} />
      ) : (
        <select name="eventId" className={inputCls} defaultValue="">
          <option value="">All active registrants (club-wide)</option>
          {events?.map((e) => (
            <option key={e.id} value={e.id}>
              Only: {e.title}
            </option>
          ))}
        </select>
      )}
      <input name="title" placeholder="Announcement title" required className={inputCls} />
      <textarea
        name="message"
        placeholder="Write your message… every registered student gets a notification."
        required
        rows={3}
        className={inputCls}
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-ink bg-ink px-5 py-2.5 text-[13px] font-bold text-cream transition-all hover:shadow-[4px_4px_0_#d63b22] disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />}
        Send announcement
      </button>
    </form>
  );
}
