import { NextResponse } from "next/server";
import { getAuth as auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function calculateSystemScore(actual: number, target: number, uomType: string): number {
  if (target === 0 && uomType !== "ZERO") return 0; // Prevent division by zero

  switch (uomType) {
    case "MIN_NUMERIC":
      // Higher is better: Sales, Revenue
      return actual / target;
    case "MAX_NUMERIC":
      // Lower is better: Turnaround time, defects
      if (actual === 0) return 1.0; // Perfect score if actual is 0 and lower is better
      return target / actual;
    case "ZERO":
      // Zero incidents = 100%, else 0%
      return actual === 0 ? 1.0 : 0.0;
    case "TIMELINE":
      // For numeric timeline (e.g. days left), lower is better or direct pass/fail
      return actual <= target ? 1.0 : target / actual;
    default:
      return 0.0;
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { checkIns } = body;

    if (!checkIns || !Array.isArray(checkIns)) {
      return new NextResponse("Invalid check-ins data", { status: 400 });
    }

    // Process each checkin
    // We should do this in a transaction or sequential updates
    const results = [];
    for (const checkIn of checkIns) {
      // Fetch the goal to get the target and uomType
      const goal = await prisma.goal.findUnique({ where: { id: checkIn.goalId } });
      if (!goal) continue;

      const score = calculateSystemScore(checkIn.actualAchievement, goal.target, goal.uomType);

      const savedCheckIn = await prisma.checkIn.create({
        data: {
          goalId: goal.id,
          quarter: checkIn.quarter,
          actualAchievement: checkIn.actualAchievement,
          status: checkIn.status,
          systemScore: score,
        }
      });
      results.push(savedCheckIn);
    }

    return NextResponse.json(results, { status: 201 });

  } catch (error) {
    console.error("[CHECK_INS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
