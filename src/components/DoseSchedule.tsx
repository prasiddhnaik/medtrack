"use client";

import { useEffect, useState } from "react";
import { DoseCard } from "@/components/DoseCard";
import type { DoseLogWithMedication } from "@/types";

export function DoseSchedule() {
  const [doses, setDoses] = useState<DoseLogWithMedication[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    void loadDoses();
  }, []);

  async function loadDoses() {
    setIsLoading(true);
    const response = await fetch("/api/doses");
    const body = await readJsonResponse(response);
    setIsLoading(false);

    if (!response.ok) {
      setError(body.error ?? "Unable to load today's doses.");
      return;
    }

    setError("");
    setDoses(body.doses);
  }

  async function markTaken(doseLogId: string) {
    setUpdatingId(doseLogId);
    const response = await fetch("/api/doses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doseLogId }),
    });
    const body = await readJsonResponse(response);
    setUpdatingId("");

    if (!response.ok) {
      setError(body.error ?? "Unable to mark dose taken.");
      return;
    }

    setDoses((current) =>
      current.map((dose) => (dose.id === doseLogId ? body.dose : dose)),
    );
  }

  const takenCount = doses.filter((dose) => dose.status === "TAKEN").length;
  const totalCount = doses.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((takenCount / totalCount) * 100);
  const todayLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-border bg-surface p-6 text-[15px] text-text-muted shadow-sm">
        Loading today&apos;s schedule...
      </section>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-status-due bg-status-due-bg p-5 text-[15px] text-status-due-text">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[22px] font-medium leading-tight text-text">
              Today&apos;s schedule
            </h1>
            <p className="mt-1 text-[15px] text-text-muted">{todayLabel}</p>
          </div>

          <p className="font-serif-display text-4xl leading-none text-primary">
            {takenCount} / {totalCount}
            <span className="ml-2 font-sans text-[15px] font-medium text-text-muted">
              doses taken
            </span>
          </p>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPercent}%` }}
            aria-label={`${progressPercent}% of doses taken`}
          />
        </div>
      </div>

      {doses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
          <h2 className="text-[20px] font-medium text-text">
            No doses scheduled today
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-7 text-text-muted">
            Add medications with daily dose times to build a schedule and start
            tracking adherence.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {doses.map((dose) => (
            <DoseCard
              key={dose.id}
              dose={dose}
              isUpdating={updatingId === dose.id}
              onMarkTaken={(id) => void markTaken(id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

async function readJsonResponse(response: Response) {
  try {
    return await response.json();
  } catch {
    return { error: "Unable to read the server response." };
  }
}
