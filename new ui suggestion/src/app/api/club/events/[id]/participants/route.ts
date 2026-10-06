import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { events, registrations } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { csvEscape } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const user = await getSessionUser();
  if (!user || (user.role !== "club" && user.role !== "admin")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const event = await db.query.events.findFirst({ where: eq(events.id, id) });
  if (!event) return new Response("Not found", { status: 404 });
  if (user.role !== "admin" && event.clubId !== user.clubId) {
    return new Response("Forbidden", { status: 403 });
  }

  const rows = await db.query.registrations.findMany({
    where: and(eq(registrations.eventId, id)),
    with: { user: true },
    orderBy: asc(registrations.createdAt),
  });

  const header = ["Name", "Email", "Status", "Registered At", "Checked In", "Checked In At", "Ticket Code"];
  const lines = rows.map((r) =>
    [
      csvEscape(r.user.name),
      csvEscape(r.user.email),
      r.status,
      r.createdAt.toISOString(),
      r.checkedIn ? "yes" : "no",
      r.checkedInAt ? r.checkedInAt.toISOString() : "",
      r.verifyCode,
    ].join(","),
  );
  const csv = `﻿${header.join(",")}\n${lines.join("\n")}`;
  const slug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="participants-${slug}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
