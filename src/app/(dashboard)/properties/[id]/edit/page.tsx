import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyForm from "@/components/property/PropertyForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!property) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Edit Property</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Code: {property.code}
      </p>
      <div className="bg-white rounded-xl border p-6">
        <PropertyForm
          isEditing
          initialData={{
            id: property.id,
            locationId: property.locationId,
            address: property.address,
            boundary: property.boundary,
            areaM2: property.areaM2,
            costValue: property.costValue,
            costCurrency: property.costCurrency,
            contactName: property.contactName,
            contactPhone: property.contactPhone,
            contactEmail: property.contactEmail,
            images: property.images.map((i) => ({ url: i.url })),
          }}
        />
      </div>
    </div>
  );
}
