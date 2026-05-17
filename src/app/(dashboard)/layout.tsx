import { UserButton } from "@clerk/nextjs";
import { Target, LayoutDashboard, CheckSquare, BarChart, Settings, Bell, Search } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col shadow-xl z-20">
        <div className="h-20 flex items-center px-8 font-extrabold text-2xl tracking-tight text-sidebar-foreground border-b border-sidebar-border">
          <Target className="w-8 h-8 mr-3 text-sidebar-primary" />
          ATOMQUEST
        </div>
        
        <div className="px-6 py-6">
          <div className="text-xs font-bold text-sidebar-foreground/50 uppercase tracking-wider mb-4 px-2">Main Menu</div>
          <nav className="space-y-1.5">
            <Link href="/dashboard" className="flex items-center px-4 py-3 rounded-xl bg-sidebar-accent text-sidebar-accent-foreground font-semibold transition-all">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link href="/goals" className="flex items-center px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
              <Target className="w-5 h-5 mr-3 opacity-70" />
              Goal Sheets
            </Link>
            <Link href="/approvals" className="flex items-center px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
              <CheckSquare className="w-5 h-5 mr-3 opacity-70" />
              Team Approvals
            </Link>
            <Link href="/shared-goals" className="flex items-center px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
              <Target className="w-5 h-5 mr-3 opacity-70" />
              Shared KPIs
            </Link>
            <Link href="/check-ins" className="flex items-center px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
              <CheckSquare className="w-5 h-5 mr-3 opacity-70" />
              Quarterly Check-ins
            </Link>
            <Link href="/reports" className="flex items-center px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
              <BarChart className="w-5 h-5 mr-3 opacity-70" />
              Analytics & Reports
            </Link>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-sidebar-border">
          <Link href="/settings" className="flex items-center px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
            <Settings className="w-5 h-5 mr-3 opacity-70" />
            Portal Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 shadow-sm z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search goals, users, or reports..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-700">My Account</div>
                <div className="text-xs text-slate-500">Employee Role</div>
              </div>
              <div className="ring-2 ring-slate-100 rounded-full">
                <UserButton afterSignOutUrl="/" appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }} />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
