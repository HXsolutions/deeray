"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface CartItem {
  variantId: number
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => { fetchCart() }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/cart")
      if (res.ok) {
        const cart = await res.json()
        setItems(cart.items)
      }
    } catch {}
    setLoading(false)
  }

  const updateItem = async (variantId: number, quantity: number) => {
    setUpdating(variantId)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", variantId, quantity }),
      })
      if (res.ok) {
        const cart = await res.json()
        setItems(cart.items)
        window.dispatchEvent(new CustomEvent("cart-updated"))
      }
    } catch {}
    setUpdating(null)
  }

  const removeItem = async (variantId: number) => {
    setUpdating(variantId)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", variantId }),
      })
      if (res.ok) {
        const cart = await res.json()
        setItems(cart.items)
        window.dispatchEvent(new CustomEvent("cart-updated"))
      }
    } catch {}
    setUpdating(null)
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax

  if (loading) {
    return (
      <div className="px-6 md:px-10 pt-36 bg-[#faf9fa] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-[#73777d] font-['Hanken_Grotesk'] py-20">Loading cart...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-[#062437] tracking-tight">Shopping Cart</h1>
          <span className="font-['Hanken_Grotesk'] text-xs text-[#73777d]">({items.length} {items.length === 1 ? "item" : "items"})</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#f4f3f5] rounded-full mx-auto mb-8 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#73777d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl text-[#062437] mb-4">Your cart is empty</h2>
            <p className="text-[#73777d] mb-10 font-['Hanken_Grotesk'] font-light">
              Discover our collections and add something beautiful to your cart
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-3 bg-[#062437] text-white rounded-full px-10 py-4 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] hover:bg-[#1f3a4d] transition-all duration-500"
            >
              Shop Collections
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.variantId} className="bg-white border border-[#e3e2e4] rounded-[20px] p-6 md:p-8">
                  <div className="flex gap-6">
                    <div className="w-28 h-36 md:w-36 md:h-48 bg-[#f4f3f5] rounded-xl relative flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuBT94kfTQPJG-P7qZEPuyRTFOQGda8qIYgqIokR0B8eI0KIvsh9iJlogzDnsHP1pBNn_dLRlgncT5yEqp-1Au5dYxB9XG-zwh72o3eaiBeBkI8yciY_qIjbax-L4OvNS_PoEDTmfo2xj1swFJ79113IAvUBH59RZFiHUdgGOPOJtt6OaGrvZlhTL1F04y0LFRFGselBCoSrWtjSAvM5c6UOu5M7P8U6KkEUZQbHMHvHFyh-FYBYa6G9DomHf-CgZAPyLbUUcSWlOJI"}
                        alt={item.name}
                        fill
                        className="object-contain p-3 md:p-4"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-xl md:text-2xl text-[#062437] mb-2">{item.name}</h3>
                        <div className="font-['Hanken_Grotesk'] text-xs text-[#73777d] space-y-1">
                          <p>SKU: {item.sku}</p>
                          {item.size && <p>Size: {item.size}</p>}
                          {item.color && <p>Color: {item.color}</p>}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-3 mt-4 md:mt-0">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-[#e3e2e4] bg-white rounded-full overflow-hidden">
                            <button
                              onClick={() => updateItem(item.variantId, item.quantity - 1)}
                              className="px-3 md:px-4 py-2 text-[#42474c] hover:bg-[#f4f3f5] transition-colors text-sm disabled:opacity-50"
                              disabled={updating === item.variantId || item.quantity <= 1}
                            >
                              −
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1
                                if (val >= 1) updateItem(item.variantId, val)
                              }}
                              className="w-12 md:w-16 px-2 py-2 text-center border-0 focus:outline-none font-['Hanken_Grotesk'] text-sm"
                              disabled={updating === item.variantId}
                            />
                            <button
                              onClick={() => updateItem(item.variantId, item.quantity + 1)}
                              className="px-3 md:px-4 py-2 text-[#42474c] hover:bg-[#f4f3f5] transition-colors text-sm disabled:opacity-50"
                              disabled={updating === item.variantId}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="w-7 h-7 rounded-full border border-[#e3e2e4] flex items-center justify-center hover:border-[#ba1a1a] hover:text-[#ba1a1a] transition-colors disabled:opacity-50 text-[#73777d]"
                            disabled={updating === item.variantId}
                            title="Remove"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="font-['Hanken_Grotesk'] text-lg text-[#062437] font-medium">
                          Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px] sticky top-36">
                <div className="bg-white rounded-[19px] p-8 space-y-6">
                  <h2 className="font-serif text-2xl text-[#062437]">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-['Hanken_Grotesk'] text-sm text-[#42474c]">Subtotal</span>
                      <span className="font-['Hanken_Grotesk'] text-sm text-[#062437]">Rs. {subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-['Hanken_Grotesk'] text-sm text-[#42474c]">Tax (18%)</span>
                      <span className="font-['Hanken_Grotesk'] text-sm text-[#062437]">Rs. {tax.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-[#e3e2e4]">
                      <span className="font-['Hanken_Grotesk'] text-base text-[#062437]">Total</span>
                      <span className="font-serif text-xl text-[#062437]">Rs. {total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="group flex w-full bg-[#062437] text-white py-5 rounded-full items-center justify-center gap-3 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] hover:bg-[#1f3a4d] transition-all duration-500"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>

                  <Link
                    href="/collections"
                    className="block w-full text-center py-4 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] text-[#42474c] hover:text-[#062437] transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
