import { getAuth as auth } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Target, LayoutDashboard, CheckSquare, BarChart } from "lucide-react";
import Link from "next/link";
import { CustomLogoutButton } from "@/components/CustomLogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  // Fetch real user from DB
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId ?? "" }
  });

  // If this is a real Clerk user, sync their actual name/email into the DB
  if (userId && !userId.startsWith("seed_")) {
    try {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const realEmail = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@example.com`;
        const realName = clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : null;
        
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              clerkId: userId,
              email: realEmail,
              name: realName,
              role: "EMPLOYEE",
            }
          });
        } else if (dbUser.email.startsWith("user_") || (!dbUser.name && realName)) {
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              email: realEmail,
              name: realName || dbUser.name
            }
          });
        }
      }
    } catch(e) {
      console.warn("Clerk user fetch failed", e);
    }
  }

  const displayRole = dbUser?.role ? `${dbUser.role} Role` : "Employee Role";
  const displayName = dbUser?.name || dbUser?.email || "My Account";

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col shadow-xl z-20">
        <div className="h-20 flex items-center px-8 font-extrabold text-2xl tracking-tight text-sidebar-foreground border-b border-sidebar-border">
          <Target className="w-8 h-8 mr-3 text-sidebar-primary" />
          ATOMQUEST
        </div>
        
        <div className="px-6 py-6 flex-1 overflow-y-auto">
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
              My Check-ins
            </Link>
            <Link href="/team-checkins" className="flex items-center px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
              <CheckSquare className="w-5 h-5 mr-3 opacity-70" />
              Team Check-ins
            </Link>
            <Link href="/reports" className="flex items-center px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
              <BarChart className="w-5 h-5 mr-3 opacity-70" />
              Analytics & Reports
            </Link>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-sidebar-border">
          <Link href="/profile" className="flex items-center px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
            <svg className="w-5 h-5 mr-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            My Profile
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-end px-10 shadow-sm z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-700">{displayName}</div>
                <div className="text-xs font-bold text-primary">{displayRole}</div>
              </div>
              <div className="ml-4 pl-4 border-l border-slate-200">
                <CustomLogoutButton />
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
