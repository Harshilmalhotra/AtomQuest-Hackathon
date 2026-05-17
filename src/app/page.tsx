import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Target, CheckCircle, BarChart3 } from "lucide-react";

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-foreground">
      {/* Navigation */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-slate-900">
          <Target className="w-8 h-8 text-primary" />
          ATOMQUEST <span className="font-light text-slate-500 hidden sm:inline">Portal</span>
        </div>
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="font-semibold text-slate-600 hover:text-slate-900">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="max-w-4xl text-center space-y-8">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
            Align Your Team.<br/>
            <span className="text-primary">Achieve Your Goals.</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The enterprise-grade platform for setting clear objectives, tracking quarterly achievements, and driving continuous performance.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                Enter Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Goal Alignment</h3>
            <p className="text-slate-600">Create structured goals with precise weightages and connect them to organizational priorities.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Quarterly Check-ins</h3>
            <p className="text-slate-600">Seamlessly log actual achievements against planned targets with automatic scoring.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Real-time Visibility</h3>
            <p className="text-slate-600">Managers gain instant oversight into team progress with comprehensive dashboards.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
