import { NextResponse } from "next/server";
import { badRequestResponse, setupRequiredResponse } from "@/lib/api";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";
import { parseMedicationInput } from "@/lib/validators";

export async function GET() {
  if (!isDatabaseConfigured) {
    return setupRequiredResponse();
  }

  const prisma = getPrisma();
  const medications = await prisma.medication.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json({ medications });
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return setupRequiredResponse();
  }

  try {
    const input = parseMedicationInput(await request.json());
    const prisma = getPrisma();
    const medication = await prisma.medication.create({ data: input });

    return NextResponse.json({ medication }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create medication.";
    return badRequestResponse(message);
  }
}
