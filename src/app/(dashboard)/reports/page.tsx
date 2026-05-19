import prisma from "@/lib/prisma";
import { getAuth as auth } from "@/lib/auth";
import { Download, Activity, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";

export default async function ReportsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 20,
  });

  const allGoals = await prisma.goal.findMany({
    include: {
      checkIns: true,
      goalSheet: {
        include: {
          user: true
        }
      }
    }
  });

  const totalGoals = allGoals.length;
  const completedCheckIns = allGoals.filter(g => g.checkIns.length > 0).length;
  const completionRate = totalGoals > 0 ? (completedCheckIns / totalGoals) * 100 : 0;

  // Generate CSV data simply for the hackathon
  const csvHeaders = "Employee,Email,Thrust Area,Goal Title,Target,Achievement,Status,Score\n";
  const csvRows = allGoals.map(g => {
    const checkIn = g.checkIns[0]; // simplistic assumption taking the first check-in
    return `${g.goalSheet.user.name || 'Unknown'},${g.goalSheet.user.email},${g.thrustArea},"${g.title}",${g.target},${checkIn ? checkIn.actualAchievement : 'N/A'},${checkIn ? checkIn.status : 'N/A'},${checkIn && checkIn.systemScore ? (checkIn.systemScore * 100).toFixed(0) + '%' : 'N/A'}`;
  }).join("\n");
  
  const csvData = `data:text/csv;charset=utf-8,${encodeURIComponent(csvHeaders + csvRows)}`;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics & Governance</h1>
          <p className="text-slate-500 mt-1 text-lg">Real-time organizational insights and compliance audit trails.</p>
        </div>
        <a href={csvData} download="Achievement_Report.csv">
          <Button className="font-semibold shadow-md rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export Achievement CSV
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase">Total Active Goals</div>
            <div className="text-3xl font-extrabold text-slate-900">{totalGoals}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase">Completed Check-ins</div>
            <div className="text-3xl font-extrabold text-slate-900">{completedCheckIns}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase">Org Completion Rate</div>
            <div className="text-3xl font-extrabold text-slate-900">{completionRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <AnalyticsCharts goals={allGoals} />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center gap-3">
          <FileText className="w-6 h-6 text-slate-600" />
          <h3 className="font-bold text-xl text-slate-800">System Audit Trail</h3>
        </div>
        <div className="p-0">
          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No audit events recorded yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">
                      [{log.action}] {log.entity}
                    </span>
                    <span className="text-sm text-slate-500 font-mono">ID: {log.entityId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-600">{new Date(log.timestamp).toLocaleString()}</span>
                    <div className="text-xs text-slate-400">By User: {log.changedBy}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Temporary imports since I didn't add all lucide icons in the main import above
import { Target, CheckSquare } from "lucide-react";
