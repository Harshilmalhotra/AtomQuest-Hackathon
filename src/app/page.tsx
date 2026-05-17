import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-3xl text-center space-y-6 p-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          Welcome to <span className="text-primary">ATOMQUEST Portal</span>
        </h1>
        <p className="text-lg text-slate-600">
          The all-in-one platform for organizational goal setting, tracking, and quarterly check-ins.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/sign-in">
            <Button size="lg" className="px-8 font-semibold">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="lg" variant="outline" className="px-8 font-semibold">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
