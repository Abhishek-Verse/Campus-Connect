import "server-only";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  inArray,
  ne,
  sql,
} from "drizzle-orm";
import { db } from "@/db";
import {
  announcements,
  certificates,
  clubs,
  events,
  notifications,
  registrations,
} from "@/db/schema";
import { formatDate, formatDay, formatTime, relativeDay } from "./utils";
import type {
  CertificateData,
  ClubRegistrationRow,
  EventCardData,
  MyRegistrationData,
  NotificationData,
  StudentStats,
} from "./types";

type EventRow = typeof events.$inferSelect & {
  club: typeof clubs.$inferSelect;
};

export function toCardData(
  event: EventRow,
  registeredCount: number,
  checkedInCount = 0,
): EventCardData {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    tags: event.tags,
    venue: event.venue,
    startAt: event.startAt.toISOString(),
    endAt: event.endAt ? event.endAt.toISOString() : null,
    dateLabel: formatDate(event.startAt),
    timeLabel: formatTime(event.startAt),
    relativeLabel: relativeDay(event.startAt),
    capacity: event.capacity,
    posterUrl: event.posterUrl,
    requiresApproval: event.requiresApproval,
    status: event.status,
    clubName: event.club.name,
    clubColor: event.club.color,
    clubSlug: event.club.slug,
    registeredCount,
    checkedInCount,
  };
}

async function registrationCounts(eventIds: string[]) {
  if (eventIds.length === 0)
    return new Map<string, { registered: number; checkedIn: number }>();
  const rows = await db
    .select({
      eventId: registrations.eventId,
      registered: count(
        sql`case when ${registrations.status} != 'cancelled' then 1 end`,
      ),
      checkedIn: count(
        sql`case when ${registrations.checkedIn} then 1 end`,
      ),
    })
    .from(registrations)
    .where(inArray(registrations.eventId, eventIds))
    .groupBy(registrations.eventId);
  return new Map(
    rows.map((r) => [
      r.eventId,
      { registered: Number(r.registered), checkedIn: Number(r.checkedIn) },
    ]),
  );
}

export async function getUpcomingEvents(limit?: number): Promise<EventCardData[]> {
  const rows = await db.query.events.findMany({
    where: and(
      eq(events.status, "published"),
      gt(events.startAt, new Date()),
    ),
    with: { club: true },
    orderBy: asc(events.startAt),
    limit,
  });
  const counts = await registrationCounts(rows.map((r) => r.id));
  return rows.map((r) =>
    toCardData(r, counts.get(r.id)?.registered ?? 0, counts.get(r.id)?.checkedIn ?? 0),
  );
}

export async function getEventById(id: string) {
  const row = await db.query.events.findFirst({
    where: eq(events.id, id),
    with: { club: true },
  });
  if (!row) return null;
  const counts = await registrationCounts([row.id]);
  const regs = counts.get(row.id);
  return {
    event: row,
    card: toCardData(row, regs?.registered ?? 0, regs?.checkedIn ?? 0),
  };
}

export async function getFeaturedClubs() {
  return db.query.clubs.findMany({ orderBy: asc(clubs.name) });
}

export async function getViewerRegistration(eventId: string, userId: string) {
  return db.query.registrations.findFirst({
    where: and(
      eq(registrations.eventId, eventId),
      eq(registrations.userId, userId),
    ),
  });
}

export async function getMyRegistrations(userId: string): Promise<MyRegistrationData[]> {
  const rows = await db.query.registrations.findMany({
    where: eq(registrations.userId, userId),
    with: { event: { with: { club: true } } },
    orderBy: desc(registrations.createdAt),
  });
  const certs = await db.query.certificates.findMany({
    where: eq(certificates.userId, userId),
  });
  const certByReg = new Map(certs.map((c) => [c.registrationId, c]));
  const counts = await registrationCounts(rows.map((r) => r.event.id));
  return rows.map((r) => {
    const cert = certByReg.get(r.id);
    return {
      registrationId: r.id,
      status: r.status,
      verifyCode: r.verifyCode,
      checkedIn: r.checkedIn,
      checkedInAt: r.checkedInAt ? r.checkedInAt.toISOString() : null,
      registeredAt: r.createdAt.toISOString(),
      certificateId: cert?.id ?? null,
      certificateCode: cert?.code ?? null,
      event: toCardData(
        r.event,
        counts.get(r.event.id)?.registered ?? 0,
        counts.get(r.event.id)?.checkedIn ?? 0,
      ),
    };
  });
}

