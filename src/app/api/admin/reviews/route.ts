import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({ reviews })
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()

  const review = await prisma.review.update({
    where: { id: body.id },
    data: { isApproved: body.isApproved },
  })
  return NextResponse.json({ review })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await prisma.review.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
