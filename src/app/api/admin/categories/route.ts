import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } }, parent: { select: { name: true } } },
    orderBy: { name: "asc" },
  })

  return NextResponse.json({ categories })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image,
      parentId: body.parentId || null,
    },
  })

  return NextResponse.json({ category }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()

  const category = await prisma.category.update({
    where: { id: body.id },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image,
      parentId: body.parentId || null,
    },
  })

  return NextResponse.json({ category })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
