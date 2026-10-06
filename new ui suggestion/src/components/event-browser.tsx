"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarSearch, Search, SlidersHorizontal } from "lucide-react";
import { EmptyState } from "./bits";
import { EventCard } from "./event-card";
import { CATEGORIES } from "@/lib/constants";
import type { EventCardData } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "soonest" | "popular" | "seats";

export function EventBrowser({
  events,
  initialCategory = "all",
}: {
  events: EventCardData[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("soonest");

  const filtered = useMemo(() => {
    let list = events;
    if (category !== "all") list = list.filter((e) => e.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.clubName.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return [...list].sort((a, b) => {
      if (sort === "popular") return b.registeredCount - a.registeredCount;
      if (sort === "seats")
        return b.capacity - b.registeredCount - (a.capacity - a.registeredCount);
      return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
    });
  }, [events, category, query, sort]);

  return (
    <div>
      {/* controls */}
      <div className="glass sticky top-4 z-30 mb-8 rounded-2xl p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, clubs, venues, tags…"
              className="w-full rounded-xl border border-ink/8 bg-ink/[0.03] py-2.5 pr-4 pl-10 text-sm outline-none placeholder:text-ink/30 focus:border-glow/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-ink/35" />
            {(
              [
                ["soonest", "Soonest"],
                ["popular", "Most popular"],
                ["seats", "Most seats left"],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[12px] whitespace-nowrap transition-all",
                  sort === key
                    ? "bg-ink text-paper font-semibold"
                    : "text-ink/50 hover:bg-ink/8 hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] transition-all",
              category === "all"
                ? "border-white bg-ink font-semibold text-paper"
                : "border-ink/10 text-ink/55 hover:border-ink/25 hover:text-ink",
            )}
          >
            All
          </button>
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(active ? "all" : c.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] transition-all",
                  active
                    ? "font-semibold"
                    : "border-ink/10 text-ink/55 hover:border-ink/25 hover:text-ink",
                )}
                style={
                  active
                    ? {
                        background: `${c.color}22`,
                        borderColor: `${c.color}66`,
                        color: c.color,
                      }
                    : undefined
                }
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarSearch className="h-6 w-6" />}
          title="No events match"
          subtitle="Try a different category or clear your search."
        />
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((e) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <EventCard event={e} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
