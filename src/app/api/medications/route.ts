import { NextResponse } from "next/server";
import { badRequestResponse, setupRequiredResponse, unauthorizedResponse } from "@/lib/api";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";
import { getApiUserEmail } from "@/lib/session";
import { parseMedicationInput } from "@/lib/validators";

const medicationResponseFields = {
  id: true,
  name: true,
  dosage: true,
  times: true,
  createdAt: true,
};

export async function GET() {
  const userEmail = await getApiUserEmail();
  if (!userEmail) {
    return unauthorizedResponse();
  }

  if (!isDatabaseConfigured) {
    return setupRequiredResponse();
  }

  const prisma = getPrisma();
  const medications = await prisma.medication.findMany({
    where: { userEmail },
    select: medicationResponseFields,
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json({ medications });
}

export async function POST(request: Request) {
  const userEmail = await getApiUserEmail();
  if (!userEmail) {
    return unauthorizedResponse();
  }

  if (!isDatabaseConfigured) {
    return setupRequiredResponse();
  }

  try {
    const input = parseMedicationInput(await request.json());
    const prisma = getPrisma();
    const medication = await prisma.medication.create({
      data: {
        ...input,
        userEmail,
      },
      select: medicationResponseFields,
    });

    return NextResponse.json({ medication }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return badRequestResponse(error.message);
    }

    return badRequestResponse("Unable to create medication.");
  }
}
