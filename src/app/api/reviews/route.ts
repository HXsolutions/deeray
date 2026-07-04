import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    const where: any = { isApproved: true }
    if (productId) where.productId = productId

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return NextResponse.json({ reviews })
  } catch {
    return NextResponse.json({ reviews: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, customerName, customerEmail, rating, title, comment } = body

    if (!productId || !customerName || !customerEmail || !rating) {
      return NextResponse.json({ error: "productId, customerName, customerEmail, and rating required" }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: { productId, customerName, customerEmail, rating, title, comment },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
