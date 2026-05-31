import { AppHeader } from "@/components/AppHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { requirePageSession } from "@/lib/session";

export default async function DashboardPage() {
  await requirePageSession();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        <div className="mb-8">
          <h2 className="font-serif-display text-4xl font-semibold leading-tight text-text">
            Adherence dashboard
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-text-muted">
            Review the last seven days of tracked dose logs and spot missed
            adherence patterns early.
          </p>
        </div>

        <DashboardSummary />
      </main>
    </>
  );
}
