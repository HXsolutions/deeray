"use client"

import { useState, useEffect } from "react"

interface Coupon {
  id: string
  code: string
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING"
  value: number
  minOrder: number | null
  maxUsage: number | null
  usedCount: number
  startsAt: string
  expiresAt: string
  isActive: boolean
  createdAt: string
}

type CouponType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING"

const emptyForm = {
  code: "",
  type: "PERCENTAGE" as CouponType,
  value: "",
  minOrder: "",
  maxUsage: "",
  startsAt: "",
  expiresAt: "",
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((data) => setCoupons(data.coupons || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          type: form.type,
          value: parseFloat(form.value),
          minOrder: form.minOrder ? parseFloat(form.minOrder) : null,
          maxUsage: form.maxUsage ? parseInt(form.maxUsage) : null,
          startsAt: form.startsAt,
          expiresAt: form.expiresAt,
        }),
      })
      if (!res.ok) return
      setForm(emptyForm)
      setShowForm(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return
    await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" })
    load()
  }

  const now = new Date().toISOString().slice(0, 16)

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl text-[#062437]">Coupons</h1>
        <button
          onClick={() => { setForm(emptyForm); setShowForm(true) }}
          className="px-5 py-2.5 bg-[#062437] text-white font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.15em] rounded-full hover:bg-[#0a3550] transition-colors"
        >
          Add Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 bg-[#faf9fa] border border-[#e3e2e4] rounded-[16px] p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Code</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors uppercase"
                placeholder="SAVE20"
                required
              />
            </div>
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed (Rs.)</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Value</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors"
                placeholder={form.type === "PERCENTAGE" ? "20" : "1000"}
                required
                disabled={form.type === "FREE_SHIPPING"}
              />
            </div>
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Min Order (Rs.)</label>
              <input
                type="number"
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Max Uses</label>
              <input
                type="number"
                value={form.maxUsage}
                onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors"
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Start Date</label>
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Expiry Date</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-[#062437] text-white font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.15em] rounded-full hover:bg-[#0a3550] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm) }}
              className="px-6 py-2.5 border border-[#e3e2e4] font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.15em] text-[#42474c] rounded-full hover:bg-[#faf9fa] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d]">Loading...</p>
      ) : coupons.length === 0 ? (
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d]">No coupons yet.</p>
      ) : (
        <div className="bg-white border border-[#e3e2e4] rounded-[16px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3e2e4] bg-[#faf9fa]">
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Code</th>
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Type</th>
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Value</th>
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Min Order</th>
                <th className="text-center px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Used</th>
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Valid</th>
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Expires</th>
                <th className="text-center px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Active</th>
                <th className="text-right px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const startDate = new Date(c.startsAt)
                const endDate = new Date(c.expiresAt)
                const nowDate = new Date()
                const isValid = nowDate >= startDate && nowDate <= endDate && c.isActive

                return (
                  <tr key={c.id} className="border-b border-[#e3e2e4] last:border-0 hover:bg-[#faf9fa] transition-colors">
                    <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#062437] font-medium">{c.code}</td>
                    <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#42474c]">
                      {c.type === "PERCENTAGE" ? "%" : c.type === "FIXED" ? "Rs." : "Free Ship"}
                    </td>
                    <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#062437]">
                      {c.type === "PERCENTAGE" ? `${Number(c.value)}%` : c.type === "FIXED" ? `Rs. ${Number(c.value).toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#73777d]">
                      {c.minOrder ? `Rs. ${Number(c.minOrder).toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-center font-['Hanken_Grotesk'] text-[#42474c]">
                      {c.usedCount}{c.maxUsage ? `/${c.maxUsage}` : ""}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full ${isValid ? "bg-[#d8e5e2] text-[#121e1c]" : "bg-[#ffdad6] text-[#93000a]"}`}>
                        {isValid ? "Valid" : "Invalid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#73777d]">{endDate.toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${c.isActive ? "bg-[#1b7e5e]" : "bg-[#ba1a1a]"}`} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(c.id)}
                        className="px-3 py-1.5 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.15em] text-[#93000a] hover:text-[#b0000a] transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
