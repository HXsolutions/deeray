import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const alerts = await prisma.lowStockAlert.findMany({
    where: { resolvedAt: null },
    include: { variant: { include: { product: { select: { name: true, slug: true } } } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ alerts })
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  await prisma.lowStockAlert.update({
    where: { id: body.id },
    data: { resolvedAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
