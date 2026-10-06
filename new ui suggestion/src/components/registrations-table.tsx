"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Download,
  Loader2,
  UserX,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { setRegistrationStatusAction } from "@/lib/actions/club";
import type { ClubRegistrationRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar } from "./bits";

type Filter = "all" | "pending" | "confirmed" | "checkedin" | "cancelled";

export function RegistrationsTable({
  rows,
  eventId,
}: {
  rows: ClubRegistrationRow[];
  eventId: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    switch (filter) {
      case "pending":
        return rows.filter((r) => r.status === "pending");
      case "confirmed":
        return rows.filter((r) => r.status === "confirmed" && !r.checkedIn);
      case "checkedin":
        return rows.filter((r) => r.checkedIn);
      case "cancelled":
        return rows.filter((r) => r.status === "cancelled");
      default:
        return rows;
    }
  }, [rows, filter]);

  const act = (registrationId: string, action: "approve" | "cancel") => {
    setBusyId(registrationId);
    startTransition(async () => {
      const res = await setRegistrationStatusAction(registrationId, action);
      if (res.ok) toast.success(res.message);
      else toast.error(res.message);
      setBusyId(null);
      router.refresh();
    });
  };

  const counts: Record<Filter, number> = {
    all: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    confirmed: rows.filter((r) => r.status === "confirmed" && !r.checkedIn).length,
    checkedin: rows.filter((r) => r.checkedIn).length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", "All"],
              ["pending", "Pending"],
              ["confirmed", "Confirmed"],
              ["checkedin", "Checked in"],
              ["cancelled", "Cancelled"],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11.5px] transition-all",
                filter === key
                  ? "border-white bg-ink font-semibold text-paper"
                  : "border-ink/10 text-ink/50 hover:border-ink/25 hover:text-ink",
              )}
            >
              {label}
              <span className="ml-1.5 opacity-60">{counts[key]}</span>
            </button>
          ))}
        </div>
        <a
          href={`/api/club/events/${eventId}/participants`}
          className="inline-flex items-center gap-1.5 rounded-full border border-mint/35 bg-mint/10 px-4 py-1.5 text-[11.5px] font-semibold text-mint transition-colors hover:bg-mint/20"
        >
          <Download className="h-3.5 w-3.5" /> Participant list (CSV)
        </a>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl px-6 py-10 text-center text-[13px] text-ink/40">
          <UserX className="mx-auto mb-2 h-5 w-5" />
          No registrations in this bucket.
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-ink/8 font-mono text-[9.5px] tracking-[0.18em] text-ink/35 uppercase">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const busy = pending && busyId === r.registrationId;
                  return (
                    <tr
                      key={r.registrationId}
                      className="border-b border-ink/5 transition-colors last:border-0 hover:bg-ink/[0.03]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={r.userName} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink/90">{r.userName}</p>
                            <p className="truncate text-[11px] text-ink/40">{r.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-ink/50">
                        {r.registeredAtLabel}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] tracking-[0.14em] text-ink/55">
                          {r.verifyCode}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {r.checkedIn ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-mint/30 bg-mint/10 px-2 py-0.5 text-[11px] text-mint">
                            <Check className="h-3 w-3" /> In
                          </span>
                        ) : r.status === "pending" ? (
                          <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[11px] text-gold">
                            Pending
                          </span>
                        ) : r.status === "cancelled" ? (
                          <span className="rounded-full border border-rose/30 bg-rose/10 px-2 py-0.5 text-[11px] text-rose">
                            Cancelled
                          </span>
                        ) : (
                          <span className="rounded-full border border-ink/15 bg-ink/5 px-2 py-0.5 text-[11px] text-ink/60">
                            Confirmed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin text-ink/40" />
                          ) : (
                            <>
                              {r.status === "pending" && (
                                <button
                                  onClick={() => act(r.registrationId, "approve")}
                                  className="rounded-lg border border-mint/35 bg-mint/10 p-1.5 text-mint transition-colors hover:bg-mint/20"
                                  title="Approve"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {r.status === "cancelled" ? (
                                <button
                                  onClick={() => act(r.registrationId, "approve")}
                                  className="rounded-lg border border-ink/15 bg-ink/5 px-2.5 py-1.5 text-[11px] text-ink/60 transition-colors hover:bg-ink/10"
                                  title="Reinstate"
                                >
                                  Restore
                                </button>
                              ) : (
                                !r.checkedIn && (
                                  <button
                                    onClick={() => act(r.registrationId, "cancel")}
                                    className="rounded-lg border border-rose/30 bg-rose/10 p-1.5 text-rose transition-colors hover:bg-rose/20"
                                    title="Cancel registration"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                )
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
