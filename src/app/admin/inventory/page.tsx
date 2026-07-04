"use client"

import { useState, useEffect, useRef } from "react"

type Tab = "inventory" | "movements" | "alerts"

export default function AdminInventory() {
  const [tab, setTab] = useState<Tab>("inventory")
  const [inventories, setInventories] = useState<any[]>([])
  const [movements, setMovements] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ variantId: 0, type: "IN", quantity: 0, note: "" })
  const [importResult, setImportResult] = useState<any>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadInventory = () =>
    fetch("/api/admin/inventory").then((r) => r.json()).then((d) => setInventories(d.inventories || []))

  const loadMovements = () =>
    fetch("/api/admin/inventory/movements").then((r) => r.json()).then((d) => setMovements(d.movements || []))

  const loadAlerts = () =>
    fetch("/api/admin/inventory/alerts").then((r) => r.json()).then((d) => setAlerts(d.alerts || []))

  useEffect(() => {
    Promise.all([loadInventory(), loadMovements(), loadAlerts()]).finally(() => setLoading(false))
  }, [])

  const handleAddMovement = async () => {
    await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ variantId: 0, type: "IN", quantity: 0, note: "" })
    await Promise.all([loadInventory(), loadMovements(), loadAlerts()])
  }

  const handleResolveAlert = async (id: number) => {
    await fetch("/api/admin/inventory/alerts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    await loadAlerts()
  }

  const handleExport = () => {
    window.open("/api/admin/inventory/export", "_blank")
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/admin/inventory/import", { method: "POST", body: fd })
    const data = await res.json()
    setImportResult(data)
    if (fileRef.current) fileRef.current.value = ""
    await Promise.all([loadInventory(), loadMovements(), loadAlerts()])
  }

  if (loading) return <div className="text-[#73777d]">Loading...</div>

  const tabs: { key: Tab; label: string }[] = [
    { key: "inventory", label: "Inventory" },
    { key: "movements", label: "Movements" },
    { key: "alerts", label: `Alerts (${alerts.length})` },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-[#062437]">Inventory</h1>
        <div className="flex gap-3">
          <button onClick={handleExport}
            className="border border-[#062437] text-[#062437] px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-[#f4f3f5]">
            Export CSV
          </button>
          <label className="border border-[#062437] text-[#062437] px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-[#f4f3f5] cursor-pointer">
            Import CSV
            <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-[#062437] text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-[#1f3a4d]">
            {showForm ? "Cancel" : "Record Movement"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-[#e3e2e4]">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`pb-3 text-xs uppercase tracking-widest transition-colors ${tab === t.key ? "text-[#062437] border-b-2 border-[#062437]" : "text-[#73777d] hover:text-[#42474c]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Record Movement Form */}
      {showForm && (
        <div className="bg-white border border-[#e3e2e4] p-6 mb-8">
          <h3 className="text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Stock Movement</h3>
          <div className="flex gap-4 items-end flex-wrap">
            <select value={form.variantId} onChange={(e) => setForm({ ...form, variantId: parseInt(e.target.value) })}
              className="border border-[#e3e2e4] px-4 py-3 text-sm min-w-[200px]">
              <option value={0}>Select Variant</option>
              {inventories.map((inv: any) => (
                <option key={inv.id} value={inv.id}>{inv.product?.name} — {inv.sku} ({inv.stock} in stock)</option>
              ))}
            </select>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border border-[#e3e2e4] px-4 py-3 text-sm">
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="RETURN">Return</option>
            </select>
            <input type="number" placeholder="Qty" value={form.quantity || ""}
              onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
              className="w-24 border border-[#e3e2e4] px-4 py-3 text-sm" />
            <input type="text" placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="flex-1 min-w-[200px] border border-[#e3e2e4] px-4 py-3 text-sm" />
            <button onClick={handleAddMovement}
              className="bg-[#062437] text-white px-6 py-3 text-xs uppercase tracking-widest">Record</button>
          </div>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className="bg-[#d8e5e2] border border-[#b0c7c2] p-4 mb-6 text-sm">
          Imported {importResult.succeeded} / {importResult.total} rows successfully.
          {importResult.failed > 0 && (
            <ul className="mt-2 text-[#ba1a1a] text-xs">
              {importResult.results.filter((r: any) => !r.success).map((r: any, i: number) => (
                <li key={i}>{r.sku}: {r.error}</li>
              ))}
            </ul>
          )}
          <button onClick={() => setImportResult(null)} className="text-[#062437] underline mt-2 text-xs">Dismiss</button>
        </div>
      )}

      {/* Tab: Inventory */}
      {tab === "inventory" && (
        <div className="bg-white border border-[#e3e2e4]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e3e2e4]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Product</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">SKU</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Price</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Stock</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inv: any) => (
                <tr key={inv.id} className="border-b border-[#e3e2e4] hover:bg-[#f4f3f5]">
                  <td className="px-6 py-5 text-sm text-[#062437]">{inv.product?.name}</td>
                  <td className="px-6 py-5 text-sm text-[#42474c]">{inv.sku}</td>
                  <td className="px-6 py-5 text-sm text-[#42474c]">Rs. {Number(inv.price).toLocaleString("en-IN")}</td>
                  <td className="px-6 py-5 text-sm text-[#062437]">{inv.stock}</td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] px-2 py-1 uppercase tracking-widest ${
                      inv.stock > 10 ? "bg-[#d8e5e2] text-[#121e1c]" :
                      inv.stock > 0 ? "bg-[#fadbb2] text-[#765f3e]" : "bg-[#ffdad6] text-[#ba1a1a]"
                    }`}>
                      {inv.stock > 10 ? "In Stock" : inv.stock > 0 ? "Low Stock" : "Out of Stock"}
                    </span>
                  </td>
                </tr>
              ))}
              {inventories.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-[#73777d] text-sm">No variants found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Movements */}
      {tab === "movements" && (
        <div className="bg-white border border-[#e3e2e4]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e3e2e4]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Product</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Type</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Qty</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Note</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m: any) => (
                <tr key={m.id} className="border-b border-[#e3e2e4] hover:bg-[#f4f3f5]">
                  <td className="px-6 py-5 text-sm text-[#73777d]">{new Date(m.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-5 text-sm text-[#062437]">{m.variant?.product?.name}</td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] px-2 py-1 uppercase tracking-widest ${
                      m.type === "IN" ? "bg-[#d8e5e2] text-[#121e1c]" :
                      m.type === "OUT" ? "bg-[#ffdad6] text-[#ba1a1a]" :
                      m.type === "RETURN" ? "bg-[#d4e0f0] text-[#1a2a4a]" :
                      "bg-[#fadbb2] text-[#765f3e]"
                    }`}>{m.type}</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#42474c]">{m.quantity}</td>
                  <td className="px-6 py-5 text-sm text-[#73777d]">{m.note || "—"}</td>
                </tr>
              ))}
              {movements.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-[#73777d] text-sm">No movements recorded</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Alerts */}
      {tab === "alerts" && (
        <div className="bg-white border border-[#e3e2e4]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e3e2e4]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Product</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Current Stock</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Threshold</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Created</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a: any) => (
                <tr key={a.id} className="border-b border-[#e3e2e4] hover:bg-[#f4f3f5]">
                  <td className="px-6 py-5 text-sm text-[#062437]">{a.variant?.product?.name} ({a.variant?.sku})</td>
                  <td className="px-6 py-5">
                    <span className="bg-[#fadbb2] text-[#765f3e] text-[10px] px-2 py-1">{a.stockAtAlert}</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#42474c]">{a.threshold}</td>
                  <td className="px-6 py-5 text-sm text-[#73777d]">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-5">
                    <button onClick={() => handleResolveAlert(a.id)}
                      className="text-[#062437] text-xs uppercase tracking-widest hover:underline">Resolve</button>
                  </td>
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-[#73777d] text-sm">No active alerts</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
