"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  PenSquare,
  Plug,
  Users,
} from "lucide-react";
import { Logo } from "@/components/marketing/Logo";
import { signOut } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/editor", label: "Editor", icon: PenSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/install", label: "Install & Sync", icon: Plug },
  { href: "/team", label: "Team", icon: Users },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-white px-4 py-6 md:flex">
        <Link href="/" className="px-2">
          <Logo />
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-ink-muted hover:bg-cream-dim hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-cream-dim hover:text-ink"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      {/* mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-white px-4 md:hidden">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex gap-1 overflow-x-auto">
          {NAV.slice(0, 4).map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`rounded-lg p-2 ${
                pathname.startsWith(href) ? "bg-accent-soft text-accent" : "text-ink-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
        </nav>
      </div>

      <main className="flex-1 px-6 pb-16 pt-20 md:ml-60 md:pt-10">{children}</main>
    </div>
  );
}
