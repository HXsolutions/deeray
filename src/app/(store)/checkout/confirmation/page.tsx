"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

interface OrderItem {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  image: string | null
}

interface Order {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingAddress: { line1?: string; line2?: string; city?: string; state?: string; zip?: string }
  paymentMethod: string | null
  subtotal: number
  tax: number
  shippingCost: number
  discount: number
  total: number
  status: string
  items: OrderItem[]
  createdAt: string
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("orderNumber")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!orderNumber) { setLoading(false); return }
    fetch(`/api/orders?orderNumber=${orderNumber}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) setOrder(data.order)
        else setError("Order not found")
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false))
  }, [orderNumber])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-[#e3e2e4] rounded-full mx-auto mb-8 animate-pulse" />
        <div className="h-10 bg-[#e3e2e4] rounded-full w-64 mx-auto mb-6 animate-pulse" />
        <div className="h-4 bg-[#e3e2e4] rounded-full w-48 mx-auto animate-pulse" />
      </div>
    )
  }

  if (error || !orderNumber || !order) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[#ffdad6] mx-auto mb-8 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#ba1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-[#062437] mb-4 tracking-tight">Order Not Found</h1>
        <p className="font-['Hanken_Grotesk'] text-base text-[#42474c] mb-10 font-light">{error || "No order number provided."}</p>
        <Link href="/collections" className="inline-flex items-center gap-3 border border-[#e3e2e4] text-[#42474c] rounded-full px-10 py-4 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] hover:border-[#062437] hover:text-[#062437] transition-all duration-500">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const address = order.shippingAddress || {}

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-full bg-[#062437] mx-auto mb-8 flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-[#062437] mb-4 tracking-tight">Order Confirmed</h1>
        <p className="font-['Hanken_Grotesk'] text-base text-[#42474c] mb-4 font-light">
          Thank you for your order, {order.customerName}. We&apos;re preparing your items with care.
        </p>
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d] font-light">
          A confirmation email has been sent to <span className="text-[#062437]">{order.customerEmail}</span>.
          {order.paymentMethod === "cod" && order.status === "AWAITING_CONFIRMATION" && (
            <span className="block mt-2 text-[#ba1a1a]">
              Please click the confirm link in the email to finalize your order.
            </span>
          )}
        </p>
      </div>

      {/* Order Number */}
      <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px] mb-8">
        <div className="bg-white rounded-[19px] px-8 py-6 text-center">
          <p className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#73777d] mb-2">Order Number</p>
          <p className="font-serif text-3xl text-[#062437] tracking-tight">{order.orderNumber}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Items */}
        <div className="bg-white border border-[#e3e2e4] rounded-[20px] p-8">
          <h2 className="font-serif text-2xl text-[#062437] mb-6">Items</h2>
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4 border-b border-[#e3e2e4] last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#faf9fa] rounded-xl overflow-hidden flex-shrink-0 border border-[#e3e2e4]">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#73777d] text-xs font-['Hanken_Grotesk']">No img</div>
                  )}
                </div>
                <div>
                  <p className="font-['Hanken_Grotesk'] text-sm text-[#062437]">{item.name}</p>
                  <p className="font-['Hanken_Grotesk'] text-xs text-[#73777d]">Qty: {item.quantity} | SKU: {item.sku}</p>
                </div>
              </div>
              <p className="font-['Hanken_Grotesk'] text-sm text-[#062437]">Rs. {(item.price * item.quantity).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>

        {/* Shipping */}
        <div className="bg-white border border-[#e3e2e4] rounded-[20px] p-8">
          <h2 className="font-serif text-2xl text-[#062437] mb-4">Shipping Address</h2>
          <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c]">
            {address.line1}<br />
            {address.city}, {address.state} {address.zip}
          </p>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div>
              <span className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.15em] text-[#73777d]">Contact</span>
              <p className="font-['Hanken_Grotesk'] text-[#062437] mt-1">{order.customerName}</p>
              <p className="font-['Hanken_Grotesk'] text-[#42474c]">{order.customerEmail}</p>
              {order.customerPhone && <p className="font-['Hanken_Grotesk'] text-[#42474c]">{order.customerPhone}</p>}
            </div>
            <div>
              <span className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.15em] text-[#73777d]">Payment</span>
              <p className="font-['Hanken_Grotesk'] text-[#062437] mt-1 capitalize">{order.paymentMethod || "—"}</p>
              <p className="font-['Hanken_Grotesk'] text-[#42474c]">{order.status}</p>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-white border border-[#e3e2e4] rounded-[20px] p-8">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-['Hanken_Grotesk'] text-[#42474c]">Subtotal</span>
              <span className="font-['Hanken_Grotesk'] text-[#062437]">Rs. {Number(order.subtotal).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-['Hanken_Grotesk'] text-[#42474c]">Tax (18%)</span>
              <span className="font-['Hanken_Grotesk'] text-[#062437]">Rs. {Number(order.tax).toLocaleString("en-IN")}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="font-['Hanken_Grotesk'] text-[#121e1c]">Discount</span>
                <span className="font-['Hanken_Grotesk'] text-[#121e1c]">-Rs. {Number(order.discount).toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-lg pt-4 border-t border-[#e3e2e4]">
              <span className="font-['Hanken_Grotesk'] text-[#062437]">Total</span>
              <span className="font-serif text-[#062437]">Rs. {Number(order.total).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <Link href={`/order-tracking/${orderNumber}`}
          className="inline-flex items-center justify-center gap-3 bg-[#062437] text-white rounded-full px-10 py-4 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] hover:bg-[#1f3a4d] transition-all duration-500">
          Track Order
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        <Link href="/collections"
          className="inline-flex items-center justify-center gap-3 border border-[#e3e2e4] text-[#42474c] rounded-full px-10 py-4 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] hover:border-[#062437] hover:text-[#062437] transition-all duration-500">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

function ConfirmationFallback() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 bg-[#e3e2e4] rounded-full mx-auto mb-8 animate-pulse" />
      <div className="h-10 bg-[#e3e2e4] rounded-full w-64 mx-auto mb-6 animate-pulse" />
      <div className="h-4 bg-[#e3e2e4] rounded-full w-48 mx-auto animate-pulse" />
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <Suspense fallback={<ConfirmationFallback />}>
        <ConfirmationContent />
      </Suspense>
    </div>
  )
}
