"use server";

import { and, count, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { events, notifications, registrations } from "@/db/schema";
import { getSessionUser, requireStudent } from "@/lib/auth";
import { randomCode } from "@/lib/utils";

export type ActionResult = { ok: boolean; message: string; status?: string };

export async function registerForEvent(eventId: string): Promise<ActionResult> {
  const user = await requireStudent();
  const event = await db.query.events.findFirst({ where: eq(events.id, eventId) });
  if (!event || event.status !== "published") {
    return { ok: false, message: "This event is not open for registration." };
  }
  if (event.startAt <= new Date()) {
    return { ok: false, message: "Registration has closed for this event." };
  }

  const existing = await db.query.registrations.findFirst({
    where: and(eq(registrations.eventId, eventId), eq(registrations.userId, user.id)),
  });
  if (existing && existing.status !== "cancelled") {
    return { ok: false, message: "You are already registered for this event." };
  }

  const [{ n }] = await db
    .select({ n: count() })
    .from(registrations)
    .where(and(eq(registrations.eventId, eventId), ne(registrations.status, "cancelled")));
  if (Number(n) >= event.capacity) {
    return { ok: false, message: "This event is full." };
  }

  const status = event.requiresApproval ? "pending" : "confirmed";
  if (existing) {
    await db
      .update(registrations)
      .set({ status, checkedIn: false, checkedInAt: null, verifyCode: randomCode(10) })
      .where(eq(registrations.id, existing.id));
  } else {
    await db.insert(registrations).values({
      eventId,
      userId: user.id,
      status,
      verifyCode: randomCode(10),
    });
  }

  await db.insert(notifications).values({
    userId: user.id,
    title:
      status === "confirmed" ? `You're in — ${event.title}` : `Request sent — ${event.title}`,
    message:
      status === "confirmed"
        ? `Registration confirmed for ${event.title}. Your QR ticket is ready under My Events.`
        : `${event.title} requires club approval. You'll be notified once the club reviews your request.`,
    kind: status === "confirmed" ? "success" : "info",
    link: "/dashboard/my-events",
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-events");
  return {
    ok: true,
    status,
    message:
      status === "confirmed"
        ? "Registration confirmed — QR ticket issued."
        : "Request sent. Waiting for club approval.",
  };
}

export async function cancelMyRegistration(registrationId: string): Promise<ActionResult> {
  const user = await requireStudent();
  const reg = await db.query.registrations.findFirst({
    where: eq(registrations.id, registrationId),
    with: { event: true },
  });
  if (!reg || reg.userId !== user.id) {
    return { ok: false, message: "Registration not found." };
  }
  if (reg.checkedIn) {
    return { ok: false, message: "You have already checked in to this event." };
  }
  if (reg.status === "cancelled") {
    return { ok: false, message: "This registration is already cancelled." };
  }
  await db
    .update(registrations)
    .set({ status: "cancelled" })
    .where(eq(registrations.id, registrationId));
  revalidatePath("/dashboard/my-events");
  revalidatePath(`/events/${reg.eventId}`);
  revalidatePath("/events");
  return { ok: true, message: "Registration cancelled." };
}

export async function markNotificationRead(notificationId: string) {
  const user = await getSessionUser();
  if (!user) return;
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, user.id)));
  revalidatePath("/dashboard");
}

export async function markAllNotificationsRead() {
  const user = await getSessionUser();
  if (!user) return { ok: false };
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.userId, user.id));
  revalidatePath("/dashboard");
  return { ok: true };
}
