import Image from "next/image";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { LoginButton } from "@/components/LoginButton";
import { getAppSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getAppSession();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-bg px-5 py-8 text-text sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="grid size-14 place-items-center overflow-hidden rounded-full border border-border bg-surface">
                <Image
                  src="/brand/medtrack-logo.png"
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 object-cover"
                  priority
                />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  UN SDG 3 · good health
                </p>
                <h1 className="font-serif-display text-5xl font-semibold leading-none text-text">
                  MedTrack
                </h1>
              </div>
            </div>

            <p className="mt-8 max-w-xl text-xl leading-8 text-text-muted">
              Track daily medication adherence with a private schedule, clear dose
              status, and a seven-day view of progress.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-3 text-primary">
              <ShieldCheck size={22} strokeWidth={1.8} aria-hidden="true" />
              <p className="text-sm font-semibold uppercase tracking-[0.14em]">
                Protected workspace
              </p>
            </div>
            <h2 className="mt-5 font-serif-display text-4xl font-semibold leading-tight text-text">
              Sign in to continue
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-text-muted">
              Google sign-in keeps the tracker from being open to anonymous
              visitors while the hackathon version stays simple.
            </p>
            <div className="mt-6">
              <LoginButton />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
