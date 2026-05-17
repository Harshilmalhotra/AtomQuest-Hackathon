import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ManagerReviewForm } from "@/components/ManagerReviewForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ApprovalReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const goalSheet = await prisma.goalSheet.findUnique({
    where: { id },
    include: {
      user: true,
      goals: {
        orderBy: { createdAt: "asc" }
      },
    },
  });

  if (!goalSheet || goalSheet.status !== "SUBMITTED") {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div>
        <Link href="/approvals" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Approvals
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Review Goal Sheet</h1>
        <p className="text-slate-500 mt-1 text-lg">
          Submitted by <span className="font-bold text-slate-700">{goalSheet.user.name || goalSheet.user.email}</span> for the {goalSheet.year} cycle.
        </p>
      </div>

      <ManagerReviewForm goalSheet={goalSheet} />
    </div>
  );
}
