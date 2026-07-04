import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const search = searchParams.get("search") || ""
  const categoryId = searchParams.get("categoryId") || ""

  const where: any = {}
  if (search) where.name = { contains: search, mode: "insensitive" }
  if (categoryId) where.categoryId = categoryId

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, variants: true, images: { take: 1 } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      brief: body.brief,
      categoryId: body.categoryId,
      brand: body.brand,
      isFeatured: body.isFeatured || false,
      isActive: body.isActive ?? true,
      images: {
        create: (body.images || []).map((url: string, i: number) => ({ url, order: i })),
      },
      variants: {
        create: (body.variants || []).map((v: any) => ({
          sku: v.sku,
          size: v.size,
          color: v.color,
          price: v.price,
          comparePrice: v.comparePrice,
          stock: v.stock || 0,
          images: v.images || [],
        })),
      },
    },
  })

  return NextResponse.json({ product }, { status: 201 })
}
