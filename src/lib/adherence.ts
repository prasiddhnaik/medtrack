export type AdherenceDoseLog = {
  scheduledFor: Date;
  status: "PENDING" | "TAKEN" | "MISSED";
  takenAt: Date | null;
};

export type DailyAdherence = {
  date: string;
  label: string;
  total: number;
  taken: number;
  percentage: number;
};

export function getWeeklyAdherence(logs: AdherenceDoseLog[], today = new Date()) {
  const days = getLastSevenDays(today);

  return days.map((day) => {
    const dateKey = toDateKey(day);
    const dayLogs = logs.filter((log) => toDateKey(log.scheduledFor) === dateKey);
    const taken = dayLogs.filter((log) => log.status === "TAKEN").length;
    const total = dayLogs.length;

    return {
      date: dateKey,
      label: day.toLocaleDateString("en", { weekday: "short" }),
      total,
      taken,
      percentage: total === 0 ? 0 : Math.round((taken / total) * 100),
    };
  });
}

export function getCurrentStreak(dailyAdherence: DailyAdherence[]) {
  let streak = 0;

  for (let index = dailyAdherence.length - 1; index >= 0; index -= 1) {
    const day = dailyAdherence[index];

    if (day.total === 0) {
      continue;
    }

    if (day.percentage < 100) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export function getWeeklySummary(dailyAdherence: DailyAdherence[]) {
  const total = dailyAdherence.reduce((sum, day) => sum + day.total, 0);
  const taken = dailyAdherence.reduce((sum, day) => sum + day.taken, 0);

  return {
    total,
    taken,
    percentage: total === 0 ? 0 : Math.round((taken / total) * 100),
  };
}

function getLastSevenDays(today: Date) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
