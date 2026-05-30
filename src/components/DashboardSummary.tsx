"use client";

import { useEffect, useState } from "react";
import { AdherenceChart } from "@/components/AdherenceChart";
import { StatCard } from "@/components/StatCard";
import type { DailyAdherencePoint } from "@/types";

type DashboardData = {
  daily: DailyAdherencePoint[];
  summary: {
    total: number;
    taken: number;
    percentage: number;
  };
  streak: number;
};

export function DashboardSummary() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function loadDashboard() {
    const response = await fetch("/api/dashboard");
    const body = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(body.error ?? "Unable to load dashboard.");
      return;
    }

    setData(body);
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Weekly adherence"
          value={`${data.summary.percentage}%`}
          detail={`${data.summary.taken} of ${data.summary.total} scheduled doses taken`}
        />
        <StatCard
          label="Current streak"
          value={`${data.streak} days`}
          detail="Consecutive full-adherence days in the current week"
        />
        <StatCard
          label="Tracked doses"
          value={String(data.summary.total)}
          detail="Dose logs included in the seven-day window"
        />
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-950">
          Seven-day adherence
        </h2>
        <AdherenceChart data={data.daily} />
      </section>
    </div>
  );
}
