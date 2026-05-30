export type MedicationScheduleSource = {
  id: string;
  name: string;
  dosage: string;
  times: string[];
};

export type DoseSlot = {
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledFor: Date;
  time: string;
};

export function getDoseSlotsForDate(
  medications: MedicationScheduleSource[],
  date: Date,
) {
  return medications
    .flatMap((medication) =>
      medication.times.map((time) => ({
        medicationId: medication.id,
        medicationName: medication.name,
        dosage: medication.dosage,
        scheduledFor: buildScheduledDate(date, time),
        time,
      })),
    )
    .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
}

export function buildScheduledDate(date: Date, time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const scheduledFor = new Date(date);

  scheduledFor.setHours(hour, minute, 0, 0);

  return scheduledFor;
}

export function getDayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}
