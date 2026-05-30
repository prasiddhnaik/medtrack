import { AppHeader } from "@/components/AppHeader";
import { MedicationManager } from "@/components/MedicationManager";

export default function MedicationsPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-950">
            Manage medications
          </h2>
          <p className="mt-3 max-w-2xl text-slate-700">
            Add each medication once with its daily dose times. MedTrack uses
            those schedules to create dose logs for adherence tracking.
          </p>
        </div>

        <MedicationManager />
      </main>
    </>
  );
}
