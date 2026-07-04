import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json({ coupons })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()

  const coupon = await prisma.coupon.create({
    data: {
      code: body.code,
      type: body.type,
      value: body.value,
      minOrder: body.minOrder,
      maxUsage: body.maxUsage,
      startsAt: new Date(body.startsAt),
      expiresAt: new Date(body.expiresAt),
    },
  })

  return NextResponse.json({ coupon }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await prisma.coupon.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
