import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const products = await prisma.product.findMany({
    where: { isActive: true, categoryId: category.id },
    include: {
      variants: { select: { price: true }, take: 1 },
      images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: category.name,
      price: Number(p.variants[0]?.price ?? 0),
      image: p.images[0]?.url ?? "",
    })),
  })
}
