import { AuroraBackdrop } from "@/components/aurora";
import { EventBrowser } from "@/components/event-browser";
import { SiteNav } from "@/components/site-nav";
import { getUpcomingEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Browse events — CampusConnect" };

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const events = await getUpcomingEvents();

  return (
    <main className="relative min-h-screen">
      <AuroraBackdrop />
      <SiteNav />
      <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 sm:px-8">
        <div className="mb-10">
          <p className="font-mono text-[11px] tracking-[0.24em] text-mint uppercase">
            // open for registration
          </p>
          <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight">
            What&apos;s on <span className="font-accent text-gradient italic">campus</span>
          </h1>
          <p className="mt-3 max-w-lg text-[14.5px] text-ink/50">
            {events.length} upcoming events across every club. Filter by vibe,
            grab a seat before it fills.
          </p>
        </div>
        <EventBrowser events={events} initialCategory={category ?? "all"} />
      </div>
    </main>
  );
}
