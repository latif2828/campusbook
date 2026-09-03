import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET PROVIDER AVAILABILITY
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.findFirst({
      where: {
        userId,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider profile not found." },
        { status: 404 }
      );
    }

    const availabilities =
      await prisma.availability.findMany({
        where: {
          providerId: provider.id,
        },
      });

    return NextResponse.json({
      provider,
      availabilities,
    });
  } catch (error) {
    console.error("GET AVAILABILITY ERROR:", error);

    return NextResponse.json(
      { error: "Could not load availability." },
      { status: 500 }
    );
  }
}

// SAVE PROVIDER AVAILABILITY
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, availabilities } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.findFirst({
      where: {
        userId,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider profile not found." },
        { status: 404 }
      );
    }

    if (!Array.isArray(availabilities)) {
      return NextResponse.json(
        { error: "Invalid availability data." },
        { status: 400 }
      );
    }

    // Check times
    for (const item of availabilities) {
      if (
        !item.day ||
        !item.startTime ||
        !item.endTime
      ) {
        return NextResponse.json(
          { error: "Invalid availability information." },
          { status: 400 }
        );
      }

      if (item.startTime >= item.endTime) {
        return NextResponse.json(
          {
            error: `${item.day}: opening time must be before closing time.`,
          },
          { status: 400 }
        );
      }
    }

    // Remove old availability
    await prisma.availability.deleteMany({
      where: {
        providerId: provider.id,
      },
    });

    // Save new availability
    if (availabilities.length > 0) {
      await prisma.availability.createMany({
        data: availabilities.map(
          (item: {
            day: string;
            startTime: string;
            endTime: string;
          }) => ({
            day: item.day,
            startTime: item.startTime,
            endTime: item.endTime,
            providerId: provider.id,
          })
        ),
      });
    }

    const savedAvailability =
      await prisma.availability.findMany({
        where: {
          providerId: provider.id,
        },
      });

    return NextResponse.json({
      message: "Availability saved successfully.",
      availabilities: savedAvailability,
    });
  } catch (error) {
    console.error("SAVE AVAILABILITY ERROR:", error);

    return NextResponse.json(
      { error: "Could not save availability." },
      { status: 500 }
    );
  }
}