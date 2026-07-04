import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendOrderConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingAddress, customerInfo, paymentInfo, subtotal, tax, shippingCost, discount, total, couponId, couponCode } = body

    if (!items?.length || !customerInfo?.name || !customerInfo?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (total <= 0) {
      return NextResponse.json({ error: "Invalid order total" }, { status: 400 })
    }

    // Validate all variant IDs exist and calculate server-side totals
    const variantIds = items.map((i: any) => i.variantId)
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
    })

    if (variants.length !== variantIds.length) {
      return NextResponse.json({ error: "One or more products not found" }, { status: 400 })
    }

    const variantMap = new Map(variants.map((v) => [v.id, v]))
    let serverSubtotal = 0

    for (const item of items) {
      const dbVariant = variantMap.get(item.variantId)
      if (!dbVariant) {
        return NextResponse.json({ error: `Variant ${item.variantId} not found` }, { status: 400 })
      }
      if (dbVariant.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.sku}` }, { status: 400 })
      }
      if (Math.abs(Number(dbVariant.price) - Number(item.price)) > 1) {
        return NextResponse.json({ error: `Price mismatch for ${item.sku}` }, { status: 400 })
      }
      serverSubtotal += Number(dbVariant.price) * item.quantity
    }

    const serverTax = Math.round(serverSubtotal * 0.18 * 100) / 100
    const serverTotal = serverSubtotal + serverTax + Number(shippingCost || 0) - Number(discount || 0)

    if (Math.abs(Number(total) - serverTotal) > 1) {
      return NextResponse.json({ error: "Total mismatch" }, { status: 400 })
    }

    // Generate order number
    const count = await prisma.order.count()
    const orderNumber = `DR-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`

    const confirmationToken = crypto.randomBytes(24).toString("hex")

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
        shippingAddress,
        subtotal: serverSubtotal,
        tax: serverTax,
        shippingCost: Number(shippingCost) || 0,
        discount: Number(discount) || 0,
        total: serverTotal,
        paymentMethod: paymentInfo.method,
        paymentId: paymentInfo.id || null,
        status: paymentInfo.method === "cod" ? "AWAITING_CONFIRMATION" : "PENDING",
        paymentStatus: "UNPAID",
        couponId: couponId || null,
        couponCode: couponCode || null,
        notes: body.notes || null,
        confirmationToken,
      },
    })

    // Increment coupon usage if applied
    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      })
    }

    // Update stock for ordered items
    for (const item of items) {
      const updated = await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      })

      await prisma.stockMovement.create({
        data: {
          variantId: item.variantId,
          type: "OUT",
          quantity: -item.quantity,
          note: `Sale Order #${orderNumber}`,
          orderId: order.id,
        },
      })

      if (updated.stock <= 10) {
        const existing = await prisma.lowStockAlert.findFirst({
          where: { variantId: item.variantId, resolvedAt: null },
        })
        if (!existing) {
          await prisma.lowStockAlert.create({
            data: { variantId: item.variantId, threshold: 10, stockAtAlert: updated.stock },
          })
        }
      }
    }

    // Send confirmation email (non-blocking)
    sendOrderConfirmationEmail({
      to: order.customerEmail,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      items: items.map((i: any) => ({ name: i.name, quantity: i.quantity, price: Number(i.price) })),
      total: serverTotal,
      shippingAddress: shippingAddress || {},
      confirmationToken: paymentInfo.method === "cod" ? confirmationToken : undefined,
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const orderNumber = searchParams.get("orderNumber")

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      })
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
      return NextResponse.json({ order })
    }

    if (!email) {
      return NextResponse.json({ error: "Email or orderNumber required" }, { status: 400 })
    }

    const orders = await prisma.order.findMany({
      where: { customerEmail: email },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
