import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const variants = await prisma.productVariant.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: [{ product: { name: "asc" } }, { sku: "asc" }],
  })

  const header = "Product,SKU,Price,Stock,Status\n"
  const rows = variants
    .map((v) => {
      const status = v.stock > 10 ? "In Stock" : v.stock > 0 ? "Low Stock" : "Out of Stock"
      return `${v.product.name},${v.sku},${v.price},${v.stock},${status}`
    })
    .join("\n")

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="inventory-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
