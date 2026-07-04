import { NextRequest, NextResponse } from "next/server"
import { addToCart, getCart, updateCartItem, removeFromCart, clearCart } from "@/lib/cart"

export async function GET() {
  try {
    const cart = await getCart()
    return NextResponse.json(cart)
  } catch {
    return NextResponse.json({ error: "Failed to get cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, variantId, productId, name, sku, price, quantity, image, size, color } = body

    let cart
    switch (action) {
      case "add": {
        cart = await addToCart(variantId, productId, name, sku, price, quantity || 1, image, size, color)
        break
      }
      case "update": {
        cart = await updateCartItem(variantId, quantity)
        break
      }
      case "remove": {
        cart = await removeFromCart(variantId)
        break
      }
      case "clear": {
        await clearCart()
        cart = { items: [] }
        break
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json(cart)
  } catch {
    return NextResponse.json({ error: "Failed to process cart" }, { status: 500 })
  }
}
