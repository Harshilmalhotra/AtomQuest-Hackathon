"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FeaturesToggle from "./FeaturesToggle";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // We check if the user has seen the onboarding before
    const hasSeen = localStorage.getItem("aligniq_onboarding_completed");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = (open: boolean) => {
    if (!open) {
      localStorage.setItem("aligniq_onboarding_completed", "true");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto sm:rounded-3xl p-0 border-none bg-slate-50">
        <div className="p-8 pb-4">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-slate-900">Welcome to AlignIQ! 🎉</DialogTitle>
            <DialogDescription className="text-lg text-slate-500 mt-2">
              Before you dive in, here is a quick tour of the platform features available to you and your team.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="px-8 pb-4">
          <FeaturesToggle />
        </div>
        
        <div className="p-8 pt-4 flex justify-end bg-white border-t border-slate-100">
          <Button onClick={() => handleClose(false)} size="lg" className="px-8 font-bold rounded-xl shadow-md bg-primary hover:bg-primary/90 text-white">
            Let's Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
