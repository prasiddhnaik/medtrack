import type { MedicationInput } from "@/types";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const medicationNamePattern = /^[A-Za-z][A-Za-z0-9][A-Za-z0-9 .,'()-]*$/;
const dosagePattern =
  /^(?:\d+(?:\.\d{1,2})?\s?(?:mg|mcg|g|ml|mL|IU|units?|tabs?|tablets?|caps?|capsules?|drops?|puffs?|sprays?)|one\s(?:tablet|capsule|drop|puff|spray)|two\s(?:tablets|capsules|drops|puffs|sprays))$/i;
const maxMedicationNameLength = 60;
const maxDosageLength = 24;
const maxTimesPerMedication = 6;

export function parseMedicationInput(value: unknown): MedicationInput {
  if (!isRecord(value)) {
    throw new Error("Medication payload must be an object.");
  }

  const name = readMedicationName(value.name);
  const dosage = readDosage(value.dosage);
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

function readMedicationName(value: unknown) {
  const name = readRequiredString(value, "name");

  if (name.length > maxMedicationNameLength) {
    throw new Error(`Medication name must be ${maxMedicationNameLength} characters or less.`);
  }

  if (!medicationNamePattern.test(name)) {
    throw new Error(
      "Medication name can use letters, numbers, spaces, and basic punctuation.",
    );
  }

  return name;
}

function readDosage(value: unknown) {
  const dosage = readRequiredString(value, "dosage");

  if (dosage.length > maxDosageLength) {
    throw new Error(`Dosage must be ${maxDosageLength} characters or less.`);
  }

  if (!dosagePattern.test(dosage)) {
    throw new Error("Use a realistic dosage such as 500mg, 5 mL, 1 tablet, or 2 puffs.");
  }

  return dosage.replace(/\s+/g, " ");
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

  if (times.length > maxTimesPerMedication) {
    throw new Error(`Use ${maxTimesPerMedication} or fewer dose times per medication.`);
  }

  if (times.some((time) => !timePattern.test(time))) {
    throw new Error("Times must use HH:MM 24-hour format.");
  }

  return Array.from(new Set(times)).sort();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
