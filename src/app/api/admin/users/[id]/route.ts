import { NextRequest, NextResponse } from "next/server";
import { getAuth as auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbAdmin = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!dbAdmin || dbAdmin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates = await req.json();

  const paramsData = await params;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: paramsData.id },
      data: {
        role: updates.role,
        managerId: updates.managerId,
      },
      include: { manager: true }
    });

    if (updates.managerId) {
      await prisma.notification.create({
        data: {
          userId: updatedUser.id,
          title: "Manager Assigned",
          message: `You have been assigned to reporting manager: ${updatedUser.manager?.name || updatedUser.manager?.email}.`,
          type: "MANAGER_ASSIGNED"
        }
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
