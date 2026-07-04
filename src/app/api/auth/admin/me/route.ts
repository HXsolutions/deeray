import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true, name: true },
  })

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 })
  }

  return NextResponse.json({ admin })
}
