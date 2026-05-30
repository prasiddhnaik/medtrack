import { AppHeader } from "@/components/AppHeader";
import { DoseSchedule } from "@/components/DoseSchedule";

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        <DoseSchedule />
      </main>
    </>
  );
}
