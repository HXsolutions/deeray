import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ products: [] })
  }

  const query = q.trim()

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { brief: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: {
      category: { select: { name: true } },
      variants: { select: { price: true, stock: true }, take: 1 },
      images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
    },
    take: 20,
  })

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      variants: p.variants,
      images: p.images.map((i) => i.url),
    })),
  })
}
