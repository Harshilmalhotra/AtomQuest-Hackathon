import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CheckSquare } from "lucide-react";
import { CheckInList } from "@/components/CheckInList";

export default async function CheckInsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });

  let activeSheet = null;
  if (dbUser) {
    // Get the most recent APPROVED goal sheet for the user
    activeSheet = await prisma.goalSheet.findFirst({
      where: { 
        userId: dbUser.id,
        status: "APPROVED" 
      },
      include: {
        goals: {
          include: {
            checkIns: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quarterly Check-ins</h1>
        <p className="text-slate-500 mt-1 text-lg">Log your actual achievements against your planned targets.</p>
      </div>

      {!activeSheet ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Active Goals</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            You do not have an approved Goal Sheet for this cycle. Check-ins are only available after your manager approves your goals.
          </p>
        </div>
      ) : (
        <CheckInList goals={activeSheet.goals} />
      )}
    </div>
  );
}
