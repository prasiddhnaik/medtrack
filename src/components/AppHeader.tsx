import { AppHeaderClient } from "@/components/AppHeaderClient";
import { getAppSession } from "@/lib/session";

export async function AppHeader() {
  const session = await getAppSession();

  return (
    <AppHeaderClient
      userName={session?.user?.name}
      userEmail={session?.user?.email}
    />
  );
}
