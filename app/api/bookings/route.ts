import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type BookingWithService = {
  id: string;
  date: Date;
  status: string;

  service: {
    duration: number;
  };
};

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

// CREATE BOOKING
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      studentId,
      providerId,
      serviceId,
      date,
      time,
    } = body;

    // Check required fields
    if (
      !studentId ||
      !providerId ||
      !serviceId ||
      !date ||
      !time
    ) {
      return NextResponse.json(
        {
          error: "Please provide all booking details.",
        },
        {
          status: 400,
        }
      );
    }

    // Check student
    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          error: "Student not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (student.role !== "STUDENT") {
      return NextResponse.json(
        {
          error: "Only students can make bookings.",
        },
        {
          status: 403,
        }
      );
    }

    // Check provider
    const provider = await prisma.provider.findUnique({
      where: {
        id: providerId,
      },
    });

    if (!provider) {
      return NextResponse.json(
        {
          error: "Provider not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Check selected service belongs to provider
    const selectedService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        providerId,
      },
    });

    if (!selectedService) {
      return NextResponse.json(
        {
          error: "Service not found for this provider.",
        },
        {
          status: 404,
        }
      );
    }

    // Create booking date/time
    const bookingDate = new Date(
      `${date}T${time}:00`
    );

    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid booking date or time.",
        },
        {
          status: 400,
        }
      );
    }

    // Prevent booking in the past
    if (bookingDate <= new Date()) {
      return NextResponse.json(
        {
          error:
            "You cannot book an appointment in the past.",
        },
        {
          status: 400,
        }
      );
    }

    // Get selected day name
    const dayName =
      bookingDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

    // Check provider availability
    const availability =
      await prisma.availability.findFirst({
        where: {
          providerId,
          day: dayName,
        },
      });

    if (!availability) {
      return NextResponse.json(
        {
          error:
            "Provider is not available on this day.",
        },
        {
          status: 400,
        }
      );
    }

    // Check appointment is inside working hours
    const appointmentStart =
      timeToMinutes(time);

    const appointmentEnd =
      appointmentStart +
      selectedService.duration;

    const providerStart =
      timeToMinutes(
        availability.startTime
      );

    const providerEnd =
      timeToMinutes(
        availability.endTime
      );

    if (
      appointmentStart < providerStart ||
      appointmentEnd > providerEnd
    ) {
      return NextResponse.json(
        {
          error:
            "This appointment is outside the provider's working hours.",
        },
        {
          status: 400,
        }
      );
    }

    // Get bookings for selected date
    const dayStart = new Date(
      `${date}T00:00:00`
    );

    const dayEnd = new Date(
      `${date}T23:59:59.999`
    );

    const existingBookings =
      (await prisma.booking.findMany({
        where: {
          providerId,

          date: {
            gte: dayStart,
            lte: dayEnd,
          },

          // Pending and confirmed bookings block slots.
          // Cancelled bookings do not.
          status: {
            not: "CANCELLED",
          },
        },

        include: {
          service: true,
        },
      })) as BookingWithService[];

    // Check overlapping appointments
    const newBookingStart = bookingDate;

    const newBookingEnd = new Date(
      newBookingStart.getTime() +
        selectedService.duration *
          60 *
          1000
    );

    const hasConflict =
      existingBookings.some(
        (booking: BookingWithService) => {
          const existingStart =
            new Date(booking.date);

          const existingEnd =
            new Date(
              existingStart.getTime() +
                booking.service.duration *
                  60 *
                  1000
            );

          return (
            newBookingStart < existingEnd &&
            newBookingEnd > existingStart
          );
        }
      );

    if (hasConflict) {
      return NextResponse.json(
        {
          error:
            "This time is no longer available. Please choose another time.",
        },
        {
          status: 409,
        }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        date: bookingDate,

        // NEW BOOKINGS START AS PENDING
        status: "PENDING",

        studentId,
        providerId,
        serviceId: selectedService.id,
      },

      include: {
        student: true,
        provider: true,
        service: true,
      },
    });

    return NextResponse.json(
      booking,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Booking failed.",
      },
      {
        status: 500,
      }
    );
  }
}

// GET PROVIDER BOOKINGS
export async function GET(req: Request) {
  try {
    const { searchParams } =
      new URL(req.url);

    const userId =
      searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Find provider belonging to logged-in user
    const provider =
      await prisma.provider.findFirst({
        where: {
          userId,
        },
      });

    if (!provider) {
      return NextResponse.json(
        {
          error: "Provider profile not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Get only this provider's bookings
    const bookings =
      await prisma.booking.findMany({
        where: {
          providerId: provider.id,
        },

        include: {
          student: true,
          provider: true,
          service: true,
        },

        orderBy: {
          date: "asc",
        },
      });

    return NextResponse.json({
      provider,
      bookings,
    });
  } catch (error) {
    console.error(
      "GET BOOKINGS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Could not load bookings.",
      },
      {
        status: 500,
      }
    );
  }
}