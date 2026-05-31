import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg px-5 py-8 text-text sm:px-6">
      <section className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
        <Link href="/login" className="inline-flex items-center gap-3">
          <span className="grid size-12 place-items-center overflow-hidden rounded-full border border-border bg-bg">
            <Image
              src="/brand/medtrack-logo.png"
              alt=""
              width={48}
              height={48}
              className="size-12 object-cover"
              priority
            />
          </span>
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              UN SDG 3 · good health
            </span>
            <span className="block text-2xl font-semibold leading-none text-text">
              MedTrack
            </span>
          </span>
        </Link>

        <h1 className="font-serif-display mt-8 text-4xl font-semibold leading-tight">
          Terms of Service
        </h1>
        <p className="mt-3 text-[15px] text-text-muted">
          Last updated: May 31, 2026
        </p>

        <div className="mt-8 space-y-6 text-[15px] leading-7 text-text-muted">
          <section>
            <h2 className="text-xl font-medium text-text">Purpose</h2>
            <p className="mt-2">
              MedTrack is a hackathon medication adherence tracker for helping
              users organize medication schedules and dose completion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text">Not medical advice</h2>
            <p className="mt-2">
              MedTrack is not a medical device and does not provide medical
              advice. Always follow guidance from a qualified healthcare
              professional.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text">User responsibility</h2>
            <p className="mt-2">
              You are responsible for entering accurate medication information and
              confirming dose decisions with your healthcare provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text">Contact</h2>
            <p className="mt-2">
              For questions, contact{" "}
              <a className="text-primary underline" href="mailto:legoprasiddh@gmail.com">
                legoprasiddh@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
