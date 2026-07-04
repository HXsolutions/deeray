import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get("orderNumber")
    const email = searchParams.get("email")

    if (!orderNumber || !email) {
      return NextResponse.json({ error: "Order number and email required" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        orderNumber: true,
        customerName: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
        trackingNumber: true,
        items: {
          select: { name: true, quantity: true, price: true, image: true },
        },
      },
    })

    if (!order || order.customerName === "") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Verify ownership via email (the order was fetched by orderNumber, verify email matches)
    const fullOrder = await prisma.order.findUnique({
      where: { orderNumber },
      select: { customerEmail: true },
    })

    if (!fullOrder || fullOrder.customerEmail !== email) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
