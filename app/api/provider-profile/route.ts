import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ==========================================
// CREATE PROVIDER PROFILE
// ==========================================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      business,
      category,
      location,
      phone,
    } = body;

    if (
      !userId ||
      !business ||
      !category ||
      !location ||
      !phone
    ) {
      return NextResponse.json(
        {
          error: "Please complete all fields.",
        },
        {
          status: 400,
        }
      );
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User account not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Make sure user is a provider
    if (user.role !== "PROVIDER") {
      return NextResponse.json(
        {
          error:
            "Only provider accounts can create a business profile.",
        },
        {
          status: 403,
        }
      );
    }

    // Check if provider profile already exists
    const existingProvider =
      await prisma.provider.findFirst({
        where: {
          userId,
        },
      });

    if (existingProvider) {
      return NextResponse.json(
        {
          error:
            "A provider profile already exists for this account.",
        },
        {
          status: 400,
        }
      );
    }

    // Create provider profile
    const provider = await prisma.provider.create({
      data: {
        business: business.trim(),
        category: category.trim(),
        location: location.trim(),
        phone: phone.trim(),

        description: `${business.trim()} provides ${category.trim()} services at ${location.trim()}.`,

        userId,
      },
    });

    return NextResponse.json(
      provider,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE PROVIDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not create provider profile.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// CHECK IF PROVIDER PROFILE EXISTS
// ==========================================

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

    const provider =
      await prisma.provider.findFirst({
        where: {
          userId,
        },
      });

    return NextResponse.json({
      hasProfile: !!provider,
      provider,
    });
  } catch (error) {
    console.error(
      "GET PROVIDER PROFILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not check provider profile.",
      },
      {
        status: 500,
      }
    );
  }
}