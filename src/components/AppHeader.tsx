"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, HeartPulse, Pill } from "lucide-react";

const navItems = [
  { href: "/", label: "Today", icon: CalendarDays },
  { href: "/medications", label: "Medications", icon: Pill },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface text-text">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="group inline-flex w-fit items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full border border-border text-primary transition group-hover:border-primary-hover group-hover:text-primary-hover">
            <HeartPulse size={22} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              UN SDG 3 · good health
            </span>
            <span className="mt-0.5 block text-[26px] font-semibold leading-none tracking-normal text-text">
              MedTrack
            </span>
          </span>
        </Link>

        <nav className="flex flex-wrap gap-2" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-text hover:border-primary-hover hover:text-primary"
                }`}
              >
                <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
