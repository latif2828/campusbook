import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const provider = await prisma.provider.findUnique({
      where: {
        id,
      },

      include: {
        services: true,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("PROVIDER ERROR:", error);

    return NextResponse.json(
      { error: "Could not load provider." },
      { status: 500 }
    );
  }
}