export async function getStudentStats(userId: string): Promise<StudentStats> {
  const regs = await db.query.registrations.findMany({
    where: and(
      eq(registrations.userId, userId),
      ne(registrations.status, "cancelled"),
    ),
    with: { event: true },
  });
  const certs = await db
    .select({ n: count() })
    .from(certificates)
    .where(eq(certificates.userId, userId));
  const now = new Date();
  let attended = 0;
  let workshops = 0;
  let hackathons = 0;
  let upcoming = 0;
  let pending = 0;
  for (const r of regs) {
    if (r.checkedIn) {
      attended++;
      if (r.event.category === "workshop") workshops++;
      if (r.event.category === "hackathon") hackathons++;
    }
    if (r.event.startAt > now && r.event.status === "published") {
      if (r.status === "confirmed") upcoming++;
      if (r.status === "pending") pending++;
    }
  }
  return {
    attended,
    workshops,
    hackathons,
    certificates: Number(certs[0]?.n ?? 0),
    upcoming,
    pending,
  };
}

export async function getRecommendations(userId: string, interests: string[], limit = 4) {
  const upcomingEvents = await db.query.events.findMany({
    where: and(eq(events.status, "published"), gt(events.startAt, new Date())),
    with: { club: true },
    orderBy: asc(events.startAt),
  });
  const mine = await db.query.registrations.findMany({
    where: and(
      eq(registrations.userId, userId),
      ne(registrations.status, "cancelled"),
    ),
  });
  const mineIds = new Set(mine.map((m) => m.eventId));
  const interestSet = new Set(interests.map((i) => i.toLowerCase()));
  const scored = upcomingEvents
    .filter((e) => !mineIds.has(e.id))
    .map((e) => {
      const matches = e.tags.filter((t) => interestSet.has(t.toLowerCase()));
      return { event: e, matches };
    })
    .sort((a, b) =>
      b.matches.length !== a.matches.length
        ? b.matches.length - a.matches.length
        : a.event.startAt.getTime() - b.event.startAt.getTime(),
    );
  const top = scored.filter((s) => s.matches.length > 0).slice(0, limit);
  const chosen = top.length > 0 ? top : scored.slice(0, limit);
  const counts = await registrationCounts(chosen.map((c) => c.event.id));
  return chosen.map((c) => ({
    card: toCardData(
      c.event,
      counts.get(c.event.id)?.registered ?? 0,
      counts.get(c.event.id)?.checkedIn ?? 0,
    ),
    matches: c.matches,
  }));
}

export async function getNotifications(userId: string, limit = 12): Promise<NotificationData[]> {
  const rows = await db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: desc(notifications.createdAt),
    limit,
  });
  return rows.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    kind: n.kind,
    link: n.link,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
    dateLabel: formatDay(n.createdAt),
  }));
}

export async function getCertificates(userId: string): Promise<CertificateData[]> {
  const rows = await db.query.certificates.findMany({
    where: eq(certificates.userId, userId),
    with: { event: { with: { club: true } } },
    orderBy: desc(certificates.issuedAt),
  });
  return rows.map((c) => ({
    id: c.id,
    code: c.code,
    issuedAt: c.issuedAt.toISOString(),
    eventTitle: c.event.title,
    eventDate: c.event.startAt.toISOString(),
    clubName: c.event.club.name,
  }));
}

/* ------------------------------ club side ------------------------------ */

export async function getClubEvents(clubId: string | null): Promise<EventCardData[]> {
  const rows = await db.query.events.findMany({
    where: clubId ? eq(events.clubId, clubId) : undefined,
    with: { club: true },
    orderBy: desc(events.startAt),
  });
  const counts = await registrationCounts(rows.map((r) => r.id));
  return rows.map((r) =>
    toCardData(r, counts.get(r.id)?.registered ?? 0, counts.get(r.id)?.checkedIn ?? 0),
  );
}

