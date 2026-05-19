"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

export function CustomLogoutButton() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    // 1. Clear the local dev_session cookie
    document.cookie = "dev_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // 2. Sign out of the official Clerk session (if active)
    try {
      await signOut();
    } catch (e) {
      console.warn("Clerk sign out ignored", e);
    }
    
    // 3. Redirect to login
    window.location.href = "/sign-in";
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition-colors">
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
