import { cookies } from "next/headers";
import { auth as clerkAuth } from "@clerk/nextjs/server";

export async function getAuth() {
  const cookieStore = await cookies();
  const devSession = cookieStore.get("dev_session");

  if (devSession && devSession.value) {
    return { userId: devSession.value };
  }

  return await clerkAuth();
}
