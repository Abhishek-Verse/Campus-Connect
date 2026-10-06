"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { createSession, destroySession, requireUser } from "@/lib/auth";

export type FormState = { error?: string; success?: string } | null;

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const interests = formData.getAll("interests").map(String);

  if (!name || !email || !password) return { error: "All fields are required." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = bcrypt.hashSync(password, 10);
  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash, role: "student", interests })
    .returning({ id: users.id });

  await db.insert(notifications).values({
    userId: user.id,
    title: "Welcome to CampusConnect",
    message:
      "Your account is ready. Browse upcoming events, follow your interests and grab your first QR ticket.",
    kind: "success",
    link: "/events",
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return { error: "Invalid email or password." };
  }
  await createSession(user.id);
  redirect(user.role === "student" ? "/dashboard" : "/club");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function updateInterestsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const interests = formData.getAll("interests").map(String);
  await db.update(users).set({ interests }).where(eq(users.id, user.id));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: "Interests updated — recommendations refreshed." };
}
