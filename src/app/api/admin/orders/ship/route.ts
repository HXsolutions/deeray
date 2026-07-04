import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { sendShipmentUpdateEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { orderId, courierId } = body

  if (!orderId || !courierId) {
    return NextResponse.json({ error: "orderId and courierId required" }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

  const agent = await prisma.courierAgent.findUnique({ where: { id: courierId } })
  if (!agent) return NextResponse.json({ error: "Courier agent not found" }, { status: 404 })

  const trackingNumber = `MANUAL-${Date.now()}`

  await prisma.order.update({
    where: { id: orderId },
    data: { courierId, trackingNumber, status: "SHIPPED" },
  })

  sendShipmentUpdateEmail({
    to: order.customerEmail,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    trackingNumber,
    courierCompany: agent.company,
  })

  return NextResponse.json({ trackingNumber, estimatedDelivery: null })
}
