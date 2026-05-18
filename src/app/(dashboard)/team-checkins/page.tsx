import prisma from "@/lib/prisma";
import { getAuth as auth } from "@/lib/auth";
import { CheckSquare, User as UserIcon } from "lucide-react";
import { TeamCheckInReview } from "@/components/TeamCheckInReview";

export default async function TeamCheckInsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  // Fetch check-ins for the team (all approved goal sheets with checkins)
  const activeSheets = await prisma.goalSheet.findMany({
    where: { status: "APPROVED" },
    include: {
      user: true,
      goals: {
        include: {
          checkIns: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Team Check-ins</h1>
        <p className="text-slate-500 mt-1 text-lg">Review your team's quarterly progress and provide mandatory structured feedback.</p>
      </div>

      {activeSheets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Team Check-ins</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            There are currently no approved goal sheets or check-ins to review.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeSheets.map((sheet) => (
            <div key={sheet.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{sheet.user.name || sheet.user.email}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{sheet.year} Goal Sheet</p>
                </div>
              </div>
              <div className="p-6">
                <TeamCheckInReview goals={sheet.goals} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
