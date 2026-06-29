import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { calculatePricePerM2 } from "@/lib/geo";
import { saveImage } from "@/lib/upload";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        location: true,
        agent: { select: { id: true, name: true } },
        images: { orderBy: { order: "asc" } },
        priceHistory: { orderBy: { recordedAt: "asc" } },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("GET property error:", error);
    return NextResponse.json(
      { error: "Failed to fetch property." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return NextResponse.json(
        { error: "Property not found." },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const costValue = Number(formData.get("costValue"));
    const costCurrency = (formData.get("costCurrency") as string) || "BRL";
    const areaM2 = Number(formData.get("areaM2"));
    const costPerM2 = calculatePricePerM2(costValue, areaM2);

    const updateData: Record<string, unknown> = {
      locationId: Number(formData.get("locationId")),
      address: formData.get("address") as string,
      boundary: formData.get("boundary") as string,
      areaM2,
      costValue,
      costCurrency,
      costPerM2,
      contactName: formData.get("contactName") as string,
      contactPhone: formData.get("contactPhone") as string,
      contactEmail: formData.get("contactEmail") as string,
    };

    // Track price change
    if (costValue !== property.costValue) {
      await prisma.priceHistory.create({
        data: {
          propertyId: id,
          value: costValue,
          currency: costCurrency,
          changedBy: session.user.id,
        },
      });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        location: true,
        agent: { select: { id: true, name: true } },
        images: { orderBy: { order: "asc" } },
        priceHistory: { orderBy: { recordedAt: "asc" } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT property error:", error);
    return NextResponse.json(
      { error: "Failed to update property." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.property.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE property error:", error);
    return NextResponse.json(
      { error: "Failed to delete property." },
      { status: 500 },
    );
  }
}
