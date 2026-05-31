import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";

export async function getAppSession() {
  return getServerSession(authOptions);
}

export async function requirePageSession() {
  const session = await getAppSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function getApiSession() {
  const session = await getAppSession();
  return session?.user ? session : null;
}
