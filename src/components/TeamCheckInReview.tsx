"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Save } from "lucide-react";

export function TeamCheckInReview({ goals }: { goals: any[] }) {
  const [comments, setComments] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We only show goals that have at least one check-in
  const goalsWithCheckIns = goals.filter((g) => g.checkIns && g.checkIns.length > 0);

  const handleSubmit = async (goalId: string, checkInId: string) => {
    if (!comments[checkInId]) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/check-ins/${checkInId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerComment: comments[checkInId] }),
      });

      if (!response.ok) {
        throw new Error("Failed to save comment");
      }

      alert("Feedback saved successfully!");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (goalsWithCheckIns.length === 0) {
    return <p className="text-slate-500 italic">No check-ins logged for these goals yet.</p>;
  }

  return (
    <div className="space-y-8">
      {goalsWithCheckIns.map((goal) => (
        <div key={goal.id} className="border border-slate-100 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-800">{goal.title}</h4>
              <p className="text-sm text-slate-500">Target: {goal.target} | Weightage: {goal.weightage}%</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {goal.checkIns.map((checkIn: any) => (
              <div key={checkIn.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md text-sm">{checkIn.quarter}</span>
                    <span className="text-sm font-semibold text-slate-600">{checkIn.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Actual</div>
                    <div className="font-bold text-xl text-slate-900">{checkIn.actualAchievement}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg mb-4">
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">System Score</div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${Math.min((checkIn.systemScore || 0) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-slate-800 w-16 text-right">
                    {((checkIn.systemScore || 0) * 100).toFixed(0)}%
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Manager Check-in Comment <span className="text-red-500">*</span></label>
                  <Textarea 
                    placeholder="Provide structured feedback..."
                    className="resize-none"
                    rows={3}
                    defaultValue={checkIn.managerComment || ""}
                    onChange={(e) => setComments({ ...comments, [checkIn.id]: e.target.value })}
                  />
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={() => handleSubmit(goal.id, checkIn.id)}
                      disabled={isSubmitting || !comments[checkIn.id] && !checkIn.managerComment}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Feedback
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
