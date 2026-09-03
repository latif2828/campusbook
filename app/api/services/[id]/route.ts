import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// UPDATE SERVICE
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Find provider belonging to logged-in user
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

    // Make sure this service belongs to this provider
    const existingService = await prisma.service.findFirst({
      where: {
        id,
        providerId: provider.id,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    const service = await prisma.service.update({
      where: {
        id,
      },

      data: {
        name,
        price: Number(price),
        duration: Number(duration),
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("UPDATE SERVICE ERROR:", error);

    return NextResponse.json(
      { error: "Could not update service." },
      { status: 500 }
    );
  }
}


// DELETE SERVICE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const service = await prisma.service.findFirst({
      where: {
        id,
        providerId: provider.id,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE SERVICE ERROR:", error);

    return NextResponse.json(
      { error: "Could not delete service." },
      { status: 500 }
    );
  }
}