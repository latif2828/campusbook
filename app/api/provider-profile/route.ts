import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      business,
      category,
      location,
    } = body;

    if (
      !userId ||
      !business ||
      !category ||
      !location
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

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (user.role !== "PROVIDER") {
      return NextResponse.json(
        {
          error: "Only provider accounts can create a business profile.",
        },
        {
          status: 403,
        }
      );
    }

    const existingProvider =
      await prisma.provider.findFirst({
        where: {
          userId,
        },
      });

    if (existingProvider) {
      return NextResponse.json(
        {
          error: "You already have a provider profile.",
        },
        {
          status: 400,
        }
      );
    }

    const provider = await prisma.provider.create({
      data: {
        business,
        category,
        location,
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
        error: "Could not create provider profile.",
      },
      {
        status: 500,
      }
    );
  }
}