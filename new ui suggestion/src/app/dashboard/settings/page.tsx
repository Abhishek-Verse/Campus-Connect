import { BrainCircuit } from "lucide-react";
import { Avatar } from "@/components/bits";
import { InterestsForm } from "@/components/interests-form";
import { FadeIn } from "@/components/reveal";
import { requireStudent } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Interests — CampusConnect" };

export default async function SettingsPage() {
  const user = await requireStudent();

  return (
    <div className="max-w-3xl space-y-8">
      <FadeIn>
        <h1 className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold tracking-tight">
          Interests &amp; <span className="font-accent text-gradient italic">profile</span>
        </h1>
        <p className="mt-2 text-[14px] text-ink/50">
          Your picks drive the recommendation engine on your dashboard.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="glass flex items-center gap-4 rounded-3xl p-6">
          <Avatar name={user.name} size="lg" />
          <div>
            <p className="font-display text-lg font-bold">{user.name}</p>
            <p className="text-[13px] text-ink/45">{user.email}</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-mint uppercase">
              Student account
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <BrainCircuit className="h-4.5 w-4.5 text-glow" />
            <h2 className="font-display text-lg font-bold">Recommendation interests</h2>
          </div>
          <InterestsForm initial={user.interests} />
        </div>
      </FadeIn>
    </div>
  );
}
