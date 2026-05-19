"use client";

import { useState } from "react";
import { Shield, Users, User, CheckCircle2, Target, BarChart3, Settings, PenTool, GitMerge, Bell } from "lucide-react";

export default function FeaturesToggle() {
  const [activeTab, setActiveTab] = useState<"ADMIN" | "MANAGER" | "EMPLOYEE">("EMPLOYEE");

  return (
    <div className="mt-12 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 p-4 pb-0">
        <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">Platform Capabilities & Roles</h2>
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("EMPLOYEE")}
            className={`px-6 py-3 font-semibold text-sm rounded-t-xl transition-colors border-b-2 ${
              activeTab === "EMPLOYEE"
                ? "border-primary text-primary bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Employee Features
            </div>
          </button>
          <button
            onClick={() => setActiveTab("MANAGER")}
            className={`px-6 py-3 font-semibold text-sm rounded-t-xl transition-colors border-b-2 ${
              activeTab === "MANAGER"
                ? "border-primary text-primary bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Manager Features
            </div>
          </button>
          <button
            onClick={() => setActiveTab("ADMIN")}
            className={`px-6 py-3 font-semibold text-sm rounded-t-xl transition-colors border-b-2 ${
              activeTab === "ADMIN"
                ? "border-primary text-primary bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Admin Features
            </div>
          </button>
        </div>
      </div>

      <div className="p-8">
        {activeTab === "EMPLOYEE" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard 
                icon={<Target />} 
                title="Goal Setting & AI Assistance" 
                desc="Draft personal and professional goals. Use the Magic AI Auto-Filler to parse messy text, or click 'Polish with AI' to instantly format drafts into SMART goals." 
              />
              <FeatureCard 
                icon={<CheckCircle2 />} 
                title="Quarterly Check-ins" 
                desc="Log your actual achievements against planned targets every quarter. The system automatically calculates your performance score." 
              />
              <FeatureCard 
                icon={<GitMerge />} 
                title="Shared Alignments" 
                desc="Receive Top-Down KPIs directly from your manager. These shared goals integrate seamlessly into your goal sheet and are locked from editing." 
              />
              <FeatureCard 
                icon={<BarChart3 />} 
                title="Personal Dashboard" 
                desc="Track your individual progress, view completed check-ins, and monitor your average system scores over time." 
              />
              <FeatureCard 
                icon={<Bell />} 
                title="Real-Time Alerts & Desktop Push" 
                desc="Get notified instantly with audio chimes and native desktop notifications when your manager is assigned or your goal sheets are approved/returned." 
              />
            </div>
          </div>
        )}

        {activeTab === "MANAGER" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard 
                icon={<GitMerge />} 
                title="Top-Down Shared KPIs" 
                desc="Inject specific organizational goals directly into your team's draft sheets to enforce strict alignment and standardized objectives." 
              />
              <FeatureCard 
                icon={<PenTool />} 
                title="Team Approvals" 
                desc="Review goal sheets submitted by your direct reports. You have the power to edit them inline, approve them, or return them with mandatory remarks." 
              />
              <FeatureCard 
                icon={<CheckCircle2 />} 
                title="Review Check-ins" 
                desc="Validate actual achievements submitted by your team during quarterly reviews and provide vital managerial feedback." 
              />
              <FeatureCard 
                icon={<BarChart3 />} 
                title="Team Analytics" 
                desc="Gain instant visibility into your team's overall progress with real-time charts and demographic reporting." 
              />
              <FeatureCard 
                icon={<Bell />} 
                title="Subordinate Action Alerts" 
                desc="Receive instant desktop pushes and sound chime notifications whenever an employee submits a goal sheet for your review." 
              />
            </div>
          </div>
        )}

        {activeTab === "ADMIN" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard 
                icon={<Users />} 
                title="Role & Hierarchy Management" 
                desc="Access the Admin Panel to dynamically elevate employees to Managers/Admins, and assign strict reporting structures across the company." 
              />
              <FeatureCard 
                icon={<BarChart3 />} 
                title="Global Oversight" 
                desc="View organization-wide goal sheets, approval statuses, and overarching analytic dashboards." 
              />
              <FeatureCard 
                icon={<Settings />} 
                title="System Administration" 
                desc="Maintain database integrity, manage global system parameters, and handle demo/test login bypasses." 
              />
              <FeatureCard 
                icon={<Shield />} 
                title="Audit Trails" 
                desc="Track every critical action taken by managers and employees to ensure HR governance and complete transparency." 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors">
      <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary shrink-0 shadow-sm">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-lg mb-1">{title}</h4>
        <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
