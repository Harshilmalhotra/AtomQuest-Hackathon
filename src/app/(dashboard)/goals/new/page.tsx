import { GoalSheetForm } from "@/components/GoalSheetForm";

export default function NewGoalSheetPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Draft Goal Sheet</h1>
        <p className="text-slate-500 mt-1 text-lg">Define your goals for the upcoming cycle. You can add up to 8 goals. Ensure the total weightage is exactly 100%.</p>
      </div>

      <GoalSheetForm />
    </div>
  );
}
