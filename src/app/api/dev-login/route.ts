import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { clerkId } = await req.json();
    
    if (!clerkId) {
      return new NextResponse("Missing clerkId", { status: 400 });
    }

    const cookieStore = await cookies();
    // In dev mode, we just set a plain cookie we can intercept
    cookieStore.set("dev_session", clerkId, {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DEV_LOGIN]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
