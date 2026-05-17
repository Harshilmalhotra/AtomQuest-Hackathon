"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, X, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export function ManagerReviewForm({ goalSheet }: { goalSheet: any }) {
  const router = useRouter();
  const [goals, setGoals] = useState(goalSheet.goals);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalWeightage = goals.reduce((sum: number, g: any) => sum + (Number(g.weightage) || 0), 0);

  const handleUpdate = (index: number, field: string, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], [field]: Number(value) };
    setGoals(newGoals);
  };

  const submitAction = async (action: "APPROVED" | "RETURNED") => {
    setError(null);
    if (action === "APPROVED" && totalWeightage !== 100) {
      setError(`Cannot approve. Total weightage must be exactly 100%. Current total: ${totalWeightage}%`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/goals/${goalSheet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, goals }),
      });

      if (!response.ok) {
        throw new Error("Failed to process approval");
      }

      router.push("/approvals");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between sticky top-20 z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Review Summary</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-slate-500">Total Weightage:</span>
            <span className={`font-mono font-bold ${totalWeightage === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalWeightage}%
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            className="rounded-xl font-semibold px-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => submitAction("RETURNED")}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Return for Rework
          </Button>
          <Button 
            className="rounded-xl font-semibold px-6 shadow-md bg-green-600 hover:bg-green-700 text-white"
            onClick={() => submitAction("APPROVED")}
            disabled={isSubmitting}
          >
            <Check className="w-4 h-4 mr-2" />
            Approve & Lock
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {goals.map((goal: any, index: number) => (
          <div key={goal.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{goal.title}</h3>
                <p className="text-sm text-slate-500">{goal.thrustArea} • {goal.uomType}</p>
              </div>
            </div>
            
            {goal.description && (
              <p className="text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {goal.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Target (Inline Edit)</label>
                <Input 
                  type="number" 
                  value={goal.target} 
                  onChange={(e) => handleUpdate(index, "target", e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Weightage % (Inline Edit)</label>
                <Input 
                  type="number" 
                  value={goal.weightage} 
                  onChange={(e) => handleUpdate(index, "weightage", e.target.value)}
                  className="bg-white font-mono"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
