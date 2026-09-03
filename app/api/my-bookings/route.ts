import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 }
      );
    }

    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        studentId,
      },

      include: {
        provider: true,
        service: true,
      },

      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("MY BOOKINGS ERROR:", error);

    return NextResponse.json(
      { error: "Could not load your bookings." },
      { status: 500 }
    );
  }
}