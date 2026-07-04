import { NextResponse, NextRequest } from "next/server"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const session = await getSession()
  session.destroy()

  const url = new URL("/admin/login", request.url)
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  const session = await getSession()
  session.destroy()

  const url = new URL("/admin/login", request.url)
  return NextResponse.redirect(url)
}
