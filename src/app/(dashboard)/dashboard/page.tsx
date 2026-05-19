import { getAuth as auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WelcomeModal } from "@/components/WelcomeModal";


export default async function DashboardPage() {
  const { userId } = await auth();

  let totalGoals = 0;
  let completedCheckIns = 0;
  let avgScore = 0;

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (dbUser) {
      const activeSheet = await prisma.goalSheet.findFirst({
        where: { userId: dbUser.id },
        include: {
          goals: {
            include: { checkIns: true }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      if (activeSheet) {
        totalGoals = activeSheet.goals.length;
        
        let totalScoreSum = 0;
        let scoredCheckInsCount = 0;

        activeSheet.goals.forEach(goal => {
          if (goal.checkIns && goal.checkIns.length > 0) {
            completedCheckIns++;
            const checkIn = goal.checkIns[0]; // simplistic tracking for latest checkin
            if (checkIn.systemScore !== null && checkIn.systemScore !== undefined) {
              totalScoreSum += checkIn.systemScore;
              scoredCheckInsCount++;
            }
          }
        });

        if (scoredCheckInsCount > 0) {
          avgScore = Math.round((totalScoreSum / scoredCheckInsCount) * 100);
        }
      }
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-lg">Welcome back. Here is an overview of your active goals and check-ins.</p>
        </div>
        <Link href="/goals/new">
          <Button className="font-semibold shadow-md rounded-xl">
            Draft New Goal Sheet
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Active Goals</h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-2">{totalGoals}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Completed Check-ins</h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-2">{completedCheckIns}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Avg System Score</h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-2">{avgScore}%</p>
        </div>
      </div>

      <WelcomeModal />
    </div>
  );
}
