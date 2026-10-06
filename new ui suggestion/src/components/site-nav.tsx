import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { Avatar } from "./bits";
import { Logo } from "./logo";

export async function SiteNav() {
  const user = await getSessionUser();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 rounded-full border border-ink/15 bg-cream px-2 py-1.5 md:flex">
          {[
            ["Events", "/events"],
            ["Categories", "/#categories"],
            ["How it works", "/#how"],
            ["For clubs", "/#features"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="rounded-full px-4 py-1.5 text-[13px] text-ink/60 transition-colors hover:bg-ink/8 hover:text-ink"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          {user ? (
            <Link
              href={user.role === "student" ? "/dashboard" : "/club"}
              className="flex items-center gap-2.5 rounded-full border border-ink/20 bg-cream py-1.5 pr-4 pl-1.5 text-[13px] font-medium transition-all hover:shadow-[3px_3px_0_#181611]"
            >
              <Avatar name={user.name} size="sm" />
              <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
              <LayoutDashboard className="h-3.5 w-3.5 text-ink/50" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-[13px] text-ink/65 transition-colors hover:text-ink sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="group inline-flex items-center gap-1.5 rounded-full border border-ink bg-ink px-4 py-2 text-[13px] font-semibold text-cream transition-all hover:shadow-[3px_3px_0_#d63b22]"
              >
                Get started
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
