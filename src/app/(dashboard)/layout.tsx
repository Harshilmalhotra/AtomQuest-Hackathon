import { UserButton } from "@clerk/nextjs";
import { Target, LayoutDashboard, CheckSquare, BarChart, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-slate-800">
          <Target className="w-6 h-6 mr-2 text-blue-400" />
          ATOMQUEST
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-3">
          <Link href="/dashboard" className="flex items-center px-3 py-2.5 rounded-md hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3 text-slate-400" />
            Dashboard
          </Link>
          <Link href="/goals" className="flex items-center px-3 py-2.5 rounded-md hover:bg-slate-800 transition-colors">
            <Target className="w-5 h-5 mr-3 text-slate-400" />
            My Goals
          </Link>
          <Link href="/check-ins" className="flex items-center px-3 py-2.5 rounded-md hover:bg-slate-800 transition-colors">
            <CheckSquare className="w-5 h-5 mr-3 text-slate-400" />
            Check-ins
          </Link>
          <Link href="/reports" className="flex items-center px-3 py-2.5 rounded-md hover:bg-slate-800 transition-colors">
            <BarChart className="w-5 h-5 mr-3 text-slate-400" />
            Reports
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <Link href="/settings" className="flex items-center px-3 py-2.5 rounded-md hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5 mr-3 text-slate-400" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="font-medium text-slate-600">
            Phase 1: Goal Creation & Approval
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 hidden sm:block">
              Logged in
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
