import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { AuroraBackdrop } from "@/components/aurora";
import { requireClub } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ClubLayout({ children }: { children: ReactNode }) {
  const user = await requireClub();
  return (
    <>
      <AuroraBackdrop subtle />
      <AppShell
        variant="club"
        user={{ name: user.name, email: user.email, role: user.role }}
      >
        {children}
      </AppShell>
    </>
  );
}
