import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generatePropertyCode } from "@/lib/code-gen";
import { calculatePricePerM2 } from "@/lib/geo";
import { saveImage } from "@/lib/upload";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const properties = await prisma.property.findMany({
      include: {
        location: true,
        agent: { select: { id: true, name: true, email: true } },
        images: { orderBy: { order: "asc" } },
        priceHistory: {
          orderBy: { recordedAt: "asc" },
          take: 1, // just the first entry for list view
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("GET properties error:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const locationId = Number(formData.get("locationId"));
    const address = formData.get("address") as string;
    const boundary = formData.get("boundary") as string;
    const areaM2 = Number(formData.get("areaM2"));
    const costValue = Number(formData.get("costValue"));
    const costCurrency = (formData.get("costCurrency") as string) || "BRL";
    const contactName = formData.get("contactName") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const contactEmail = formData.get("contactEmail") as string;

    if (!locationId || !address || !boundary || !costValue) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    const code = await generatePropertyCode();
    const costPerM2 = calculatePricePerM2(costValue, areaM2);

    const property = await prisma.property.create({
      data: {
        code,
        locationId,
        address,
        boundary,
        areaM2,
        costValue,
        costCurrency,
        costPerM2,
        contactName,
        contactPhone,
        contactEmail,
        agentId: session.user.id,
        priceHistory: {
          create: {
            value: costValue,
            currency: costCurrency,
            changedBy: session.user.id,
          },
        },
      },
    });

    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[];
    const savedImages: { url: string; order: number }[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const result = await saveImage(imageFiles[i]);
      if (result.url) {
        savedImages.push({ url: result.url, order: i });
      }
    }

    if (savedImages.length > 0) {
      await prisma.propertyImage.createMany({
        data: savedImages.map((img) => ({
          ...img,
          propertyId: property.id,
        })),
      });
    }

    const propertyWithRelations = await prisma.property.findUnique({
      where: { id: property.id },
      include: {
        location: true,
        agent: { select: { id: true, name: true } },
        images: { orderBy: { order: "asc" } },
        priceHistory: { orderBy: { recordedAt: "asc" } },
      },
    });

    return NextResponse.json(propertyWithRelations, { status: 201 });
  } catch (error) {
    console.error("POST property error:", error);
    return NextResponse.json(
      { error: "Failed to create property." },
      { status: 500 },
    );
  }
}
