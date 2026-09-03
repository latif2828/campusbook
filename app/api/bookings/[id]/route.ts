import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { status } = body;

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid booking status.",
        },
        {
          status: 400,
        }
      );
    }

    const existingBooking =
      await prisma.booking.findUnique({
        where: {
          id,
        },
      });

    if (!existingBooking) {
      return NextResponse.json(
        {
          error: "Booking not found.",
        },
        {
          status: 404,
        }
      );
    }

    const booking =
      await prisma.booking.update({
        where: {
          id,
        },

        data: {
          status,
        },

        include: {
          student: true,
          provider: true,
          service: true,
        },
      });

    return NextResponse.json(booking);
  } catch (error) {
    console.error(
      "UPDATE BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Could not update booking.",
      },
      {
        status: 500,
      }
    );
  }
}