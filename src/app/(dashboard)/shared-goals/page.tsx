import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SharedGoalsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shared KPIs</h1>
        <p className="text-slate-500 mt-1 text-lg">Push departmental goals top-down to your team members.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center p-16 text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
          <Target className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Departmental KPIs</h3>
        <p className="text-slate-500 mt-2 max-w-sm mb-6">
          You can create a shared objective that will be automatically pushed to selected team members' Goal Sheets. They will only be able to adjust the weightage.
        </p>
        <Button className="rounded-xl font-semibold shadow-md px-6">
          Create Shared KPI (Coming Soon)
        </Button>
      </div>
    </div>
  );
}
