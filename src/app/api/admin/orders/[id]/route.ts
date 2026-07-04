import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { sendOrderCancellationEmail } from "@/lib/email"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { name: true } }, variant: true } } },
  })
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ order })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await request.json()

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
      paymentStatus: body.paymentStatus,
      trackingNumber: body.trackingNumber,
      courierId: body.courierId || null,
      notes: body.notes,
    },
  })

  return NextResponse.json({ order })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const { searchParams } = new URL(request.url)
  const reason = searchParams.get("reason") || ""

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

  for (const item of order.items) {
    const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } })
    if (variant) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      })
      await prisma.stockMovement.create({
        data: {
          variantId: item.variantId,
          type: "RETURN",
          quantity: item.quantity,
          note: reason
            ? `Cancelled — Order #${order.orderNumber}: ${reason}`
            : `Cancelled — Order #${order.orderNumber}`,
          orderId: id,
        },
      })
    }
  }

  const newNotes = reason
    ? (order.notes ? `${order.notes}\nCancellation: ${reason}` : `Cancellation: ${reason}`)
    : order.notes

  await prisma.order.update({
    where: { id },
    data: { status: "CANCELLED", notes: newNotes },
  })

  if (reason) {
    sendOrderCancellationEmail({
      to: order.customerEmail,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      reason,
    })
  }

  return NextResponse.json({ success: true })
}
