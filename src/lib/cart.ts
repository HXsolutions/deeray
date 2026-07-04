"use server"
import { cookies } from "next/headers"

export interface CartItem {
  variantId: number
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

export interface Cart {
  items: CartItem[]
}

const CART_COOKIE = "deeray_cart"

async function getCartCookie() {
  const store = await cookies()
  return store.get(CART_COOKIE)
}

async function setCartCookie(cart: Cart) {
  const store = await cookies()
  store.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  })
}

export async function getCart(): Promise<Cart> {
  const cookie = await getCartCookie()
  if (!cookie?.value) {
    return { items: [] }
  }
  try {
    return JSON.parse(cookie.value)
  } catch {
    return { items: [] }
  }
}

export async function addToCart(variantId: number, productId: string, name: string, sku: string, price: number, quantity = 1, image?: string, size?: string, color?: string): Promise<Cart> {
  const cart = await getCart()
  const existingItem = cart.items.find((item) => item.variantId === variantId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.items.push({
      variantId,
      productId,
      name,
      sku,
      price,
      quantity,
      image: image || "",
      size,
      color,
    })
  }

  await setCartCookie(cart)
  return cart
}

export async function updateCartItem(variantId: number, quantity: number): Promise<Cart> {
  const cart = await getCart()
  const itemIndex = cart.items.findIndex((item) => item.variantId === variantId)

  if (itemIndex === -1) {
    return cart
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1)
  } else {
    cart.items[itemIndex].quantity = quantity
  }

  await setCartCookie(cart)
  return cart
}

export async function removeFromCart(variantId: number): Promise<Cart> {
  const cart = await getCart()
  cart.items = cart.items.filter((item) => item.variantId !== variantId)
  await setCartCookie(cart)
  return cart
}

export async function clearCart(): Promise<void> {
  const store = await cookies()
  store.delete(CART_COOKIE)
}

export async function getCartTotal(cart: Cart): Promise<{ subtotal: number; tax: number; total: number }> {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax

  return { subtotal, tax, total }
}
