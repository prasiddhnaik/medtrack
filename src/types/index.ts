export type MedicationInput = {
  name: string;
  dosage: string;
  times: string[];
};

export type DoseStatus = "PENDING" | "TAKEN" | "MISSED";

export type Medication = MedicationInput & {
  id: string;
  createdAt: string;
};

export type DoseLogWithMedication = {
  id: string;
  medicationId: string;
  scheduledFor: string;
  takenAt: string | null;
  status: DoseStatus;
  createdAt: string;
  medication: Medication;
};

export type DailyAdherencePoint = {
  date: string;
  label: string;
  total: number;
  taken: number;
  percentage: number;
};
