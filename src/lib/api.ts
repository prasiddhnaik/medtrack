import { NextResponse } from "next/server";

export function setupRequiredResponse() {
  return NextResponse.json(
    {
      error:
        "DATABASE_URL is not configured. Add your Neon connection string to .env and run the Prisma migration.",
    },
    { status: 503 },
  );
}

export function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Sign in is required to use MedTrack." },
    { status: 401 },
  );
}
