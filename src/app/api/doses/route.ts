import { NextResponse } from "next/server";
import { badRequestResponse, setupRequiredResponse, unauthorizedResponse } from "@/lib/api";
import { getWeeklyAdherence, getWeeklySummary, getCurrentStreak } from "@/lib/adherence";
import { getDayRange, getDoseSlotsForDate } from "@/lib/schedule";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";
import { getApiSession } from "@/lib/session";
import { parseDoseUpdateInput } from "@/lib/validators";

export async function GET(request: Request) {
  const session = await getApiSession();
  if (!session) {
    return unauthorizedResponse();
  }

  if (!isDatabaseConfigured) {
    return setupRequiredResponse();
  }

  const url = new URL(request.url);
  const date = url.searchParams.get("date")
    ? new Date(String(url.searchParams.get("date")))
    : new Date();

  if (Number.isNaN(date.getTime())) {
    return badRequestResponse("date must be a valid date.");
  }

  if (!isWithinDoseScheduleWindow(date)) {
    return badRequestResponse("Schedule date must be within 7 days of today.");
  }

  const prisma = getPrisma();
  const medications = await prisma.medication.findMany({
    orderBy: [{ name: "asc" }],
  });
  const slots = getDoseSlotsForDate(medications, date);

  await prisma.doseLog.createMany({
    data: slots.map((slot) => ({
      medicationId: slot.medicationId,
      scheduledFor: slot.scheduledFor,
    })),
    skipDuplicates: true,
  });

  const { start, end } = getDayRange(date);
  const doses = await prisma.doseLog.findMany({
    where: {
      scheduledFor: {
        gte: start,
        lt: end,
      },
    },
    include: {
      medication: true,
    },
    orderBy: [{ scheduledFor: "asc" }],
  });

  return NextResponse.json({ doses });
}

export async function POST(request: Request) {
  const session = await getApiSession();
  if (!session) {
    return unauthorizedResponse();
  }

  if (!isDatabaseConfigured) {
    return setupRequiredResponse();
  }

  try {
    const { doseLogId } = parseDoseUpdateInput(await request.json());
    const prisma = getPrisma();
    const dose = await prisma.doseLog.update({
      where: { id: doseLogId },
      data: {
        status: "TAKEN",
        takenAt: new Date(),
      },
      include: {
        medication: true,
      },
    });

    return NextResponse.json({ dose });
  } catch (error) {
    if (error instanceof Error && error.message.includes("doseLogId")) {
      return badRequestResponse(error.message);
    }

    return badRequestResponse("Unable to update dose.");
  }
}

export async function PATCH() {
  return NextResponse.json({ error: "Use POST to mark a dose as taken." }, { status: 405 });
}

function isWithinDoseScheduleWindow(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 7);

  const end = new Date(today);
  end.setDate(end.getDate() + 7);
  end.setHours(23, 59, 59, 999);

  return date >= start && date <= end;
}
