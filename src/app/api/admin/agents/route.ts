import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

function maskKey(key: string | null): string | null {
  if (!key || key.length < 8) return key
  return key.slice(0, 4) + "****" + key.slice(-4)
}

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const agents = await prisma.courierAgent.findMany({ orderBy: { name: "asc" } })
  const masked = agents.map((a) => ({ ...a, apiKey: maskKey(a.apiKey) }))
  return NextResponse.json({ agents: masked })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()

  const agent = await prisma.courierAgent.create({
    data: {
      name: body.name,
      company: body.company,
      apiKey: body.apiKey,
      endpoint: body.endpoint,
    },
  })

  return NextResponse.json({ agent: { ...agent, apiKey: maskKey(agent.apiKey) } }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()

  const data: any = {
    name: body.name,
    company: body.company,
    endpoint: body.endpoint,
    isActive: body.isActive ?? true,
  }
  if (body.apiKey && body.apiKey.length > 0) {
    data.apiKey = body.apiKey
  }

  const agent = await prisma.courierAgent.update({
    where: { id: body.id },
    data,
  })

  return NextResponse.json({ agent: { ...agent, apiKey: maskKey(agent.apiKey) } })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await prisma.courierAgent.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
