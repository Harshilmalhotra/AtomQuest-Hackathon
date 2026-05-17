import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { managerComment } = body;

    if (!managerComment) {
      return new NextResponse("Comment is required", { status: 400 });
    }

    const updatedCheckIn = await prisma.checkIn.update({
      where: { id },
      data: {
        managerComment,
      },
    });

    return NextResponse.json(updatedCheckIn, { status: 200 });

  } catch (error) {
    console.error("[CHECK_IN_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
