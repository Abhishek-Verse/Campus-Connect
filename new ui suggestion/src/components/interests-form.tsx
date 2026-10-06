"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { updateInterestsAction } from "@/lib/actions/auth";
import { INTERESTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function InterestsForm({ initial }: { initial: string[] }) {
  const [state, action, pending] = useActionState(updateInterestsAction, null);
  const [picked, setPicked] = useState<string[]>(initial);

  const toggle = (interest: string) =>
    setPicked((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length >= 5
          ? prev
          : [...prev, interest],
    );

  return (
    <form action={action} className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((interest) => {
          const active = picked.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] transition-all",
                active
                  ? "border-ink bg-ink font-semibold text-cream shadow-[2px_2px_0_#d63b22]"
                  : "border-ink/25 bg-cream text-ink/55 hover:border-ink/60 hover:text-ink",
              )}
            >
              {interest}
            </button>
          );
        })}
      </div>
      {picked.map((p) => (
        <input key={p} type="hidden" name="interests" value={p} />
      ))}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-shadow hover:shadow-[3px_3px_0_#d63b22] disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save interests
        </button>
        <span className="font-mono text-[11px] text-ink/35">{picked.length}/5 selected</span>
        {state?.success && (
          <span className="inline-flex items-center gap-1.5 text-[12.5px] text-mint">
            <CheckCircle2 className="h-3.5 w-3.5" /> {state.success}
          </span>
        )}
      </div>
    </form>
  );
}
