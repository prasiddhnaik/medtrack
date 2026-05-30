import type { MedicationInput } from "@/types";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export function parseMedicationInput(value: unknown): MedicationInput {
  if (!isRecord(value)) {
    throw new Error("Medication payload must be an object.");
  }

  const name = readRequiredString(value.name, "name");
  const dosage = readRequiredString(value.dosage, "dosage");
  const times = readTimes(value.times);

  return { name, dosage, times };
}

export function parseDoseUpdateInput(value: unknown) {
  if (!isRecord(value)) {
    throw new Error("Dose payload must be an object.");
  }

  return {
    doseLogId: readRequiredString(value.doseLogId, "doseLogId"),
  };
}

function readRequiredString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

function readTimes(value: unknown) {
  if (!Array.isArray(value)) {
    throw new Error("times must be an array.");
  }

  const times = value
    .filter((time): time is string => typeof time === "string")
    .map((time) => time.trim())
    .filter(Boolean);

  if (times.length === 0) {
    throw new Error("At least one medication time is required.");
  }

  if (times.some((time) => !timePattern.test(time))) {
    throw new Error("Times must use HH:MM 24-hour format.");
  }

  return Array.from(new Set(times)).sort();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
