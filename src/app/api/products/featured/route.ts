import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      category: { select: { name: true } },
      variants: { select: { price: true }, take: 1 },
      images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
    },
    take: 8,
  })

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.name,
      price: Number(p.variants[0]?.price ?? 0),
      image: p.images[0]?.url ?? "",
    })),
  })
}