export async function getClubStats(clubId: string | null) {
  const clubEvents = await getClubEvents(clubId);
  const now = new Date();
  const upcoming = clubEvents.filter(
    (e) => e.status === "published" && new Date(e.startAt) > now,
  );
  const totalRegistrations = clubEvents.reduce((a, e) => a + e.registeredCount, 0);
  const totalCheckedIn = clubEvents.reduce((a, e) => a + e.checkedInCount, 0);
  return {
    events: clubEvents.length,
    upcoming: upcoming.length,
    registrations: totalRegistrations,
    checkedIn: totalCheckedIn,
  };
}

export async function getEventRegistrations(eventId: string): Promise<ClubRegistrationRow[]> {
  const rows = await db.query.registrations.findMany({
    where: eq(registrations.eventId, eventId),
    with: { user: true },
    orderBy: asc(registrations.createdAt),
  });
  return rows.map((r) => ({
    registrationId: r.id,
    status: r.status,
    verifyCode: r.verifyCode,
    checkedIn: r.checkedIn,
    checkedInAt: r.checkedInAt ? r.checkedInAt.toISOString() : null,
    registeredAt: r.createdAt.toISOString(),
    registeredAtLabel: `${formatDay(r.createdAt)} · ${formatTime(r.createdAt)}`,
    checkedInAtLabel: r.checkedInAt ? formatTime(r.checkedInAt) : null,
    userName: r.user.name,
    userEmail: r.user.email,
  }));
}

export async function getRecentRegistrations(clubId: string | null, limit = 8) {
  const where = clubId
    ? and(
        ne(registrations.status, "cancelled"),
        inArray(
          registrations.eventId,
          db.select({ id: events.id }).from(events).where(eq(events.clubId, clubId)),
        ),
      )
    : ne(registrations.status, "cancelled");
  const rows = await db.query.registrations.findMany({
    where,
    with: { user: true, event: true },
    orderBy: desc(registrations.createdAt),
    limit,
  });
  return rows.map((r) => ({
    id: r.id,
    userName: r.user.name,
    eventTitle: r.event.title,
    status: r.status,
    checkedIn: r.checkedIn,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getClubAnnouncements(clubId: string | null, limit = 10) {
  const rows = await db.query.announcements.findMany({
    where: clubId ? eq(announcements.clubId, clubId) : undefined,
    with: { event: true, club: true },
    orderBy: desc(announcements.createdAt),
    limit,
  });
  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    message: a.message,
    eventTitle: a.event?.title ?? null,
    clubName: a.club.name,
    createdAt: a.createdAt.toISOString(),
  }));
}

export async function getEventAnnouncements(eventId: string) {
  const rows = await db.query.announcements.findMany({
    where: eq(announcements.eventId, eventId),
    with: { club: true },
    orderBy: desc(announcements.createdAt),
  });
  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    message: a.message,
    clubName: a.club.name,
    clubColor: a.club.color,
    createdAt: a.createdAt.toISOString(),
  }));
}

export async function getPlatformStats() {
  const [eventCount] = await db.select({ n: count() }).from(events);
  const [regCount] = await db
    .select({ n: count() })
    .from(registrations)
    .where(ne(registrations.status, "cancelled"));
  const [clubRows] = await db.select({ n: count() }).from(clubs);
  const [checkins] = await db
    .select({ n: count() })
    .from(registrations)
    .where(eq(registrations.checkedIn, true));
  return {
    events: Number(eventCount?.n ?? 0),
    registrations: Number(regCount?.n ?? 0),
    clubs: Number(clubRows?.n ?? 0),
    checkins: Number(checkins?.n ?? 0),
  };
}

export async function getCertificateWithDetails(id: string) {
  return db.query.certificates.findFirst({
    where: eq(certificates.id, id),
    with: { user: true, event: { with: { club: true } }, registration: true },
  });
}
