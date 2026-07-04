import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const inventories = await prisma.productVariant.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { stock: "asc" },
  })

  return NextResponse.json({ inventories })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()

  const { variantId, type, quantity, note } = body

  const movement = await prisma.stockMovement.create({
    data: { variantId, type, quantity, note },
  })

  const updated = await prisma.productVariant.update({
    where: { id: variantId },
    data: { stock: { increment: type === "IN" ? quantity : -quantity } },
  })

  // Auto-create/resolve low-stock alert (threshold = 10)
  if (updated.stock <= 10) {
    const existing = await prisma.lowStockAlert.findFirst({
      where: { variantId, resolvedAt: null },
    })
    if (!existing) {
      await prisma.lowStockAlert.create({
        data: { variantId, threshold: 10, stockAtAlert: updated.stock },
      })
    }
  } else {
    await prisma.lowStockAlert.updateMany({
      where: { variantId, resolvedAt: null },
      data: { resolvedAt: new Date() },
    })
  }

  return NextResponse.json({ movement })
}
