"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomLogoutButton() {
  const handleLogout = async () => {
    // Clear the dev_session cookie by calling our API or setting it expired
    document.cookie = "dev_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/sign-in";
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition-colors">
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
