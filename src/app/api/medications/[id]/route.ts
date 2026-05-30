import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { setupRequiredResponse } from "@/lib/api";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  if (!isDatabaseConfigured) {
    return setupRequiredResponse();
  }

  const { id } = await context.params;
  const prisma = getPrisma();

  try {
    await prisma.medication.delete({
      where: { id },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Medication was not found." },
        { status: 404 },
      );
    }

    throw error;
  }

  return NextResponse.json({ ok: true });
}
