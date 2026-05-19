import { getAuth as auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { User as UserIcon, Mail, Briefcase, Key, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      manager: true
    }
  });

  if (!dbUser) {
    return (
      <div className="p-8 text-center text-slate-500">
        User profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-1 text-lg">Manage your personal information and view organizational hierarchy.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-primary to-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-8">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-md border-4 border-white flex items-center justify-center text-primary">
              <UserIcon className="w-12 h-12" />
            </div>
            <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full font-bold text-sm tracking-wide uppercase">
              {dbUser.role}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Personal Details</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-500">Full Name</div>
                  <div className="text-slate-900 font-medium">{dbUser.name || "Not specified"}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-500">Email Address</div>
                  <div className="text-slate-900 font-medium">{dbUser.email}</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Organizational Hierarchy</h3>
              
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-500 shrink-0 shadow-sm border border-slate-200">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-500">Reporting Manager</div>
                  <div className="text-indigo-900 font-bold text-lg">
                    {dbUser.manager ? (dbUser.manager.name || dbUser.manager.email) : "No Manager Assigned (Top Level)"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-500">Department</div>
                  <div className="text-slate-900 font-medium">{dbUser.department || "General"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Account Security</h3>
            <p className="text-sm text-slate-500">Manage your passwords and two-factor authentication via Clerk.</p>
          </div>
        </div>
        <Button variant="outline" className="font-semibold shadow-sm rounded-xl" disabled>
          Manage Security <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
