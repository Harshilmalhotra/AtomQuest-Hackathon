import { Button } from "@/components/ui/button";
import { PlusCircle, Target } from "lucide-react";
import Link from "next/link";

export default function GoalsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Goal Sheets</h1>
          <p className="text-slate-500 mt-1 text-lg">Manage your organizational goals and objectives.</p>
        </div>
        <Link href="/goals/new">
          <Button size="lg" className="font-semibold shadow-md rounded-xl">
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Goal Sheet
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center p-16 text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
          <Target className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Goal Sheets Found</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
          You haven't submitted any goals for the current cycle. Click the button above to draft your first goal sheet.
        </p>
      </div>
    </div>
  );
}
