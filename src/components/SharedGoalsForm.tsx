"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  thrustArea: z.string().min(1, "Thrust area is required"),
  uomType: z.enum(["MIN_NUMERIC", "MAX_NUMERIC", "TIMELINE", "ZERO"]),
  target: z.coerce.number().min(0, "Target must be positive"),
  employeeIds: z.array(z.string()).min(1, "Select at least one employee")
});

export function SharedGoalsForm({ teamMembers }: { teamMembers: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeIds: [] as string[]
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/shared-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error("Failed to push goal");
      }
      setIsSuccess(true);
    } catch (err) {
      alert("Error pushing shared goal. Ensure employees have active Draft/Returned goal sheets.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">KPI Successfully Pushed!</h3>
        <p className="text-slate-500 mb-6">The goal has been injected into the selected employees' active goal sheets.</p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">Push Another KPI</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-slate-700">Goal Title</label>
          <input 
            {...register("title")} 
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            placeholder="e.g. Q2 Sales Target"
          />
          {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message?.toString()}</span>}
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">Description</label>
          <textarea 
            {...register("description")} 
            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-slate-700">Thrust Area</label>
            <select {...register("thrustArea")} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="">Select Area...</option>
              <option value="Financial">Financial</option>
              <option value="Customer">Customer</option>
              <option value="Process">Process</option>
              <option value="Learning">Learning & Growth</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700">Unit of Measurement</label>
            <select {...register("uomType")} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="MIN_NUMERIC">Min (Higher is better)</option>
              <option value="MAX_NUMERIC">Max (Lower is better)</option>
              <option value="TIMELINE">Timeline (Days)</option>
              <option value="ZERO">Zero (Defects/Errors)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">Target Value</label>
          <input 
            {...register("target")} 
            type="number"
            step="0.1"
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h4 className="font-bold text-slate-800 mb-3">Select Recipients</h4>
        <div className="space-y-2">
          {teamMembers.map(member => (
            <label key={member.id} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input type="checkbox" value={member.id} {...register("employeeIds")} className="w-5 h-5 rounded text-primary focus:ring-primary" />
              <span className="font-medium text-slate-700">{member.name || member.email}</span>
            </label>
          ))}
          {errors.employeeIds && <span className="text-red-500 text-xs mt-1 block">{errors.employeeIds.message?.toString()}</span>}
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full font-bold shadow-md h-12 text-lg" disabled={isSubmitting}>
          {isSubmitting ? "Pushing KPI..." : "Push Shared KPI"}
          <Send className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}
