import { prisma } from "@/lib/prisma";

export async function generatePropertyCode(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `SC-${year}-`;

  const lastProperty = await prisma.property.findFirst({
    where: {
      code: {
        startsWith: prefix,
      },
    },
    orderBy: {
      code: "desc",
    },
  });

  if (!lastProperty) {
    return `${prefix}00001`;
  }

  const lastNumber = parseInt(lastProperty.code.split("-")[2], 10);
  const nextNumber = lastNumber + 1;
  return `${prefix}${String(nextNumber).padStart(5, "0")}`;
}
