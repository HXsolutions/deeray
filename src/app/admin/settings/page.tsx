"use client"

import { useState, useEffect, FormEvent } from "react"

const SMTP_LABELS: Record<string, string> = {
  smtp_host: "SMTP Host",
  smtp_port: "SMTP Port",
  smtp_user: "SMTP Username",
  smtp_from: "From Address",
  smtp_configured: "Status",
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [env, setEnv] = useState<Record<string, string | boolean>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings || {})
        setEnv(data.env || {})
      })
  }, [])

  const update = (key: string, value: string) => setSettings((prev) => ({ ...prev, [key]: value }))

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    if (res.ok) setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#062437] mb-10">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Editable Settings */}
        <div>
          <form onSubmit={handleSave} className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px]">
            <div className="bg-white rounded-[19px] p-8 space-y-6">
              <h2 className="font-serif text-2xl text-[#062437]">Store</h2>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-2 font-['Hanken_Grotesk']">Site Name</label>
                <input type="text" value={settings.site_name || ""} onChange={(e) => update("site_name", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-2 font-['Hanken_Grotesk']">Tax Rate (%)</label>
                <input type="number" step="0.01" min="0" max="100" value={settings.tax_rate || ""} onChange={(e) => update("tax_rate", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-2 font-['Hanken_Grotesk']">Default Shipping Cost (Rs.)</label>
                <input type="number" step="1" min="0" value={settings.shipping_cost || ""} onChange={(e) => update("shipping_cost", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-2 font-['Hanken_Grotesk']">Free Shipping Minimum (Rs.)</label>
                <input type="number" step="1" min="0" value={settings.free_shipping_min || ""} onChange={(e) => update("free_shipping_min", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
              </div>

              <button type="submit" disabled={saving}
                className="bg-[#062437] text-white px-8 py-3 rounded-full text-xs uppercase tracking-[0.15em] hover:bg-[#1f3a4d] transition-all duration-500 font-['Hanken_Grotesk'] disabled:opacity-50">
                {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
              </button>
            </div>
          </form>
        </div>

        {/* Read-only SMTP */}
        <div>
          <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px]">
            <div className="bg-white rounded-[19px] p-8 space-y-6">
              <h2 className="font-serif text-2xl text-[#062437]">Email (SMTP)</h2>
              <p className="font-['Hanken_Grotesk'] text-xs text-[#73777d] -mt-4">Configured via environment variables (<code className="text-[#062437] bg-[#faf9fa] px-1.5 py-0.5 rounded text-[10px]">.env</code>)</p>

              {Object.entries(env).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-2 font-['Hanken_Grotesk']">{SMTP_LABELS[key] || key}</label>
                  <div className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] bg-[#faf9fa] text-[#42474c]">
                    {key === "smtp_configured" ? (
                      <span className={value ? "text-[#121e1c]" : "text-[#ba1a1a]"}>
                        {value ? "Configured & Active" : "Not Configured"}
                      </span>
                    ) : (
                      value || "—"
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Confirmation Info */}
          <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px] mt-6">
            <div className="bg-white rounded-[19px] p-8 space-y-4">
              <h2 className="font-serif text-2xl text-[#062437]">Order Confirmation</h2>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#d8e5e2]"></div>
                <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c]">
                  Auto email — sent automatically to customers when an order is placed.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#d8e5e2]"></div>
                <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c]">
                  Shipment notification — sent when tracking is assigned from the order detail page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
