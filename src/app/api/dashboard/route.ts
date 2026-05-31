import { NextResponse } from "next/server";
import {
  getCurrentStreak,
  getWeeklyAdherence,
  getWeeklySummary,
} from "@/lib/adherence";
import { setupRequiredResponse, unauthorizedResponse } from "@/lib/api";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";
import { getApiUserEmail } from "@/lib/session";

export async function GET() {
  const userEmail = await getApiUserEmail();
  if (!userEmail) {
    return unauthorizedResponse();
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
      userEmail,
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
