import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type BookingWithService = {
  date: Date;

  service: {
    duration: number;
  };
};

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    mins
  ).padStart(2, "0")}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const providerId = searchParams.get("providerId");
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");

    // CHECK REQUIRED DATA
    if (!providerId || !serviceId || !date) {
      return NextResponse.json(
        {
          error:
            "Provider, service and date are required.",
        },
        {
          status: 400,
        }
      );
    }

    // CHECK SELECTED SERVICE
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        providerId,
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          error: "Service not found.",
        },
        {
          status: 404,
        }
      );
    }

    // CONVERT DATE TO DAY NAME
    // Example: 2026-09-07 -> Monday
    const selectedDate = new Date(
      `${date}T12:00:00`
    );

    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid date.",
        },
        {
          status: 400,
        }
      );
    }

    const dayName =
      selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

    // FIND PROVIDER AVAILABILITY FOR THIS DAY
    const availability =
      await prisma.availability.findFirst({
        where: {
          providerId,
          day: dayName,
        },
      });

    // PROVIDER IS CLOSED
    if (!availability) {
      return NextResponse.json({
        day: dayName,
        slots: [],
        message: "Provider is closed on this day.",
      });
    }

    // START AND END OF SELECTED DATE
    const dayStart = new Date(
      `${date}T00:00:00`
    );

    const dayEnd = new Date(
      `${date}T23:59:59.999`
    );

    // FIND EXISTING BOOKINGS
    const bookings = (await prisma.booking.findMany({
      where: {
        providerId,

        date: {
          gte: dayStart,
          lte: dayEnd,
        },

        // Cancelled bookings do not block a time slot
        status: {
          not: "CANCELLED",
        },
      },

      include: {
        service: true,
      },
    })) as BookingWithService[];

    // PROVIDER WORKING HOURS
    const openingTime = timeToMinutes(
      availability.startTime
    );

    const closingTime = timeToMinutes(
      availability.endTime
    );

    // SELECTED SERVICE DURATION
    const serviceDuration = service.duration;

    const slots: string[] = [];

    // CREATE SLOTS EVERY 30 MINUTES
    for (
      let current = openingTime;
      current + serviceDuration <= closingTime;
      current += 30
    ) {
      const slotTime = minutesToTime(current);

      const slotStart = new Date(
        `${date}T${slotTime}:00`
      );

      const slotEnd = new Date(
        slotStart.getTime() +
          serviceDuration * 60 * 1000
      );

      // CHECK IF SLOT OVERLAPS AN EXISTING BOOKING
      const conflicts = bookings.some(
        (booking: BookingWithService) => {
          const bookingStart = new Date(
            booking.date
          );

          const bookingEnd = new Date(
            bookingStart.getTime() +
              booking.service.duration *
                60 *
                1000
          );

          return (
            slotStart < bookingEnd &&
            slotEnd > bookingStart
          );
        }
      );

      // DON'T SHOW PAST TIMES
      const isPast = slotStart <= new Date();

      // ADD AVAILABLE SLOT
      if (!conflicts && !isPast) {
        slots.push(slotTime);
      }
    }

    return NextResponse.json({
      day: dayName,

      startTime: availability.startTime,

      endTime: availability.endTime,

      serviceDuration,

      slots,
    });
  } catch (error) {
    console.error(
      "AVAILABLE SLOTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Could not load available times.",
      },
      {
        status: 500,
      }
    );
  }
}