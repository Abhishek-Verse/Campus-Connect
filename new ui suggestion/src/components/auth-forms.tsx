"use client";

import { useActionState, useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction, registerAction, type FormState } from "@/lib/actions/auth";
import { INTERESTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border-[1.5px] border-ink/20 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/35 outline-none transition-all focus:border-ink focus:shadow-[3px_3px_0_rgba(24,22,17,0.85)]";

function ErrorNote({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-rose/60 bg-rose/10 px-4 py-2.5 text-[13px] text-rose">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {state.error}
    </div>
  );
}

function PasswordInput({ name = "password" }: { name?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder="Password"
        required
        minLength={6}
        className={cn(inputCls, "pr-11")}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-3.5 -translate-y-1/2 text-ink/35 transition-colors hover:text-ink/70"
        aria-label="Toggle password visibility"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-ink bg-flame py-3.5 text-sm font-bold text-cream transition-all hover:shadow-[5px_5px_0_#181611] disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="space-y-4">
      <ErrorNote state={state} />
      <input
        type="email"
        name="email"
        placeholder="Email address"
        required
        autoComplete="email"
        className={inputCls}
      />
      <PasswordInput />
      <SubmitButton label="Sign in" pending={pending} />
      <div className="rounded-xl border-[1.5px] border-dashed border-ink/30 bg-cream/60 p-4">
        <p className="font-mono text-[10px] tracking-[0.18em] text-ink/45 uppercase">
          Demo accounts · password <span className="font-bold text-flame">campus123</span>
        </p>
        <div className="mt-2 space-y-1 text-[12px] text-ink/60">
          <p>
            <span className="font-semibold text-mint">Student</span> — meera@student.tcet.edu
          </p>
          <p>
            <span className="font-semibold text-flame">Club</span> — codesphere@tcet.edu
          </p>
          <p>
            <span className="font-semibold text-rose">Admin</span> — admin@tcet.edu
          </p>
        </div>
      </div>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, null);
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (interest: string) =>
    setPicked((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length >= 5
          ? prev
          : [...prev, interest],
    );

  return (
    <form action={action} className="space-y-4">
      <ErrorNote state={state} />
      <input
        type="text"
        name="name"
        placeholder="Full name"
        required
        autoComplete="name"
        className={inputCls}
      />
      <input
        type="email"
        name="email"
        placeholder="College email"
        required
        autoComplete="email"
        className={inputCls}
      />
      <PasswordInput />
      <div>
        <p className="mb-2 flex items-center justify-between text-[12.5px] text-ink/60">
          Pick up to 5 interests — powers your recommendations
          <span className="font-mono text-[10.5px] text-ink/40">{picked.length}/5</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {INTERESTS.map((interest) => {
            const active = picked.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggle(interest)}
                className={cn(
                  "rounded-full border-[1.5px] px-3 py-1.5 text-[12px] transition-all",
                  active
                    ? "border-ink bg-ink font-semibold text-cream shadow-[2px_2px_0_#d63b22]"
                    : "border-ink/25 bg-cream text-ink/55 hover:border-ink/60 hover:text-ink",
                )}
              >
                {interest}
              </button>
            );
          })}
        </div>
        {picked.map((p) => (
          <input key={p} type="hidden" name="interests" value={p} />
        ))}
      </div>
      <SubmitButton label="Create account" pending={pending} />
    </form>
  );
}
