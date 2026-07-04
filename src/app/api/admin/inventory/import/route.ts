import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "CSV file required" }, { status: 400 })

  const text = await file.text()
  const lines = text.trim().split("\n")

  if (lines.length < 2) return NextResponse.json({ error: "CSV must have header + at least one row" }, { status: 400 })

  const results: { sku: string; stock: number; success: boolean; error?: string }[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",")
    const sku = cols[1]?.trim()
    const stock = parseInt(cols[3]?.trim(), 10)

    if (!sku || isNaN(stock)) {
      results.push({ sku: sku || `row ${i}`, stock, success: false, error: "Invalid SKU or stock value" })
      continue
    }

    try {
      const variant = await prisma.productVariant.findUnique({ where: { sku } })
      if (!variant) {
        results.push({ sku, stock, success: false, error: "SKU not found" })
        continue
      }

      const diff = stock - variant.stock

      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { stock },
      })

      if (diff !== 0) {
        await prisma.stockMovement.create({
          data: {
            variantId: variant.id,
            type: diff > 0 ? "IN" : "OUT",
            quantity: Math.abs(diff),
            note: "Bulk CSV import",
          },
        })
      }

      // Auto-create/resolve low-stock alert
      if (stock <= 10) {
        const existing = await prisma.lowStockAlert.findFirst({
          where: { variantId: variant.id, resolvedAt: null },
        })
        if (!existing) {
          await prisma.lowStockAlert.create({
            data: { variantId: variant.id, threshold: 10, stockAtAlert: stock },
          })
        }
      } else {
        await prisma.lowStockAlert.updateMany({
          where: { variantId: variant.id, resolvedAt: null },
          data: { resolvedAt: new Date() },
        })
      }

      results.push({ sku, stock, success: true })
    } catch (e) {
      results.push({ sku, stock, success: false, error: String(e) })
    }
  }

  return NextResponse.json({ results, total: results.length, succeeded: results.filter((r) => r.success).length, failed: results.filter((r) => !r.success).length })
}
