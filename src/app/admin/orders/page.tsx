"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false))
  }, [])

  const statusColors: Record<string, string> = {
    PENDING: "bg-[#fadbb2] text-[#765f3e]",
    CONFIRMED: "bg-[#d8e5e2] text-[#121e1c]",
    PROCESSING: "bg-[#cae6fe] text-[#2f4a5d]",
    SHIPPED: "bg-[#cae6fe] text-[#2f4a5d]",
    DELIVERED: "bg-[#d8e5e2] text-[#121e1c]",
    CANCELLED: "bg-[#ffdad6] text-[#93000a]",
    RETURNED: "bg-[#ffdad6] text-[#93000a]",
    REFUNDED: "bg-[#ffdad6] text-[#93000a]",
  }

  if (loading) return <div className="text-[#73777d]">Loading...</div>

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#062437] mb-8">Orders</h1>

      <div className="bg-white border border-[#e3e2e4]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e3e2e4]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Order</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Customer</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Total</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Payment</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Courier</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#e3e2e4] hover:bg-[#f4f3f5] transition-colors cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                  <td className="px-6 py-5">
                    <span className="text-[#062437] text-sm font-medium">{order.orderNumber}</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-[#062437]">{order.customerName}</p>
                    <p className="text-xs text-[#73777d]">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#062437]">Rs. {Number(order.total).toLocaleString("en-IN")}</td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] px-2 py-1 uppercase tracking-widest ${statusColors[order.status] || "bg-[#e3e2e4] text-[#42474c]"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#42474c]">{order.paymentStatus}</td>
                  <td className="px-6 py-5 text-sm text-[#73777d]">{order.courier?.name || order.trackingNumber || "—"}</td>
                  <td className="px-6 py-5 text-sm text-[#73777d]">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-[#73777d] text-sm">No orders yet</td></tr>
              )}
            </tbody>
          </table>
      </div>
    </div>
  )
}
