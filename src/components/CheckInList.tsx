"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Info, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export function CheckInList({ goals }: { goals: any[] }) {
  const router = useRouter();
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");
  const [achievements, setAchievements] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine active window (Hackathon Demo Logic included)
  const currentMonth = new Date().getMonth(); // 0-11
  let activeWindowWarning = "";
  
  // Rules: Q1=July(6), Q2=Oct(9), Q3=Jan(0), Q4=Mar/Apr(2,3)
  // For the hackathon, we show a warning but don't strictly lock the UI so judges can test it.
  if (selectedQuarter === "Q1" && currentMonth !== 6) activeWindowWarning = "The Q1 check-in window is officially open in July. (Demo Mode: Submission allowed)";
  if (selectedQuarter === "Q2" && currentMonth !== 9) activeWindowWarning = "The Q2 check-in window is officially open in October. (Demo Mode: Submission allowed)";
  if (selectedQuarter === "Q3" && currentMonth !== 0) activeWindowWarning = "The Q3 check-in window is officially open in January. (Demo Mode: Submission allowed)";
  if (selectedQuarter === "Q4" && currentMonth !== 2 && currentMonth !== 3) activeWindowWarning = "The Q4 check-in window is officially open in March/April. (Demo Mode: Submission allowed)";

  const handleAchievementChange = (goalId: string, field: string, value: string) => {
    setAchievements(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    const payloads = Object.keys(achievements).map(goalId => ({
      goalId,
      quarter: selectedQuarter,
      actualAchievement: Number(achievements[goalId].actualAchievement) || 0,
      status: achievements[goalId].status || "ON_TRACK",
    }));

    if (payloads.length === 0) {
      setError("Please log an achievement for at least one goal.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIns: payloads }),
      });

      if (!response.ok) {
        throw new Error("Failed to save check-ins");
      }

      setAchievements({});
      router.refresh();
      alert("Check-ins successfully saved!");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-20 z-10">
        <div className="flex items-center gap-4">
          <label className="font-bold text-slate-700">Select Quarter:</label>
          <select 
            className="flex h-10 w-32 rounded-lg border border-input bg-slate-50 px-3 py-2 font-bold text-primary focus:ring-primary"
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
          >
            <option value="Q1">Q1 (July)</option>
            <option value="Q2">Q2 (Oct)</option>
            <option value="Q3">Q3 (Jan)</option>
            <option value="Q4">Q4 (Mar/Apr)</option>
          </select>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="rounded-xl font-semibold px-8 shadow-md"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Submit Check-ins
        </Button>
      </div>

      {activeWindowWarning && (
        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
          <Clock className="w-4 h-4 mr-2" />
          <AlertDescription className="font-medium">{activeWindowWarning}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {goals.map((goal) => {
          // Find if there's already a check-in for this quarter
          const existingCheckIn = goal.checkIns?.find((c: any) => c.quarter === selectedQuarter);
          const currentInput = achievements[goal.id] || {};

          return (
            <div key={goal.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{goal.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-bold">{goal.uomType}</span>
                    <span className="text-sm text-slate-500">Weightage: {goal.weightage}%</span>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3 rounded-xl border border-slate-100 text-center">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target</div>
                  <div className="text-2xl font-extrabold text-slate-900">{goal.target}</div>
                </div>
              </div>

              {existingCheckIn ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-bold text-green-900">Check-in Completed</div>
                      <div className="text-sm text-green-700">Achievement: {existingCheckIn.actualAchievement} | Score: {existingCheckIn.systemScore ? `${(existingCheckIn.systemScore * 100).toFixed(0)}%` : '-'}</div>
                    </div>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-green-700 border border-green-200 shadow-sm">
                    {existingCheckIn.status}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Actual Achievement</label>
                    <Input 
                      type="number" 
                      placeholder="Enter value..."
                      className="bg-white rounded-lg"
                      value={currentInput.actualAchievement || ""}
                      onChange={(e) => handleAchievementChange(goal.id, "actualAchievement", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Progress Status</label>
                    <select 
                      className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={currentInput.status || "NOT_STARTED"}
                      onChange={(e) => handleAchievementChange(goal.id, "status", e.target.value)}
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="ON_TRACK">On Track</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div className="space-y-2 flex flex-col justify-center">
                    <div className="text-sm text-slate-500 flex items-start gap-2 pt-6">
                      <Info className="w-4 h-4 mt-0.5 text-primary" />
                      System score will be auto-calculated upon submission based on UoM rules.
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
