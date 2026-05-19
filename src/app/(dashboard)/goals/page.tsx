import { Button } from "@/components/ui/button";
import { PlusCircle, Target, FileText } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getAuth as auth } from "@/lib/auth";

export default async function GoalsPage() {
  const { userId } = await auth();

  let goalSheets: any[] = [];
  
  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (dbUser) {
      goalSheets = await prisma.goalSheet.findMany({
        where: { userId: dbUser.id },
        include: { goals: true },
        orderBy: { createdAt: "desc" }
      });
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "APPROVED": return "bg-green-100 text-green-700";
      case "SUBMITTED": return "bg-blue-100 text-blue-700";
      case "RETURNED": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Goal Sheets</h1>
          <p className="text-slate-500 mt-1 text-lg">Manage your organizational goals and objectives.</p>
        </div>
        <Link href="/goals/new">
          <Button size="lg" className="font-semibold shadow-md rounded-xl">
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Goal Sheet
          </Button>
        </Link>
      </div>

      {goalSheets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Goal Sheets Found</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            You haven't submitted any goals for the current cycle. Click the button above to draft your first goal sheet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goalSheets.map((sheet) => (
            <div key={sheet.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{sheet.year} Cycle</h3>
                    <p className="text-xs text-slate-500">{new Date(sheet.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(sheet.status)}`}>
                  {sheet.status}
                </span>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-sm text-slate-500 mb-1">Total Goals</div>
                  <div className="text-2xl font-bold text-slate-900">{sheet.goals.length}</div>
                </div>
              </div>

              {sheet.status === "RETURNED" && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link href={`/goals/edit/${sheet.id}`}>
                    <Button className="w-full font-semibold" variant="outline">Edit & Resubmit</Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
