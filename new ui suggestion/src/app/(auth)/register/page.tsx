import Link from "next/link";
import { redirect } from "next/navigation";
import { AuroraBackdrop } from "@/components/aurora";
import { RegisterForm } from "@/components/auth-forms";
import { Logo } from "@/components/logo";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Create account — CampusConnect · TCET" };

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "student" ? "/dashboard" : "/club");

  return (
    <main className="relative grid min-h-screen lg:grid-cols-2">
      <AuroraBackdrop subtle />
      <div className="relative hidden flex-col justify-between overflow-hidden border-r-[1.5px] border-ink bg-ink p-12 text-cream lg:flex">
        <Logo inverted />
        <div>
          <p className="font-mono text-[11px] font-bold tracking-[0.24em] text-[#ff7a5c] uppercase">
            // join the grid
          </p>
          <h2 className="font-display mt-4 text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.04] font-black tracking-tight">
            One account.
            <br />
            Every fest, workshop
            <br />
            &amp; <span className="font-accent font-medium text-cream/70 italic">hackathon.</span>
          </h2>
          <div className="mt-12 space-y-4">
            {[
              ["01", "Pick your interests — the feed curates itself"],
              ["02", "Register in one tap, get your QR ticket"],
              ["03", "Check in, earn certificates, build your profile"],
            ].map(([n, t]) => (
              <div key={n} className="flex items-center gap-4">
                <span className="font-display text-sm font-black text-[#ff7a5c]">{n}</span>
                <span className="text-[13.5px] text-cream/60">{t}</span>
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
          <h1 className="font-display text-3xl font-black tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-ink/55">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-flame underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
          <div className="mt-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </main>
  );
}
