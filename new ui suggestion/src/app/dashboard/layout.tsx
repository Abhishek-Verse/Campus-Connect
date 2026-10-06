import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { AuroraBackdrop } from "@/components/aurora";
import { requireStudent } from "@/lib/auth";
import { getNotifications } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireStudent();
  const notifications = await getNotifications(user.id);
  return (
    <>
      <AuroraBackdrop subtle />
      <AppShell
        variant="student"
        user={{ name: user.name, email: user.email, role: user.role }}
        notifications={notifications}
      >
        {children}
      </AppShell>
    </>
  );
}
