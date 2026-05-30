"use client";

import { useEffect, useState } from "react";
import { MedicationForm } from "@/components/MedicationForm";
import type { Medication } from "@/types";

export function MedicationManager() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadMedications();
  }, []);

  async function loadMedications() {
    setIsLoading(true);
    const response = await fetch("/api/medications");
    const body = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(body.error ?? "Unable to load medications.");
      return;
    }

    setError("");
    setMedications(body.medications);
  }

  async function deleteMedication(id: string) {
    const response = await fetch(`/api/medications/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const body = await response.json();
      setError(body.error ?? "Unable to delete medication.");
      return;
    }

    setMedications((current) =>
      current.filter((medication) => medication.id !== id),
    );
  }

  return (
    <div className="space-y-6">
      <MedicationForm
        onCreated={(medication) =>
          setMedications((current) => [medication, ...current])
        }
      />

      {error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          {error}
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Saved medications
          </h2>
        </div>

        {isLoading ? (
          <p className="px-5 py-8 text-slate-600">Loading medications...</p>
        ) : medications.length === 0 ? (
          <p className="px-5 py-8 text-slate-600">
            No medications yet. Add the first medication to build today&apos;s
            schedule.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {medications.map((medication) => (
              <li
                key={medication.id}
                className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-950">
                    {medication.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {medication.dosage} at {medication.times.join(", ")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void deleteMedication(medication.id)}
                  className="w-fit rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
