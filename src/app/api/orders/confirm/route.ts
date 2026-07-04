import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 })

    const order = await prisma.order.findUnique({ where: { confirmationToken: token } })

    if (!order) return NextResponse.json({ error: "Invalid confirmation link" }, { status: 404 })

    if (order.status === "CONFIRMED" || order.status === "PROCESSING" || order.status === "SHIPPED" || order.status === "DELIVERED") {
      return NextResponse.json({
        alreadyConfirmed: true,
        orderNumber: order.orderNumber,
        status: order.status,
      })
    }

    if (order.status === "CANCELLED" || order.status === "RETURNED") {
      return NextResponse.json({ error: "This order has been cancelled" }, { status: 400 })
    }

    // Confirm the order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    })

    return NextResponse.json({
      confirmed: true,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
    })
  } catch {
    return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 })
  }
}
