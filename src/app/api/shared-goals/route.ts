import { NextResponse } from "next/server";
import { getAuth as auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, thrustArea, uomType, target, employeeIds } = body;

    if (!title || !thrustArea || !uomType || target === undefined || !employeeIds || !employeeIds.length) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const currentYear = new Date().getFullYear();

    // Loop through each selected employee and push the goal
    for (const employeeId of employeeIds) {
      // Find or create an active (Draft or Returned) GoalSheet for the current year
      let goalSheet = await prisma.goalSheet.findFirst({
        where: { 
          userId: employeeId,
          year: currentYear,
          status: { in: ["DRAFT", "RETURNED"] }
        }
      });

      // If they don't have a mutable GoalSheet, we create a fresh Draft one
      if (!goalSheet) {
        goalSheet = await prisma.goalSheet.create({
          data: {
            userId: employeeId,
            year: currentYear,
            status: "DRAFT"
          }
        });
      }

      // Check if they already have 8 goals
      const currentGoalsCount = await prisma.goal.count({
        where: { goalSheetId: goalSheet.id }
      });

      if (currentGoalsCount >= 8) {
        // Skip this employee if they are full. (In a real app, we'd log this or notify the manager)
        continue;
      }

      // Automatically assign weightage. We'll default to 10% since it's the minimum. 
      // The employee can adjust it later.
      // Wait, we just push it with 10% and let them figure it out, or we can push it with 0% and force them to rebalance. 
      // Zod validation forces 10%, so let's set it to 10.
      await prisma.goal.create({
        data: {
          goalSheetId: goalSheet.id,
          title: `[SHARED] ${title}`, // Prefix to make it obvious
          description: description || "",
          thrustArea: thrustArea,
          uomType: uomType,
          target: Number(target),
          weightage: 10, 
          isShared: true,
          // Since it's a top-down push and we aren't tracking a single master source right now, 
          // we just mark it as shared so they can't edit title/target.
        }
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("[SHARED_GOALS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
