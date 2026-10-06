import { ScanLine, CalendarX2 } from "lucide-react";
import { EmptyState } from "@/components/bits";
import { FadeIn } from "@/components/reveal";
import { Scanner } from "@/components/scanner";
import { requireClub } from "@/lib/auth";
import { getClubEvents, getEventRegistrations } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "QR Check-in — CampusConnect" };

export default async function CheckinPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const user = await requireClub();
  const { event: eventParam } = await searchParams;
  const scope = user.role === "admin" ? null : user.clubId;
  const events = await getClubEvents(scope);

  const selectable = events
    .filter((e) => e.status === "published")
    .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

  const selectedId = selectable.some((e) => e.id === eventParam)
    ? eventParam!
    : selectable[0]?.id;

  const initialCheckedIn = selectedId
    ? (await getEventRegistrations(selectedId))
        .filter((r) => r.checkedIn)
        .map((r) => ({
          name: r.userName,
          at: r.checkedInAt
            ? new Date(r.checkedInAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        }))
        .reverse()
    : [];

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="font-display flex items-center gap-3 text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold tracking-tight">
          <ScanLine className="h-7 w-7 text-mint" />
          QR <span className="font-accent text-gradient italic">check-in</span>
        </h1>
        <p className="mt-2 max-w-xl text-[14px] text-ink/50">
          Verify tickets at the door. Successful scans mark attendance and issue
          certificates automatically.
        </p>
      </FadeIn>
      <FadeIn delay={0.06}>
        {selectable.length === 0 ? (
          <EmptyState
            icon={<CalendarX2 className="h-6 w-6" />}
            title="No published events"
            subtitle="Create and publish an event first, then come back to check students in."
          />
        ) : (
          <Scanner
            events={selectable.map((e) => ({
              id: e.id,
              title: e.title,
              meta: formatDate(e.startAt),
            }))}
            initialEventId={selectedId}
            initialCheckedIn={initialCheckedIn}
          />
        )}
      </FadeIn>
    </div>
  );
}
