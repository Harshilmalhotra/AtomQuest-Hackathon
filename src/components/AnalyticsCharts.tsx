"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#e2e8f0', '#3b82f6', '#22c55e']; // Slate (Not Started), Blue (On Track), Green (Completed)

export function AnalyticsCharts({ goals }: { goals: any[] }) {
  // 1. Process Status Data
  const statusCounts = {
    "NOT_STARTED": 0,
    "ON_TRACK": 0,
    "COMPLETED": 0
  };

  goals.forEach(goal => {
    // Determine status from check-ins or default to NOT_STARTED
    const status = goal.checkIns?.[0]?.status || "NOT_STARTED";
    if (statusCounts[status as keyof typeof statusCounts] !== undefined) {
      statusCounts[status as keyof typeof statusCounts]++;
    }
  });

  const pieData = [
    { name: 'Not Started', value: statusCounts["NOT_STARTED"] },
    { name: 'On Track', value: statusCounts["ON_TRACK"] },
    { name: 'Completed', value: statusCounts["COMPLETED"] },
  ];

  // 2. Process Thrust Area Data
  const thrustMap: Record<string, { total: number, completed: number }> = {};
  goals.forEach(goal => {
    const area = goal.thrustArea || "Other";
    if (!thrustMap[area]) thrustMap[area] = { total: 0, completed: 0 };
    thrustMap[area].total++;
    
    if (goal.checkIns?.[0]?.status === "COMPLETED") {
      thrustMap[area].completed++;
    }
  });

  const barData = Object.keys(thrustMap).map(key => ({
    name: key.length > 15 ? key.substring(0, 15) + "..." : key,
    Total: thrustMap[key].total,
    Completed: thrustMap[key].completed
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8">
      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Goal Status Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Goals`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Execution by Thrust Area</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Legend />
              <Bar dataKey="Total" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
