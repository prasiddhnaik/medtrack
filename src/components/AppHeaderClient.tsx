"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, Pill } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

type AppHeaderClientProps = {
  userName?: string | null;
  userEmail?: string | null;
};

const navItems = [
  { href: "/", label: "Today", icon: CalendarDays },
  { href: "/medications", label: "Medications", icon: Pill },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

export function AppHeaderClient({ userName, userEmail }: AppHeaderClientProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface text-text">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between sm:px-6">
        <Link href="/" className="group inline-flex w-fit items-center gap-3">
          <span className="grid size-11 place-items-center overflow-hidden rounded-full border border-border bg-bg transition group-hover:border-primary-hover">
            <Image
              src="/brand/medtrack-logo.png"
              alt=""
              width={44}
              height={44}
              className="size-11 object-cover"
              priority
            />
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${
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

          <div className="flex flex-wrap items-center gap-3">
            {userName || userEmail ? (
              <div className="min-w-0 text-sm text-text-muted">
                <span className="block max-w-48 truncate font-medium text-text">
                  {userName ?? userEmail}
                </span>
                {userName && userEmail ? (
                  <span className="block max-w-48 truncate">{userEmail}</span>
                ) : null}
              </div>
            ) : null}
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
