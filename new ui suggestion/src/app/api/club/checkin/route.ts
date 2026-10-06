import { eq } from "drizzle-orm";
import { db } from "@/db";
import { certificates, events, notifications, registrations } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { randomCode } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user || (user.role !== "club" && user.role !== "admin")) {
    return Response.json(
      { ok: false, state: "error", message: "Unauthorized." },
      { status: 401 },
    );
  }

  let body: { code?: string; eventId?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, state: "error", message: "Bad request." },
      { status: 400 },
    );
  }
  const raw = (body.code ?? "").trim();
  const eventId = body.eventId ?? "";
  if (!raw || !eventId) {
    return Response.json(
      { ok: false, state: "error", message: "Missing code or event." },
      { status: 400 },
    );
  }

  // Accept a full QR payload "CC:<registrationId>:<verifyCode>" or a bare code.
  let registrationId: string | null = null;
  let verifyCode = raw;
  if (raw.startsWith("CC:")) {
    const parts = raw.split(":");
    registrationId = parts[1] ?? null;
    verifyCode = parts[2] ?? "";
  }

  const reg = registrationId
    ? await db.query.registrations.findFirst({
        where: eq(registrations.id, registrationId),
        with: { user: true },
      })
    : await db.query.registrations.findFirst({
        where: eq(registrations.verifyCode, verifyCode),
        with: { user: true },
      });

  if (!reg || (registrationId && reg.verifyCode !== verifyCode)) {
    return Response.json({ ok: false, state: "invalid", message: "Ticket not recognised." });
  }
  if (reg.eventId !== eventId) {
    return Response.json({
      ok: false,
      state: "wrong-event",
      message: "This ticket belongs to a different event.",
      name: reg.user.name,
    });
  }

  const event = await db.query.events.findFirst({ where: eq(events.id, reg.eventId) });
  if (!event) {
    return Response.json({ ok: false, state: "invalid", message: "Event not found." });
  }
  if (user.role !== "admin" && event.clubId !== user.clubId) {
    return Response.json(
      { ok: false, state: "error", message: "Not your club's event." },
      { status: 403 },
    );
  }

  if (reg.status === "cancelled") {
    return Response.json({
      ok: false,
      state: "cancelled",
      message: "This registration was cancelled.",
      name: reg.user.name,
    });
  }
  if (reg.status === "pending") {
    return Response.json({
      ok: false,
      state: "pending",
      message: "Registration is still pending approval. Approve it first.",
      name: reg.user.name,
    });
  }
  if (reg.checkedIn) {
    return Response.json({
      ok: true,
      state: "already",
      message: "Already checked in.",
      name: reg.user.name,
      email: reg.user.email,
      checkedInAt: reg.checkedInAt?.toISOString() ?? null,
    });
  }

  const now = new Date();
  await db
    .update(registrations)
    .set({ checkedIn: true, checkedInAt: now })
    .where(eq(registrations.id, reg.id));

  // Mint a participation certificate for attending.
  const code = `CERT-${randomCode(6)}`;
  await db.insert(certificates).values({
    userId: reg.userId,
    eventId: reg.eventId,
    registrationId: reg.id,
    code,
  });

  await db.insert(notifications).values({
    userId: reg.userId,
    title: `Checked in — ${event.title}`,
    message: `Attendance recorded. Your certificate (${code}) is ready to download.`,
    kind: "success",
    link: "/dashboard/certificates",
  });

  return Response.json({
    ok: true,
    state: "ok",
    message: "Check-in successful. Certificate issued.",
    name: reg.user.name,
    email: reg.user.email,
    checkedInAt: now.toISOString(),
    certificateCode: code,
  });
}
