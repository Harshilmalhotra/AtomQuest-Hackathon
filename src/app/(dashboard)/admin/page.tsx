import { getAuth as auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    return (
      <div className="p-8 text-center text-slate-500">
        Access Denied. Only Admins can view this page.
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      manager: true
    }
  });

  // Get all potential managers (Admins or Managers)
  const managers = users.filter(u => u.role === "ADMIN" || u.role === "MANAGER");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Panel</h1>
        <p className="text-slate-500 mt-1 text-lg">Manage user roles and reporting hierarchies.</p>
      </div>

      <AdminClient initialUsers={users} managers={managers} />
    </div>
  );
}
