"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => void signOut({ callbackUrl: "/login" })}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-[15px] font-medium text-text transition hover:border-primary-hover hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
    >
      <LogOut size={17} strokeWidth={1.9} aria-hidden="true" />
      Sign out
    </button>
  );
}
