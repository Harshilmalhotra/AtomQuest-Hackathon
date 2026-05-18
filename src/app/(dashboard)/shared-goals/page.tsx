import { Target } from "lucide-react";
import { SharedGoalsForm } from "@/components/SharedGoalsForm";
import prisma from "@/lib/prisma";
import { getAuth as auth } from "@/lib/auth";

export default async function SharedGoalsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  
  // Get team members to push goals to
  const teamMembers = await prisma.user.findMany({
    where: { managerId: user?.id }
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shared KPIs</h1>
        <p className="text-slate-500 mt-1 text-lg">Push departmental goals top-down to your team members.</p>
      </div>

      {teamMembers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Team Members Found</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            You must have active team members reporting to you before you can push shared goals.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Create & Push KPI</h3>
              <p className="text-sm text-slate-500 mt-1">
                Define the objective. Your team members will only be able to adjust its weightage.
              </p>
            </div>
          </div>
          <SharedGoalsForm teamMembers={teamMembers} />
        </div>
      )}
    </div>
  );
}
