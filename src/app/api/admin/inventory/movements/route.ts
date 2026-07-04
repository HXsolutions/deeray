import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const movements = await prisma.stockMovement.findMany({
    include: { variant: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json({ movements })
}
