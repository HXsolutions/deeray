"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface CartItem {
  variantId: number
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

function PaymentOption({ name, value, checked, onChange, label, desc }: { name: string; value: string; checked: boolean; onChange: () => void; label: string; desc: string }) {
  return (
    <label className={`flex items-center gap-4 p-5 rounded-full border cursor-pointer transition-all duration-300 ${
      checked ? "border-[#062437] bg-[#062437]/5" : "border-[#e3e2e4] hover:border-[#062437]/30"
    }`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="accent-[#062437]" />
      <div>
        <p className="font-['Hanken_Grotesk'] text-sm font-medium text-[#062437]">{label}</p>
        <p className="text-xs text-[#73777d] font-['Hanken_Grotesk']">{desc}</p>
      </div>
    </label>
  )
}

interface BankAccount { bank: string; name: string; acc: string; iban: string }

export default function CheckoutPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [pgConfig, setPgConfig] = useState<any>(null)

  const [couponCode, setCouponCode] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("cod")

  useEffect(() => {
    Promise.all([
      fetch("/api/cart").then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => r.json()).catch(() => ({ settings: {} })),
    ]).then(([cart, settingsData]) => {
      setItems(cart.items)
      setBankAccounts(settingsData.settings?.bank_accounts || [])
      const pg = settingsData.settings?.payment_gateway
      setPgConfig(pg ? (typeof pg === "string" ? JSON.parse(pg) : pg) : null)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax - couponDiscount

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponError("")
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal }),
    })
    const data = await res.json()
    if (data.valid) {
      setAppliedCoupon(data.coupon)
      setCouponDiscount(data.coupon.discount)
    } else {
      setCouponError(data.error)
      setAppliedCoupon(null)
      setCouponDiscount(0)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const payload = {
        items,
        shippingAddress: { line1: form.line1, city: form.city, state: form.state, zip: form.zip },
        customerInfo: { name: form.name, email: form.email, phone: form.phone },
        paymentInfo: { method: paymentMethod, id: null },
        subtotal, tax, shippingCost: 0, discount: couponDiscount, total,
        couponCode: appliedCoupon?.code, couponId: appliedCoupon?.id,
        notes: form.notes,
      }
      console.log("Submitting order:", JSON.stringify(payload, null, 2))
      const body = JSON.stringify(payload)

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })

      if (!res.ok) {
        let msg = "Order failed"
        try {
          const err = await res.json()
          console.error("Order API error:", err, "status:", res.status)
          msg = err.error || `HTTP ${res.status}`
        } catch {
          const text = await res.text()
          console.error("Order API non-JSON response:", text, "status:", res.status)
          msg = text || `HTTP ${res.status}`
        }
        throw new Error(msg)
      }

      const { order } = await res.json()

      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      })

      if (paymentMethod === "online" && pgConfig) {
        if (pgConfig.jazzcash?.enabled) {
          router.push(`/payment/jazzcash?order=${order.orderNumber}`)
          return
        }
        if (pgConfig.easypaisa?.enabled) {
          router.push(`/payment/easypaisa?order=${order.orderNumber}`)
          return
        }
      }

      router.push(`/checkout/confirmation?orderNumber=${order.orderNumber}`)
    } catch (err: any) {
      alert(err.message || "Failed to place order. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="px-6 md:px-10 pt-36 bg-[#faf9fa] min-h-screen flex items-center justify-center">
        <p className="text-[#73777d] font-['Hanken_Grotesk']">Loading checkout...</p>
      </div>
    )
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-[#062437] mb-12 tracking-tight">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-6">
            {/* Contact */}
            <div className="bg-white border border-[#e3e2e4] rounded-[20px] p-8">
              <h2 className="font-serif text-2xl text-[#062437] mb-6">Contact</h2>
              <div className="grid grid-cols-2 gap-5">
                <input type="text" placeholder="Full Name *" required value={form.name} onChange={(e) => update("name", e.target.value)}
                  className="col-span-2 border border-[#e3e2e4] rounded-full px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors" />
                <input type="email" placeholder="Email *" required value={form.email} onChange={(e) => update("email", e.target.value)}
                  className="col-span-2 md:col-span-1 border border-[#e3e2e4] rounded-full px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors" />
                <input type="tel" placeholder="Phone *" required value={form.phone} onChange={(e) => update("phone", e.target.value)}
                  className="col-span-2 md:col-span-1 border border-[#e3e2e4] rounded-full px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors" />
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-[#e3e2e4] rounded-[20px] p-8">
              <h2 className="font-serif text-2xl text-[#062437] mb-6">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-5">
                <input type="text" placeholder="Address *" required value={form.line1} onChange={(e) => update("line1", e.target.value)}
                  className="col-span-2 border border-[#e3e2e4] rounded-full px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors" />
                <input type="text" placeholder="City *" required value={form.city} onChange={(e) => update("city", e.target.value)}
                  className="col-span-2 md:col-span-1 border border-[#e3e2e4] rounded-full px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors" />
                <input type="text" placeholder="State *" required value={form.state} onChange={(e) => update("state", e.target.value)}
                  className="col-span-2 md:col-span-1 border border-[#e3e2e4] rounded-full px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors" />
                <input type="text" placeholder="ZIP Code *" required value={form.zip} onChange={(e) => update("zip", e.target.value)}
                  className="col-span-2 md:col-span-1 border border-[#e3e2e4] rounded-full px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors" />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-[#e3e2e4] rounded-[20px] p-8">
              <h2 className="font-serif text-2xl text-[#062437] mb-6">Payment Method</h2>
              <div className="space-y-3">
                <PaymentOption name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} label="Cash on Delivery" desc="Pay when you receive your order" />
                <PaymentOption name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} label="Online Payment" desc="JazzCash / Easypaisa / Bank transfer" />
                {paymentMethod === "online" && (
                  <div className="ml-8 p-5 bg-[#faf9fa] rounded-[20px]">
                    <p className="font-['Hanken_Grotesk'] text-xs text-[#42474c]">You will be redirected to the payment gateway to complete your transaction securely.</p>
                  </div>
                )}
                <PaymentOption name="payment" value="bank" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} label="Bank Transfer" desc="Direct bank deposit / IBFT" />
                {paymentMethod === "bank" && (
                  <div className="ml-8 p-5 bg-[#faf9fa] rounded-[20px] space-y-4">
                    <p className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.15em] text-[#73777d]">Transfer to any of these accounts:</p>
                    {bankAccounts.length === 0 && (
                      <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d]">No bank accounts configured yet. Please contact support.</p>
                    )}
                    {bankAccounts.map((b, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-['Hanken_Grotesk'] font-medium text-[#062437]">{b.bank}</p>
                        <p className="font-['Hanken_Grotesk'] text-[#42474c]">{b.name}</p>
                        {b.acc && <p className="font-['Hanken_Grotesk'] text-[#42474c]">A/C: {b.acc}</p>}
                        {b.iban && <p className="font-['Hanken_Grotesk'] text-[#42474c]">IBAN: {b.iban}</p>}
                      </div>
                    ))}
                    <p className="font-['Hanken_Grotesk'] text-xs text-[#ba1a1a]">After transfer, share the slip via WhatsApp or email — your order will be confirmed once payment is verified.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px] sticky top-36">
              <div className="bg-white rounded-[19px] p-8 space-y-6">
                <h2 className="font-serif text-2xl text-[#062437]">Summary</h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 pb-4 border-b border-[#e3e2e4] last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-['Hanken_Grotesk'] text-sm text-[#062437]">{item.name}</p>
                        <p className="font-['Hanken_Grotesk'] text-xs text-[#73777d]">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-['Hanken_Grotesk'] text-sm text-[#062437]">
                        Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Coupon code" value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 border border-[#e3e2e4] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#062437] font-['Hanken_Grotesk'] transition-colors" />
                    <button type="button" onClick={handleApplyCoupon}
                      className="bg-[#062437] text-white px-6 py-3 rounded-full text-xs uppercase tracking-[0.15em] hover:bg-[#1f3a4d] transition-all duration-500 font-['Hanken_Grotesk']">
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[#ba1a1a] text-xs mt-2">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="text-[#121e1c] text-xs mt-2 bg-[#d8e5e2] rounded-full px-4 py-2 inline-block">
                      Coupon {appliedCoupon.code} applied — Rs. {appliedCoupon.discount.toLocaleString("en-IN")} off
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-[#e3e2e4]">
                  <div className="flex justify-between text-sm">
                    <span className="font-['Hanken_Grotesk'] text-[#42474c]">Subtotal</span>
                    <span className="font-['Hanken_Grotesk'] text-[#062437]">Rs. {subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-['Hanken_Grotesk'] text-[#42474c]">Tax (18%)</span>
                    <span className="font-['Hanken_Grotesk'] text-[#062437]">Rs. {tax.toLocaleString("en-IN")}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-['Hanken_Grotesk'] text-[#121e1c]">Discount</span>
                      <span className="font-['Hanken_Grotesk'] text-[#121e1c]">-Rs. {couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg pt-4 border-t border-[#e3e2e4]">
                    <span className="font-['Hanken_Grotesk'] text-[#062437]">Total</span>
                    <span className="font-serif text-[#062437]">Rs. {Math.max(0, total).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="group w-full bg-[#062437] text-white py-5 rounded-full font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] hover:bg-[#1f3a4d] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {processing ? "Processing..." : "Place Order"}
                  {!processing && (
                    <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
