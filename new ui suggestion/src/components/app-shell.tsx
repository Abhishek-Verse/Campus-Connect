"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  CalendarRange,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  QrCode,
  ScanLine,
  Settings,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import type { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar } from "./bits";
import { Logo } from "./logo";
import { NotificationBell } from "./notification-bell";

const studentNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/my-events", label: "My Events", icon: CalendarRange },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/events", label: "Browse Events", icon: QrCode },
  { href: "/dashboard/settings", label: "Interests", icon: Settings },
];

const clubNav = [
  { href: "/club", label: "Overview", icon: LayoutDashboard },
  { href: "/club/events", label: "Events", icon: CalendarRange },
  { href: "/club/events/new", label: "New Event", icon: PlusCircle },
  { href: "/club/checkin", label: "QR Check-in", icon: ScanLine },
];

export function AppShell({
  variant,
  user,
  notifications = [],
  children,
}: {
  variant: "student" | "club";
  user: { name: string; email: string; role: string };
  notifications?: NotificationData[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const nav = variant === "student" ? studentNav : clubNav;

  const isActive = (href: string) => {
    const base = variant === "student" ? "/dashboard" : "/club";
    if (href === base) return pathname === base;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen">
      {/* desktop sidebar — ink masthead */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r-[1.5px] border-ink bg-ink p-5 text-cream lg:flex">
        <Logo inverted href={variant === "student" ? "/dashboard" : "/club"} />
        <div className="mt-8 flex-1 space-y-1">
          <p className="mb-3 px-3 font-mono text-[9.5px] tracking-[0.22em] text-cream/40 uppercase">
            {variant === "student" ? "Student console" : "Club console"}
          </p>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-all",
                isActive(item.href)
                  ? "bg-cream font-semibold text-ink shadow-[3px_3px_0_#d63b22]"
                  : "text-cream/55 hover:bg-cream/10 hover:text-cream",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-cream/20 p-3">
          <Avatar name={user.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">{user.name}</p>
            <p className="truncate text-[11px] text-cream/45">{user.email}</p>
          </div>
          <button
            onClick={() => logoutAction()}
            className="rounded-lg p-1.5 text-cream/45 transition-colors hover:bg-cream/10 hover:text-rose"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* mobile topbar */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo href={variant === "student" ? "/dashboard" : "/club"} />
        <div className="flex items-center gap-2">
          {variant === "student" && <NotificationBell notifications={notifications} />}
          <Avatar name={user.name} size="sm" />
        </div>
      </header>

      {/* main column */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 hidden items-center justify-end gap-3 border-b border-ink/10 bg-paper/85 px-8 py-3 backdrop-blur-xl lg:flex">
          <p className="mr-auto font-mono text-[10px] tracking-[0.22em] text-ink/40 uppercase">
            Thakur College of Engineering &amp; Technology
          </p>
          {variant === "student" && <NotificationBell notifications={notifications} />}
        </div>
        <main className="mx-auto w-full max-w-6xl px-4 pt-20 pb-28 sm:px-8 lg:px-10 lg:pt-10 lg:pb-16">
          {children}
        </main>
      </div>

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border-[1.5px] border-ink bg-cream px-2 py-2 shadow-[5px_5px_0_rgba(24,22,17,0.9)] lg:hidden">
        {nav.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5",
              isActive(item.href) ? "text-ink" : "text-ink/40",
            )}
          >
            <item.icon className={cn("h-4.5 w-4.5", isActive(item.href) && "text-flame")} />
            <span className="text-[9px] tracking-wide">{item.label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
