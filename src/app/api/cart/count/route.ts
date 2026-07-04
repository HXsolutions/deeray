import { NextResponse } from "next/server"
import { getCart } from "@/lib/cart"

export async function GET() {
  const cart = await getCart()
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  return NextResponse.json({ count })
}
