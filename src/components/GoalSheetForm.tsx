"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

// Define the schema using Zod
const goalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  thrustArea: z.string().min(1, "Thrust area is required"),
  uomType: z.enum(["MIN_NUMERIC", "MAX_NUMERIC", "TIMELINE", "ZERO"]),
  target: z.coerce.number().min(0, "Target must be positive"),
  weightage: z.coerce.number().min(10, "Minimum weightage is 10%"),
});

const formSchema = z.object({
  goals: z.array(goalSchema).min(1, "At least one goal is required").max(8, "Maximum 8 goals allowed"),
});

type FormValues = z.infer<typeof formSchema>;

export function GoalSheetForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goals: [
        { title: "", description: "", thrustArea: "", uomType: "MIN_NUMERIC", target: 0, weightage: 100 }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "goals",
  });

  const watchGoals = form.watch("goals");
  const totalWeightage = watchGoals.reduce((sum, goal) => sum + (Number(goal.weightage) || 0), 0);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    if (totalWeightage !== 100) {
      setError(`Total weightage must be exactly 100%. Current total: ${totalWeightage}%`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save goals");
      }

      router.push("/goals");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between sticky top-20 z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Total Weightage</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-full bg-slate-100 rounded-full h-2.5 w-64 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full ${totalWeightage === 100 ? 'bg-green-500' : totalWeightage > 100 ? 'bg-red-500' : 'bg-primary'}`} 
                style={{ width: `${Math.min(totalWeightage, 100)}%` }}
              ></div>
            </div>
            <span className={`font-mono font-bold ${totalWeightage === 100 ? 'text-green-600' : totalWeightage > 100 ? 'text-red-600' : 'text-primary'}`}>
              {totalWeightage}%
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="outline" className="rounded-xl font-semibold px-6" onClick={() => router.push("/goals")}>
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className="rounded-xl font-semibold px-6 shadow-md"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Goals
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative rounded-2xl border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            <CardContent className="p-8 pt-8 relative">
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-800">Goal Definition</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Goal Title <span className="text-red-500">*</span></Label>
                  <Input 
                    {...form.register(`goals.${index}.title`)} 
                    placeholder="e.g., Increase Q2 Revenue" 
                    className={`rounded-lg ${field.isShared ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}`}
                    readOnly={field.isShared}
                  />
                  {form.formState.errors.goals?.[index]?.title && (
                    <p className="text-xs text-red-500">{form.formState.errors.goals[index].title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Thrust Area <span className="text-red-500">*</span></Label>
                  <Input 
                    {...form.register(`goals.${index}.thrustArea`)} 
                    placeholder="e.g., Financial Growth" 
                    className={`rounded-lg ${field.isShared ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}`}
                    readOnly={field.isShared}
                  />
                  {form.formState.errors.goals?.[index]?.thrustArea && (
                    <p className="text-xs text-red-500">{form.formState.errors.goals[index].thrustArea.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label>Description</Label>
                    {!field.isShared && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={async () => {
                          const currentTitle = form.getValues(`goals.${index}.title`);
                          const currentDesc = form.getValues(`goals.${index}.description`);
                          const currentThrust = form.getValues(`goals.${index}.thrustArea`);
                          
                          if (!currentDesc) {
                            alert("Please write a rough draft in the description first.");
                            return;
                          }

                          // Simple loading indicator on the button could be added, but we'll use a global or simple state if needed.
                          // For simplicity, we just change the text of the button or use a toast.
                          form.setValue(`goals.${index}.description`, "✨ Polishing with AI...");
                          
                          try {
                            const res = await fetch("/api/ai/smart-goal", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ text: currentDesc, title: currentTitle, thrustArea: currentThrust })
                            });
                            
                            if (res.ok) {
                              const data = await res.json();
                              form.setValue(`goals.${index}.description`, data.result);
                            } else {
                              form.setValue(`goals.${index}.description`, currentDesc);
                              alert("Failed to polish goal.");
                            }
                          } catch (e) {
                            form.setValue(`goals.${index}.description`, currentDesc);
                          }
                        }}
                      >
                        ✨ Polish with AI
                      </Button>
                    )}
                  </div>
                  <Textarea 
                    {...form.register(`goals.${index}.description`)} 
                    placeholder="Provide details about how this goal will be achieved..."
                    className={`rounded-lg resize-none ${field.isShared ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}`}
                    rows={4}
                    readOnly={field.isShared}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit of Measurement (UoM) <span className="text-red-500">*</span></Label>
                  <select 
                    {...form.register(`goals.${index}.uomType`)}
                    className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${field.isShared ? "bg-slate-100 text-slate-500 pointer-events-none" : ""}`}
                    disabled={field.isShared}
                  >
                    <option value="MIN_NUMERIC">Numeric / % (Higher is better)</option>
                    <option value="MAX_NUMERIC">Numeric / % (Lower is better)</option>
                    <option value="TIMELINE">Timeline (Date-based)</option>
                    <option value="ZERO">Zero-based (e.g. Safety incidents)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target <span className="text-red-500">*</span></Label>
                    <Input 
                      type="number"
                      {...form.register(`goals.${index}.target`)} 
                      className={`rounded-lg ${field.isShared ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}`}
                      readOnly={field.isShared}
                    />
                    {form.formState.errors.goals?.[index]?.target && (
                      <p className="text-xs text-red-500">{form.formState.errors.goals[index].target.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Weightage (%) <span className="text-red-500">*</span></Label>
                    <Input 
                      type="number"
                      {...form.register(`goals.${index}.weightage`)} 
                      className="rounded-lg font-mono font-bold"
                    />
                    {form.formState.errors.goals?.[index]?.weightage && (
                      <p className="text-xs text-red-500">{form.formState.errors.goals[index].weightage.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {fields.length < 8 && (
          <Button
            type="button"
            variant="outline"
            className="w-full h-16 border-dashed border-2 border-slate-300 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 rounded-2xl transition-all font-bold text-lg"
            onClick={() => append({ title: "", description: "", thrustArea: "", uomType: "MIN_NUMERIC", target: 0, weightage: 10 })}
          >
            <PlusCircle className="w-6 h-6 mr-3" />
            Add Another Goal
          </Button>
        )}
      </form>
    </div>
  );
}
