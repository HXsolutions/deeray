"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

const statuses = ["PENDING", "AWAITING_CONFIRMATION", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED"]
const paymentStatuses = ["UNPAID", "PAID", "REFUNDED", "PARTIALLY_REFUNDED", "FAILED"]

const TRACKING_URLS: Record<string, string> = {
  tcs: "https://tcs.com/tracking?cn=",
  leopards: "https://www.leopardscourier.com/tracking/",
  trax: "https://trax.com.pk/tracking/",
  "m&p": "https://mnp.com.pk/track/",
  postex: "https://postex.pk/track/",
  "call courier": "https://callcourier.com.pk/tracking/",
}

export default function AdminOrderDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [agents, setAgents] = useState<any[]>([])
  const [status, setStatus] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [courierId, setCourierId] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [shipmentMsg, setShipmentMsg] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelling, setCancelling] = useState(false)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/orders/${id}`).then((r) => r.json()),
      fetch("/api/admin/agents").then((r) => r.json()),
    ]).then(([orderData, agentData]) => {
      setOrder(orderData.order)
      setStatus(orderData.order.status)
      setPaymentStatus(orderData.order.paymentStatus)
      setTrackingNumber(orderData.order.trackingNumber || "")
      setCourierId(orderData.order.courierId || "")
      setAgents(agentData.agents || [])
    }).finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus, trackingNumber, courierId }),
    })
    setSaving(false)
  }

  const handleCreateShipment = async () => {
    if (!courierId) return
    setShipmentMsg(null)
    const res = await fetch("/api/admin/orders/ship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, courierId }),
    })
    const data = await res.json()
    if (data.trackingNumber) {
      setTrackingNumber(data.trackingNumber)
      setShipmentMsg(`Shipment created! Tracking: ${data.trackingNumber}`)
    } else {
      setShipmentMsg(data.error || "Failed to create shipment")
    }
  }

  const selectedAgent = agents.find((a) => a.id === courierId)
  const companyKey = selectedAgent?.company?.toLowerCase() || ""
  const trackingUrl = trackingNumber && TRACKING_URLS[companyKey]
    ? TRACKING_URLS[companyKey] + trackingNumber
    : null

  if (loading) return <div className="text-[#73777d]">Loading...</div>
  if (!order) return <div className="text-[#ba1a1a]">Order not found</div>

  return (
    <div>
      <button onClick={() => router.push("/admin/orders")} className="text-[#73777d] text-xs uppercase tracking-widest hover:text-[#062437] mb-6 block">
        &larr; Back to Orders
      </button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#062437]">{order.orderNumber}</h1>
          <p className="text-sm text-[#73777d] mt-1">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="bg-[#062437] text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#1f3a4d] disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {shipmentMsg && (
        <div className={`p-4 mb-6 text-sm ${shipmentMsg.includes("created") ? "bg-[#d8e5e2] border border-[#b0c7c2]" : "bg-[#ffdad6] border border-[#ffb4ab]"}`}>
          {shipmentMsg}
          <button onClick={() => setShipmentMsg(null)} className="ml-4 text-[#062437] underline text-xs">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white border border-[#e3e2e4] p-6">
            <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Order Status</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Payment */}
          <div className="bg-white border border-[#e3e2e4] p-6">
            <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Payment</h3>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]">
              {paymentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <p className="text-xs text-[#73777d] mt-3">Method: {order.paymentMethod || "—"}</p>
          </div>

          {/* Tracking */}
          <div className="bg-white border border-[#e3e2e4] p-6">
            <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Shipping & Tracking</h3>
            <select value={courierId} onChange={(e) => setCourierId(e.target.value)}
              className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437] mb-3">
              <option value="">Select Courier</option>
              {agents.filter((a) => a.isActive).map((a) => (
                <option key={a.id} value={a.id}>{a.name} ({a.company})</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking Number"
                className="flex-1 border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]" />
              {courierId && (
                <button onClick={handleCreateShipment}
                  className="bg-[#062437] text-white px-4 py-3 text-[10px] uppercase tracking-widest whitespace-nowrap hover:bg-[#1f3a4d]">
                  Create Shipment
                </button>
              )}
            </div>
            {trackingUrl && (
              <a href={trackingUrl} target="_blank" rel="noopener noreferrer"
                className="text-[#062437] text-xs underline mt-2 block">
                Track on {selectedAgent?.company} &rarr;
              </a>
            )}
          </div>

          {/* Customer */}
          <div className="bg-white border border-[#e3e2e4] p-6">
            <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Customer</h3>
            <p className="text-sm text-[#062437]">{order.customerName}</p>
            <p className="text-sm text-[#42474c]">{order.customerEmail}</p>
            <p className="text-sm text-[#42474c]">{order.customerPhone || "—"}</p>
            {order.confirmedAt ? (
              <p className="text-xs text-[#121e1c] mt-3 bg-[#d8e5e2] rounded-full px-4 py-1.5 inline-block">
                Confirmed {new Date(order.confirmedAt).toLocaleString()}
              </p>
            ) : order.status === "AWAITING_CONFIRMATION" ? (
              <p className="text-xs text-[#ba1a1a] mt-3 bg-[#ffdad6] rounded-full px-4 py-1.5 inline-block">
                Awaiting customer confirmation
              </p>
            ) : null}
          </div>

          {/* Shipping */}
          <div className="bg-white border border-[#e3e2e4] p-6">
            <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Shipping Address</h3>
            {typeof order.shippingAddress === "object" ? (
              <div className="text-sm text-[#42474c] space-y-1">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              </div>
            ) : (
              <p className="text-sm text-[#42474c]">{String(order.shippingAddress)}</p>
            )}
          </div>
          </div>

          {/* Cancel Order */}
          {order.status !== "CANCELLED" && order.status !== "RETURNED" && order.status !== "REFUNDED" && order.status !== "DELIVERED" && (
            <div className="bg-white border border-[#e3e2e4] p-6">
              <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Remove Order</h3>
              <p className="text-xs text-[#73777d] mb-3 font-['Hanken_Grotesk']">
                This will cancel the order and restore stock.
              </p>
              <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (optional — if filled, customer gets an email)"
                className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437] mb-3 resize-none h-20 font-['Hanken_Grotesk']" />
              <button onClick={async () => {
                if (!confirm("Are you sure you want to cancel this order?")) return
                setCancelling(true)
                const params = new URLSearchParams()
                if (cancelReason.trim()) params.set("reason", cancelReason.trim())
                await fetch(`/api/admin/orders/${id}?${params}`, { method: "DELETE" })
                setCancelling(false)
                setCancelReason("")
                window.location.reload()
              }} disabled={cancelling}
                className="bg-[#ba1a1a] text-white px-4 py-3 text-[10px] uppercase tracking-widest hover:bg-[#a01515] transition-colors disabled:opacity-50 font-['Hanken_Grotesk']">
                {cancelling ? "Removing..." : "Remove Order"}
              </button>
            </div>
          )}

        {/* Order Items */}
        <div className="bg-white border border-[#e3e2e4] p-6 h-fit">
          <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Items</h3>
          <div className="space-y-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between py-3 border-b border-[#e3e2e4] last:border-0">
                <div>
                  <p className="text-sm text-[#062437]">{item.name}</p>
                  <p className="text-xs text-[#73777d]">SKU: {item.sku} | Qty: {item.quantity}</p>
                </div>
                <p className="text-sm text-[#062437]">Rs. {Number(item.price * item.quantity).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t border-[#e3e2e4]">
            <span className="font-['Hanken_Grotesk'] text-sm text-[#062437]">Total</span>
            <span className="font-serif text-xl text-[#062437]">Rs. {Number(order.total).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
