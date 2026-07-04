import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true, images: { orderBy: { order: "asc" } }, tags: true },
  })
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ product })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await request.json()

  await prisma.productImage.deleteMany({ where: { productId: id } })
  await prisma.productVariant.deleteMany({ where: { productId: id } })

  const product = await prisma.product.update({
    where: { id },
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

  return NextResponse.json({ product })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await request.json()

  const product = await prisma.product.update({
    where: { id },
    data: { isFeatured: body.isFeatured },
  })

  return NextResponse.json({ product })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  await prisma.productImage.deleteMany({ where: { productId: id } })
  await prisma.productVariant.deleteMany({ where: { productId: id } })
  await prisma.review.deleteMany({ where: { productId: id } })
  await prisma.orderItem.deleteMany({ where: { productId: id } })
  await prisma.product.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
