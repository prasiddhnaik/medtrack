import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-3 text-[15px] text-text-muted">
          Last updated: May 31, 2026
        </p>

        <div className="mt-8 space-y-6 text-[15px] leading-7 text-text-muted">
          <section>
            <h2 className="text-xl font-medium text-text">What MedTrack stores</h2>
            <p className="mt-2">
              MedTrack stores the medications, dosages, scheduled dose times, and
              dose completion history that you add to the app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text">Google sign-in</h2>
            <p className="mt-2">
              MedTrack uses Google sign-in to protect access to the app. The app
              may receive your Google account name and email address for session
              access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text">How data is used</h2>
            <p className="mt-2">
              Your data is used to show your daily medication schedule, mark doses
              as taken, and calculate adherence statistics. MedTrack does not sell
              your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-text">Contact</h2>
            <p className="mt-2">
              For privacy questions, contact{" "}
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
