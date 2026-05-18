import { NextResponse } from "next/server";
import { getAuth as auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, goals } = body;

    if (!action || !["APPROVED", "RETURNED"].includes(action)) {
      return new NextResponse("Invalid action", { status: 400 });
    }

    if (!goals || !Array.isArray(goals)) {
      return new NextResponse("Invalid goals data", { status: 400 });
    }

    // Verify weightage if approving
    if (action === "APPROVED") {
      const totalWeightage = goals.reduce((sum: number, g: any) => sum + Number(g.weightage), 0);
      if (totalWeightage !== 100) {
        return new NextResponse("Total weightage must be exactly 100% to approve.", { status: 400 });
      }
    }

    // Use a transaction to ensure all updates happen atomically
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update the Goal Sheet status
      const updatedSheet = await tx.goalSheet.update({
        where: { id },
        data: {
          status: action,
          lockedAt: action === "APPROVED" ? new Date() : null,
        },
      });

      // 2. Update each goal's inline-edited target and weightage
      for (const goal of goals) {
        await tx.goal.update({
          where: { id: goal.id },
          data: {
            target: Number(goal.target),
            weightage: Number(goal.weightage),
          },
        });
      }

      // 3. Create an Audit Log entry (Preparation for Phase 5)
      const dbUser = await tx.user.findUnique({ where: { clerkId: userId } });
      if (dbUser) {
        await tx.auditLog.create({
          data: {
            entity: "GoalSheet",
            entityId: id,
            action: action,
            changedBy: dbUser.id,
          },
        });
      }

      return updatedSheet;
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("[GOALS_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
