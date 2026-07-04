"use client"

import { useState, FormEvent } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

interface Order {
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  items?: { name: string; quantity: number; price: number }[]
}

export default function OrderTrackingPage() {
  const params = useParams()
  const orderNumber = params.orderNumber as string

  const [email, setEmail] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${orderNumber}&email=${encodeURIComponent(email)}`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Order not found")
        return
      }
      const data = await res.json()
      setOrder(data)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const statusSteps = [
    { key: "PENDING", label: "Pending" },
    { key: "AWAITING_CONFIRMATION", label: "Awaiting Confirmation" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
  ]

  const currentStep = order ? statusSteps.findIndex((s) => s.key === order.status) : -1

  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-[#062437] mb-4 tracking-tight">Track Order</h1>
        <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c] mb-10 font-light">
          Order: <span className="font-medium text-[#062437]">{orderNumber}</span>
        </p>

        {!order && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-3">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email used during checkout"
                className="w-full border border-[#e3e2e4] rounded-full px-8 py-5 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors"
              />
            </div>

            {error && (
              <p className="text-[#ba1a1a] text-sm font-['Hanken_Grotesk']">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#062437] text-white rounded-full px-12 py-5 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] hover:bg-[#1f3a4d] transition-all duration-500 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track Order"}
            </button>
          </form>
        )}

        {order && (
          <div className="space-y-8">
            {/* Progress */}
            <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px]">
              <div className="bg-white rounded-[19px] p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#73777d] mb-1">Status</p>
                    <p className="font-serif text-2xl text-[#062437]">{order.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#73777d] mb-1">Payment</p>
                    <p className="font-['Hanken_Grotesk'] text-sm text-[#062437]">{order.paymentStatus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {statusSteps.map((step, i) => (
                    <div key={step.key} className="flex-1">
                      <div className={`h-2 rounded-full ${i <= currentStep ? "bg-[#062437]" : "bg-[#e3e2e4]"} transition-all duration-700`} />
                      <p className={`text-[10px] uppercase tracking-widest mt-2 font-['Hanken_Grotesk'] ${i <= currentStep ? "text-[#062437]" : "text-[#73777d]"}`}>
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px]">
              <div className="bg-white rounded-[19px] p-8">
                <h3 className="font-serif text-2xl text-[#062437] mb-6">Order Details</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-[#e3e2e4]">
                    <span className="font-['Hanken_Grotesk'] text-sm text-[#42474c]">Name</span>
                    <span className="font-['Hanken_Grotesk'] text-sm text-[#062437]">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e3e2e4]">
                    <span className="font-['Hanken_Grotesk'] text-sm text-[#42474c]">Email</span>
                    <span className="font-['Hanken_Grotesk'] text-sm text-[#062437]">{order.customerEmail}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e3e2e4]">
                    <span className="font-['Hanken_Grotesk'] text-sm text-[#42474c]">Date</span>
                    <span className="font-['Hanken_Grotesk'] text-sm text-[#062437]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-[#e3e2e4]">
                  <span className="font-['Hanken_Grotesk'] text-base text-[#062437]">Total</span>
                  <span className="font-serif text-2xl text-[#062437]">Rs. {Number(order.total).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <Link
              href="/collections"
              className="inline-flex items-center gap-2 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] text-[#42474c] hover:text-[#062437] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
