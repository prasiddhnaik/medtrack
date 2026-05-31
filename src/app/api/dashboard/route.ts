import { NextResponse } from "next/server";
import {
  getCurrentStreak,
  getWeeklyAdherence,
  getWeeklySummary,
} from "@/lib/adherence";
import { setupRequiredResponse } from "@/lib/api";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";
import { getApiSession } from "@/lib/session";

export async function GET() {
  const session = await getApiSession();
  if (!session) {
    return NextResponse.json(
      { error: "Sign in is required to use MedTrack." },
      { status: 401 },
    );
  }

  if (!isDatabaseConfigured) {
    return setupRequiredResponse();
  }

  const prisma = getPrisma();
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 6);

  const logs = await prisma.doseLog.findMany({
    where: {
      scheduledFor: {
        gte: since,
      },
    },
    orderBy: [{ scheduledFor: "asc" }],
  });

  const daily = getWeeklyAdherence(logs);
  const summary = getWeeklySummary(daily);
  const streak = getCurrentStreak(daily);

  return NextResponse.json({ daily, summary, streak });
}
