import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

const DEFAULT_SETTINGS: Record<string, string> = {
  tax_rate: "18",
  shipping_cost: "0",
  free_shipping_min: "0",
  site_name: "Deeray",
}

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rows = await prisma.siteSetting.findMany()
  const dbSettings: Record<string, string> = {}
  for (const row of rows) dbSettings[row.key] = row.value

  // Merge defaults for any missing keys
  for (const [key, val] of Object.entries(DEFAULT_SETTINGS)) {
    if (!(key in dbSettings)) dbSettings[key] = val
  }

  // Read-only env settings
  const envSettings = {
    smtp_host: process.env.SMTP_HOST || "",
    smtp_port: process.env.SMTP_PORT || "",
    smtp_user: process.env.SMTP_USER || "",
    smtp_from: process.env.SMTP_FROM || "",
    smtp_configured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
  }

  return NextResponse.json({ settings: dbSettings, env: envSettings })
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const allowed = Object.keys(DEFAULT_SETTINGS)

  for (const key of Object.keys(body)) {
    if (!allowed.includes(key)) continue
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(body[key]) },
      create: { key, value: String(body[key]) },
    })
  }

  return NextResponse.json({ success: true })
}
