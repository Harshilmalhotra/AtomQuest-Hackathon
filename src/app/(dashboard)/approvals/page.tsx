import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Target, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ApprovalsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  // In a real app, we'd filter by managerId. For the hackathon demo, we fetch all pending.
  const pendingSheets = await prisma.goalSheet.findMany({
    where: { status: "SUBMITTED" },
    include: {
      user: true,
      goals: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Team Approvals</h1>
        <p className="text-slate-500 mt-1 text-lg">Review and approve Goal Sheets submitted by your team members.</p>
      </div>

      {pendingSheets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">All Caught Up!</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            There are currently no Goal Sheets pending your approval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingSheets.map((sheet) => (
            <div key={sheet.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{sheet.user.name || sheet.user.email}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{sheet.year} Goal Sheet</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-sm text-slate-500 mb-1">Goals Drafted</div>
                  <div className="text-2xl font-bold text-slate-900">{sheet.goals.length}</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link href={`/approvals/${sheet.id}`}>
                  <Button className="w-full font-semibold">Review & Approve</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
