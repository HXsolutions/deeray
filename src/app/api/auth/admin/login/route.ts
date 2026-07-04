import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const session = await getSession()
    session.adminId = admin.id
    session.email = admin.email
    session.isLoggedIn = true
    await session.save()

    return NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email, name: admin.name } })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
