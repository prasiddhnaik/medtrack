import { AppHeader } from "@/components/AppHeader";
import { DashboardSummary } from "@/components/DashboardSummary";

export default function DashboardPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-950">
            Adherence dashboard
          </h2>
          <p className="mt-3 max-w-2xl text-slate-700">
            Review the last seven days of tracked dose logs and spot missed
            adherence patterns early.
          </p>
        </div>

        <DashboardSummary />
      </main>
    </>
  );
}
