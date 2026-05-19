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
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
