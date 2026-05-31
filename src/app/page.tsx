import { AppHeader } from "@/components/AppHeader";
import { DoseSchedule } from "@/components/DoseSchedule";
import { requirePageSession } from "@/lib/session";

export default async function HomePage() {
  await requirePageSession();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        <DoseSchedule />
      </main>
    </>
  );
}
