import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json()

    if (!code) return NextResponse.json({ valid: false, error: "Code required" }, { status: 400 })

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })

    if (!coupon) return NextResponse.json({ valid: false, error: "Invalid coupon code" })

    if (!coupon.isActive) return NextResponse.json({ valid: false, error: "Coupon is no longer active" })

    const now = new Date()
    if (now < coupon.startsAt) return NextResponse.json({ valid: false, error: "Coupon not yet valid" })
    if (now > coupon.expiresAt) return NextResponse.json({ valid: false, error: "Coupon has expired" })

    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
      return NextResponse.json({ valid: false, error: "Coupon usage limit reached" })
    }

    if (coupon.minOrder && Number(subtotal) < Number(coupon.minOrder)) {
      return NextResponse.json({ valid: false, error: `Minimum order of Rs. ${Number(coupon.minOrder).toLocaleString("en-IN")} required` })
    }

    let discount = 0
    if (coupon.type === "PERCENTAGE") {
      discount = Number(subtotal) * (Number(coupon.value) / 100)
    } else if (coupon.type === "FIXED") {
      discount = Number(coupon.value)
    } else if (coupon.type === "FREE_SHIPPING") {
      discount = 0 // shipping cost handled separately
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: Math.min(discount, Number(subtotal)),
      },
    })
  } catch (e) {
    return NextResponse.json({ valid: false, error: "Failed to validate coupon" }, { status: 500 })
  }
}
