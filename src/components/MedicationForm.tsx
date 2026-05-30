"use client";

import { FormEvent, useState } from "react";
import type { Medication, MedicationInput } from "@/types";

type MedicationFormProps = {
  onCreated: (medication: Medication) => void;
};

export function MedicationForm({ onCreated }: MedicationFormProps) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [timesText, setTimesText] = useState("08:00");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const input: MedicationInput = {
      name,
      dosage,
      times: timesText
        .split(",")
        .map((time) => time.trim())
        .filter(Boolean),
    };

    setIsSaving(true);

    const response = await fetch("/api/medications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = await response.json();

    setIsSaving(false);

    if (!response.ok) {
      setError(body.error ?? "Unable to save medication.");
      return;
    }

    onCreated(body.medication);
    setName("");
    setDosage("");
    setTimesText("08:00");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_1fr_auto] md:items-end">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Metformin"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Dosage</span>
          <input
            value={dosage}
            onChange={(event) => setDosage(event.target.value)}
            placeholder="500mg"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Times, comma separated
          </span>
          <input
            value={timesText}
            onChange={(event) => setTimesText(event.target.value)}
            placeholder="08:00, 20:00"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSaving ? "Saving" : "Add"}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}
    </form>
  );
}
