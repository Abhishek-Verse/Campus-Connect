import Link from "next/link";
import { redirect } from "next/navigation";
import { AuroraBackdrop } from "@/components/aurora";
import { LoginForm } from "@/components/auth-forms";
import { Logo } from "@/components/logo";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign in — CampusConnect · TCET" };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "student" ? "/dashboard" : "/club");

  return (
    <main className="relative grid min-h-screen lg:grid-cols-2">
      <AuroraBackdrop subtle />
      <div className="relative hidden flex-col justify-between overflow-hidden border-r-[1.5px] border-ink bg-ink p-12 text-cream lg:flex">
        <Logo inverted />
        <div>
          <p className="font-mono text-[11px] font-bold tracking-[0.24em] text-[#ff7a5c] uppercase">
            // welcome back
          </p>
          <h2 className="font-display mt-4 text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.04] font-black tracking-tight">
            The campus never
            <br />
            stopped moving.
            <br />
            <span className="font-accent font-medium text-cream/70 italic">Catch up.</span>
          </h2>
          <div className="mt-10 space-y-3">
            {[
              ["18 events", "hosted this semester"],
              ["1 QR scan", "is all check-in takes"],
              ["4 sec", "average registration time"],
            ].map(([a, b]) => (
              <div key={a} className="flex items-center gap-4 rounded-xl border border-cream/20 px-5 py-3.5">
                <span className="font-display text-lg font-black text-[#ff7a5c]">{a}</span>
                <span className="text-[13px] text-cream/55">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="font-mono text-[10px] tracking-[0.18em] text-cream/35 uppercase">
          CampusConnect · Thakur College of Engineering &amp; Technology
        </p>
      </div>
      <div className="flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-ink/55">
            New here?{" "}
            <Link href="/register" className="font-semibold text-flame underline-offset-4 hover:underline">
              Create a student account
            </Link>
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
