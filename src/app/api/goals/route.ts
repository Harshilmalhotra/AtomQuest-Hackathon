import { NextResponse } from "next/server";
import { getAuth as auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's email or other info from Clerk if needed
    // For now, ensure the user exists in our DB, if not create them
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      // In a real app, you might sync this via a Clerk webhook
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@example.com`, // Placeholder, usually synced via webhooks
          role: "EMPLOYEE",
        },
      });
    }

    const body = await req.json();
    const { goals } = body;

    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return new NextResponse("Invalid goals data", { status: 400 });
    }

    // Double check total weightage on the server
    const totalWeightage = goals.reduce((sum: number, g: any) => sum + Number(g.weightage), 0);
    if (totalWeightage !== 100) {
      return new NextResponse("Total weightage must be 100%", { status: 400 });
    }

    // Save the Goal Sheet and its Goals
    const goalSheet = await prisma.goalSheet.create({
      data: {
        userId: dbUser.id,
        year: new Date().getFullYear(),
        status: "SUBMITTED",
        goals: {
          create: goals.map((g: any) => ({
            title: g.title,
            description: g.description,
            thrustArea: g.thrustArea,
            uomType: g.uomType,
            target: Number(g.target),
            weightage: Number(g.weightage),
          })),
        },
      },
    });

    return NextResponse.json(goalSheet, { status: 201 });

  } catch (error) {
    console.error("[GOALS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
