import { NextResponse } from "next/server";
import { setupRequiredResponse, unauthorizedResponse } from "@/lib/api";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";
import { getApiUserEmail } from "@/lib/session";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const userEmail = await getApiUserEmail();
  if (!userEmail) {
    return unauthorizedResponse();
  }

  if (!isDatabaseConfigured) {
    return setupRequiredResponse();
  }

  const { id } = await context.params;
  const prisma = getPrisma();
  const result = await prisma.medication.deleteMany({
    where: { id, userEmail },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { error: "Medication was not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
