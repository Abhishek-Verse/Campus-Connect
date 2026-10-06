"use server";

import { and, eq, inArray, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  announcements,
  clubs,
  events,
  notifications,
  registrations,
} from "@/db/schema";
import { requireClub } from "@/lib/auth";
import type { FormState } from "./auth";

const CATEGORY_IDS = new Set([
  "technical",
  "cultural",
  "sports",
  "workshop",
  "hackathon",
  "seminar",
]);

async function assertClubAccess(clubId: string, userClubId: string | null, role: string) {
  if (role === "admin") return true;
  return userClubId === clubId;
}

export async function createEventAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireClub();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const venue = String(formData.get("venue") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const durationHours = Number(formData.get("duration") ?? 2);
  const capacity = Number(formData.get("capacity") ?? 0);
  const requiresApproval = formData.get("requiresApproval") === "on";
  const posterUrl = String(formData.get("posterUrl") ?? "").trim() || null;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5);
  const clubIdRaw = String(formData.get("clubId") ?? "");

  if (!title || !description || !category || !venue || !date || !time) {
    return { error: "Please fill in every required field." };
  }
  if (!CATEGORY_IDS.has(category)) return { error: "Pick a valid category." };
  if (!Number.isFinite(capacity) || capacity < 1 || capacity > 10000) {
    return { error: "Capacity must be between 1 and 10,000." };
  }
  const startAt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(startAt.getTime())) return { error: "Invalid date or time." };
  if (startAt.getTime() < Date.now() - 5 * 60000) {
    return { error: "The event start must be in the future." };
  }
  if (posterUrl && posterUrl.length > 1_600_000) {
    return { error: "Poster image is too large. Pick a smaller image or a preset." };
  }

  let clubId: string;
  if (user.role === "admin") {
    clubId = clubIdRaw;
    const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
    if (!club) return { error: "Choose the organising club." };
  } else {
    if (!user.clubId) return { error: "Your account is not linked to a club." };
    clubId = user.clubId;
  }

  const endAt = new Date(startAt.getTime() + Math.max(1, durationHours) * 3600000);
  const [created] = await db
    .insert(events)
    .values({
      clubId,
      title,
      description,
      category: category as (typeof events.$inferInsert)["category"],
      tags,
      venue,
      startAt,
      endAt,
      capacity,
      posterUrl,
      requiresApproval,
      status: "published",
    })
    .returning({ id: events.id });

  revalidatePath("/club/events");
  revalidatePath("/events");
  revalidatePath("/club");
  redirect(`/club/events/${created.id}`);
}

export async function cancelEventAction(eventId: string) {
  const user = await requireClub();
  const event = await db.query.events.findFirst({ where: eq(events.id, eventId) });
  if (!event || !(await assertClubAccess(event.clubId, user.clubId, user.role))) {
    return { ok: false, message: "Event not found." };
  }
  await db
    .update(events)
    .set({ status: event.status === "cancelled" ? "published" : "cancelled" })
    .where(eq(events.id, eventId));

  if (event.status !== "cancelled") {
    const regs = await db.query.registrations.findMany({
      where: and(eq(registrations.eventId, eventId), ne(registrations.status, "cancelled")),
    });
    if (regs.length > 0) {
      await db.insert(notifications).values(
        regs.map((r) => ({
          userId: r.userId,
          title: `Cancelled — ${event.title}`,
          message: `Unfortunately, ${event.title} has been cancelled by the organising club.`,
          kind: "warning",
          link: "/events",
        })),
      );
    }
  }
  revalidatePath(`/club/events/${eventId}`);
  revalidatePath("/club/events");
  revalidatePath("/club");
  revalidatePath("/events");
  return {
    ok: true,
    message: event.status === "cancelled" ? "Event re-published." : "Event cancelled and attendees notified.",
  };
}

export async function setRegistrationStatusAction(
  registrationId: string,
  action: "approve" | "cancel",
) {
  const user = await requireClub();
  const reg = await db.query.registrations.findFirst({
    where: eq(registrations.id, registrationId),
    with: { event: true },
  });
  if (!reg || !(await assertClubAccess(reg.event.clubId, user.clubId, user.role))) {
    return { ok: false, message: "Registration not found." };
  }
  if (action === "approve") {
    if (reg.status === "confirmed") return { ok: false, message: "Already confirmed." };
    await db
      .update(registrations)
      .set({ status: "confirmed" })
      .where(eq(registrations.id, registrationId));
    await db.insert(notifications).values({
      userId: reg.userId,
      title: `Approved — ${reg.event.title}`,
      message: `The club approved your registration for ${reg.event.title}. Your QR ticket is now active.`,
      kind: "success",
      link: "/dashboard/my-events",
    });
  } else {
    if (reg.status === "cancelled") return { ok: false, message: "Already cancelled." };
    await db
      .update(registrations)
      .set({ status: "cancelled" })
      .where(eq(registrations.id, registrationId));
    await db.insert(notifications).values({
      userId: reg.userId,
      title: `Registration declined — ${reg.event.title}`,
      message: `Your registration for ${reg.event.title} was declined by the organising club.`,
      kind: "warning",
      link: "/events",
    });
  }
  revalidatePath(`/club/events/${reg.eventId}`);
  revalidatePath("/club/events");
  revalidatePath("/club");
  return { ok: true, message: action === "approve" ? "Registration approved." : "Registration cancelled." };
}

export async function sendAnnouncementAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireClub();
  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const eventId = String(formData.get("eventId") ?? "").trim() || null;

  if (!title || !message) return { error: "Add a title and message." };

  let clubId: string;
  if (eventId) {
    const event = await db.query.events.findFirst({ where: eq(events.id, eventId) });
    if (!event || !(await assertClubAccess(event.clubId, user.clubId, user.role))) {
      return { error: "Event not found." };
    }
    clubId = event.clubId;
  } else {
    if (user.role === "admin") return { error: "Pick an event for this announcement." };
    if (!user.clubId) return { error: "Your account is not linked to a club." };
    clubId = user.clubId;
  }

  await db.insert(announcements).values({ clubId, eventId, title, message });

  // Fan out notifications to every actively registered student.
  const regs = eventId
    ? await db.query.registrations.findMany({
        where: and(eq(registrations.eventId, eventId), ne(registrations.status, "cancelled")),
      })
    : await db.query.registrations.findMany({
        where: and(
          ne(registrations.status, "cancelled"),
          inArray(
            registrations.eventId,
            db.select({ id: events.id }).from(events).where(eq(events.clubId, clubId)),
          ),
        ),
      });
  const userIds = [...new Set(regs.map((r) => r.userId))];
  if (userIds.length > 0) {
    await db.insert(notifications).values(
      userIds.map((uid) => ({
        userId: uid,
        title,
        message,
        kind: "info",
        link: eventId ? `/events/${eventId}` : "/dashboard",
      })),
    );
  }

  revalidatePath("/club");
  if (eventId) revalidatePath(`/club/events/${eventId}`);
  return { success: `Announcement sent to ${userIds.length} student${userIds.length === 1 ? "" : "s"}.` };
}
