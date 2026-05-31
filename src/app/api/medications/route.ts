import { NextResponse } from "next/server";
import { badRequestResponse, setupRequiredResponse, unauthorizedResponse } from "@/lib/api";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";
import { getApiSession } from "@/lib/session";
import { parseMedicationInput } from "@/lib/validators";

export async function GET() {
  const session = await getApiSession();
  if (!session) {
    return unauthorizedResponse();
  }

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
  const session = await getApiSession();
  if (!session) {
    return unauthorizedResponse();
  }

  if (!isDatabaseConfigured) {
    return setupRequiredResponse();
  }

  try {
    const input = parseMedicationInput(await request.json());
    const prisma = getPrisma();
    const medication = await prisma.medication.create({ data: input });

    return NextResponse.json({ medication }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return badRequestResponse(error.message);
    }

    return badRequestResponse("Unable to create medication.");
  }
}
