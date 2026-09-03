import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET PROVIDER SERVICES
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

    const services = await prisma.service.findMany({
      where: {
        providerId: provider.id,
      },

      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      provider,
      services,
    });
  } catch (error) {
    console.error("GET SERVICES ERROR:", error);

    return NextResponse.json(
      { error: "Could not load services." },
      { status: 500 }
    );
  }
}

// CREATE SERVICE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      name,
      price,
      duration,
    } = body;

    if (!userId || !name || !price || !duration) {
      return NextResponse.json(
        { error: "Please complete all fields." },
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

    const service = await prisma.service.create({
      data: {
        name,
        price: Number(price),
        duration: Number(duration),
        providerId: provider.id,
      },
    });

    return NextResponse.json(
      service,
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE SERVICE ERROR:", error);

    return NextResponse.json(
      { error: "Could not create service." },
      { status: 500 }
    );
  }
}