import { db } from "@/db";
import { clubs } from "@/db/schema";
import { asc } from "drizzle-orm";
import { EventForm } from "@/components/event-form";
import { FadeIn } from "@/components/reveal";
import { requireClub } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "New Event — CampusConnect" };

export default async function NewEventPage() {
  const user = await requireClub();
  const clubOptions =
    user.role === "admin"
      ? (await db.query.clubs.findMany({ orderBy: asc(clubs.name) })).map((c) => ({
          id: c.id,
          name: c.name,
        }))
      : [];

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold tracking-tight">
          Create an <span className="font-accent text-gradient italic">event</span>
        </h1>
        <p className="mt-2 text-[14px] text-ink/50">
          Published events appear on the student feed instantly with QR ticketing
          and live capacity tracking.
        </p>
      </FadeIn>
      <FadeIn delay={0.06}>
        <div className="glass rounded-[28px] p-6 sm:p-8">
          <EventForm clubs={clubOptions} />
        </div>
      </FadeIn>
    </div>
  );
}
