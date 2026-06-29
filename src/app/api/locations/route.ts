import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");

  try {
    if (state) {
      const cities = await prisma.location.findMany({
        where: { state },
        select: { id: true, city: true },
        distinct: ["city"],
        orderBy: { city: "asc" },
      });
      return NextResponse.json(cities);
    }

    // Return distinct states (for dropdown 2)
    const states = await prisma.location.findMany({
      select: { state: true },
      distinct: ["state"],
      orderBy: { state: "asc" },
    });
    return NextResponse.json(states.map((s) => s.state));
  } catch (error) {
    console.error("Locations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations." },
      { status: 500 },
    );
  }
}
