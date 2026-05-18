"use client";

import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const demoLogin = async (role: "admin" | "manager" | "employee") => {
    setLoading(role);
    try {
      // These map to the clerkIds defined in your prisma/seed.ts script
      const clerkIds = {
        admin: "seed_admin_1",
        manager: "seed_manager_1",
        employee: "seed_employee_1"
      };

      const res = await fetch("/api/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: clerkIds[role] }),
      });

      if (res.ok) {
        // Force hard refresh to ensure middleware and new session state loads
        window.location.href = "/dashboard";
      } else {
        alert("Demo login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error during demo login");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-md mb-8 bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-amber-900 mb-4 text-center">Hackathon Demo Quick Login</h3>
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => demoLogin("admin")} 
            disabled={loading !== null}
            className="w-full bg-slate-800 hover:bg-slate-900"
          >
            {loading === "admin" ? "Logging in..." : "Login as Admin"}
          </Button>
          <Button 
            onClick={() => demoLogin("manager")} 
            disabled={loading !== null}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading === "manager" ? "Logging in..." : "Login as Manager"}
          </Button>
          <Button 
            onClick={() => demoLogin("employee")} 
            disabled={loading !== null}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/5"
          >
            {loading === "employee" ? "Logging in..." : "Login as Employee"}
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md flex items-center gap-4 mb-8">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-sm font-semibold text-slate-400">OR USE SECURE LOGIN</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <SignIn />
    </div>
  );
}
