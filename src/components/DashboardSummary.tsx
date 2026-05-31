"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Flame, TrendingUp } from "lucide-react";
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

  const roundedPercentage = Math.round(data.summary.percentage);
  const missed = Math.max(data.summary.total - data.summary.taken, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="This week"
          value={`${roundedPercentage}%`}
          detail={`${data.summary.taken} of ${data.summary.total} doses taken`}
          icon={<TrendingUp size={22} strokeWidth={1.8} aria-hidden="true" />}
          tone="hero"
        />
        <StatCard
          label="Current streak"
          value={`${data.streak} days`}
          detail="Full-adherence run"
          icon={<Flame size={22} strokeWidth={1.8} aria-hidden="true" />}
        />
        <StatCard
          label="Missed"
          value={`${missed} doses`}
          detail="Needs attention"
          icon={<AlertTriangle size={22} strokeWidth={1.8} aria-hidden="true" />}
          tone="danger"
        />
      </div>

      <AdherenceChart data={data.daily} />
    </div>
  );
}
