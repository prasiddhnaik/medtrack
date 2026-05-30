"use client";

import { Check, Circle, Clock, OctagonAlert } from "lucide-react";
import type { DoseLogWithMedication } from "@/types";

type DoseCardProps = {
  dose: DoseLogWithMedication;
  onMarkTaken: (id: string) => void;
  isUpdating: boolean;
};

export function DoseCard({ dose, onMarkTaken, isUpdating }: DoseCardProps) {
  const scheduledFor = new Date(dose.scheduledFor);
  const takenAt = dose.takenAt ? new Date(dose.takenAt) : null;
  const visualStatus = getVisualStatus(dose, scheduledFor);
  const isTaken = visualStatus.kind === "taken";
  const isDue = visualStatus.kind === "due";
  const Icon = visualStatus.icon;

  return (
    <article
      className={`rounded-2xl border border-border bg-surface shadow-sm ${
        visualStatus.opacityClass
      }`}
      style={{ borderLeft: `3px solid ${visualStatus.borderColor}` }}
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className={`mt-0.5 grid size-11 shrink-0 place-items-center rounded-full ${visualStatus.badgeClass}`}
            aria-hidden="true"
          >
            <Icon size={20} strokeWidth={2} />
          </span>

          <div className="min-w-0">
            <h2 className="text-[17px] font-medium text-text">
              <span>{dose.medication.name}</span>
              <span className="px-2 font-normal text-text-muted">·</span>
              <span className="font-normal text-text-muted">
                {dose.medication.dosage}
              </span>
            </h2>
            <p className={`mt-1 text-[15px] ${visualStatus.sublineClass}`}>
              {visualStatus.kind === "taken" && takenAt
                ? `Taken at ${formatTime(takenAt)}`
                : visualStatus.label}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="font-serif-display text-2xl leading-none text-text">
            {formatTime(scheduledFor)}
          </p>

          {isDue ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onMarkTaken(dose.id)}
              className="min-h-11 rounded-full bg-primary px-5 text-[15px] font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-text-muted"
            >
              {isUpdating ? "Saving" : "Mark taken"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function getVisualStatus(dose: DoseLogWithMedication, scheduledFor: Date) {
  if (dose.status === "TAKEN") {
    return {
      kind: "taken",
      icon: Check,
      label: "Taken",
      borderColor: "#639922",
      badgeClass: "bg-status-taken-bg text-status-taken-text",
      sublineClass: "text-status-taken-text",
      opacityClass: "",
    } as const;
  }

  if (dose.status === "MISSED") {
    return {
      kind: "missed",
      icon: OctagonAlert,
      label: "Missed dose",
      borderColor: "#e24b4a",
      badgeClass: "bg-status-missed-bg text-status-missed-text",
      sublineClass: "text-status-missed-text",
      opacityClass: "",
    } as const;
  }

  if (scheduledFor.getTime() <= Date.now()) {
    return {
      kind: "due",
      icon: Clock,
      label: "Due now",
      borderColor: "#ba7517",
      badgeClass: "bg-status-due-bg text-status-due-text",
      sublineClass: "text-status-due-text",
      opacityClass: "",
    } as const;
  }

  return {
    kind: "upcoming",
    icon: Circle,
    label: "Scheduled for later today",
    borderColor: "#e8e6df",
    badgeClass: "bg-bg text-text-muted",
    sublineClass: "text-text-muted",
    opacityClass: "opacity-85",
  } as const;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
