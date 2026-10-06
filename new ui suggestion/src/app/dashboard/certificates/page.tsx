import { Award, Download, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/bits";
import { FadeIn } from "@/components/reveal";
import { requireStudent } from "@/lib/auth";
import { getCertificates } from "@/lib/data";
import { formatDay } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Certificates — CampusConnect · TCET" };

export default async function CertificatesPage() {
  const user = await requireStudent();
  const certs = await getCertificates(user.id);

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-black tracking-tight text-ink">
          Certificates &amp; <span className="font-accent text-flame font-medium italic">proof of you</span>
        </h1>
        <p className="mt-2 max-w-lg text-[14px] text-ink/55">
          Every check-in mints a verified PDF certificate automatically. Download
          and attach them to your portfolio or resume.
        </p>
      </FadeIn>

      {certs.length === 0 ? (
        <FadeIn delay={0.05}>
          <EmptyState
            icon={<Award className="h-6 w-6" />}
            title="No certificates yet"
            subtitle="Attend an event and check in with your QR ticket — the certificate appears here instantly."
          />
        </FadeIn>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certs.map((c, i) => (
            <FadeIn key={c.id} delay={0.05 + i * 0.05}>
              <div className="group relative rounded-2xl border-[1.5px] border-ink bg-cream p-6 transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0_#181611]">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-2xl"
                  style={{
                    background: "repeating-linear-gradient(90deg,#d63b22 0 18px,#181611 18px 24px)",
                  }}
                />
                <div className="mt-2 flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/20 bg-gold/10 text-gold">
                    <Award className="h-5 w-5" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-mint/40 bg-mint/10 px-2.5 py-1 font-mono text-[9.5px] font-bold tracking-[0.14em] text-mint uppercase">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                </div>
                <p className="font-accent mt-5 text-[15px] text-gold italic">
                  Certificate of Participation
                </p>
                <h3 className="font-display mt-1 text-lg leading-snug font-black text-ink">
                  {c.eventTitle}
                </h3>
                <p className="mt-1 text-[12.5px] text-ink/50">
                  {c.clubName} · {formatDay(c.eventDate)}
                </p>
                <div className="mt-5 flex items-center justify-between border-t-[1.5px] border-dashed border-ink/20 pt-4">
                  <span className="font-mono text-[10.5px] tracking-[0.18em] text-ink/40">
                    {c.code}
                  </span>
                  <a
                    href={`/api/certificates/${c.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-ink bg-ink px-3.5 py-2 text-[12px] font-bold text-cream transition-all hover:shadow-[3px_3px_0_#d63b22]"
                  >
                    <Download className="h-3.5 w-3.5" /> PDF
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
