"use client"

import { useState, useEffect, FormEvent } from "react"

interface BankAccount {
  bank: string
  name: string
  acc: string
  iban: string
}

interface PGConfig {
  enabled: boolean
  merchant_id: string
  password?: string
  salt?: string
  secret?: string
  endpoint: string
}

interface PaymentGateway {
  jazzcash: PGConfig
  easypaisa: PGConfig
}

const SMTP_LABELS: Record<string, string> = {
  smtp_host: "SMTP Host",
  smtp_port: "SMTP Port",
  smtp_user: "SMTP Username",
  smtp_from: "From Address",
  smtp_configured: "Status",
}

const emptyAccount = { bank: "", name: "", acc: "", iban: "" }

const defaultPG: PaymentGateway = {
  jazzcash: { enabled: false, merchant_id: "", password: "", salt: "", endpoint: "https://sandbox.jazzcash.com.pk/TransactionPost.aspx" },
  easypaisa: { enabled: false, merchant_id: "", secret: "", endpoint: "https://easypaisa.com.pk/easypay/Index.aspx" },
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [env, setEnv] = useState<Record<string, string | boolean>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [banks, setBanks] = useState<BankAccount[]>([])
  const [editingBank, setEditingBank] = useState<BankAccount>(emptyAccount)
  const [bankIndex, setBankIndex] = useState<number | null>(null)
  const [pg, setPg] = useState<PaymentGateway>(defaultPG)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings || {})
        setEnv(data.env || {})
        setBanks(data.settings?.bank_accounts || [])
        const savedPG = data.settings?.payment_gateway
        if (savedPG) setPg(typeof savedPG === "string" ? JSON.parse(savedPG) : savedPG)
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
      body: JSON.stringify({ ...settings, bank_accounts: banks, payment_gateway: pg }),
    })
    if (res.ok) setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const addBank = () => {
    if (!editingBank.bank || !editingBank.acc) return
    if (bankIndex !== null) {
      const next = [...banks]
      next[bankIndex] = editingBank
      setBanks(next)
    } else {
      setBanks([...banks, editingBank])
    }
    setEditingBank(emptyAccount)
    setBankIndex(null)
  }

  const editBank = (i: number) => {
    setEditingBank(banks[i])
    setBankIndex(i)
  }

  const removeBank = (i: number) => setBanks(banks.filter((_, idx) => idx !== i))

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

          {/* Bank Accounts */}
          <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px] mt-6">
            <div className="bg-white rounded-[19px] p-8 space-y-6">
              <h2 className="font-serif text-2xl text-[#062437]">Bank Accounts</h2>
              <p className="font-['Hanken_Grotesk'] text-xs text-[#73777d] -mt-4">Shown to customers who select Bank Transfer at checkout.</p>

              {banks.length > 0 && (
                <div className="space-y-3">
                  {banks.map((b, i) => (
                    <div key={i} className="flex items-start justify-between p-4 bg-[#faf9fa] rounded-xl border border-[#e3e2e4]">
                      <div className="text-sm font-['Hanken_Grotesk']">
                        <p className="font-medium text-[#062437]">{b.bank}</p>
                        <p className="text-[#42474c]">{b.name}</p>
                        <p className="text-[#42474c]">A/C: {b.acc}</p>
                        <p className="text-[#42474c] text-[11px]">IBAN: {b.iban}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editBank(i)} className="text-[10px] uppercase tracking-widest text-[#062437] hover:underline font-['Hanken_Grotesk']">Edit</button>
                        <button onClick={() => removeBank(i)} className="text-[10px] uppercase tracking-widest text-[#ba1a1a] hover:underline font-['Hanken_Grotesk']">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-[#e3e2e4] pt-6 space-y-4">
                <h3 className="font-['Hanken_Grotesk'] text-xs font-medium text-[#062437]">{bankIndex !== null ? "Edit Account" : "Add Account"}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Bank Name" value={editingBank.bank} onChange={(e) => setEditingBank({ ...editingBank, bank: e.target.value })}
                    className="col-span-2 px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
                  <input type="text" placeholder="Account Title" value={editingBank.name} onChange={(e) => setEditingBank({ ...editingBank, name: e.target.value })}
                    className="col-span-2 px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
                  <input type="text" placeholder="Account Number" value={editingBank.acc} onChange={(e) => setEditingBank({ ...editingBank, acc: e.target.value })}
                    className="px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
                  <input type="text" placeholder="IBAN" value={editingBank.iban} onChange={(e) => setEditingBank({ ...editingBank, iban: e.target.value })}
                    className="px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={addBank}
                    className="bg-[#062437] text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.15em] hover:bg-[#1f3a4d] transition-all duration-500 font-['Hanken_Grotesk']">
                    {bankIndex !== null ? "Update" : "Add"}
                  </button>
                  {bankIndex !== null && (
                    <button type="button" onClick={() => { setEditingBank(emptyAccount); setBankIndex(null) }}
                      className="border border-[#e3e2e4] text-[#42474c] px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.15em] hover:border-[#062437] transition-all duration-500 font-['Hanken_Grotesk']">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Gateway */}
          <div className="lg:col-span-2">
            <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px]">
              <div className="bg-white rounded-[19px] p-8 space-y-6">
                <h2 className="font-serif text-2xl text-[#062437]">Payment Gateway</h2>
                <p className="font-['Hanken_Grotesk'] text-xs text-[#73777d] -mt-4">Configure JazzCash &amp; Easypaisa for redirect-based payment at checkout.</p>

                {(["jazzcash", "easypaisa"] as const).map((gw) => (
                  <div key={gw} className="border border-[#e3e2e4] rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Hanken_Grotesk'] text-sm font-semibold text-[#062437] uppercase tracking-wider">{gw}</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={pg[gw].enabled} onChange={(e) => setPg({ ...pg, [gw]: { ...pg[gw], enabled: e.target.checked } })}
                          className="sr-only peer" />
                        <div className="w-10 h-5 bg-[#e3e2e4] rounded-full peer peer-checked:bg-[#121e1c] transition-colors after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-[19px]" />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm font-['Hanken_Grotesk']">
                      <div className="col-span-2">
                        <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-1">Merchant ID</label>
                        <input type="text" value={pg[gw].merchant_id} onChange={(e) => setPg({ ...pg, [gw]: { ...pg[gw], merchant_id: e.target.value } })}
                          className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm outline-none focus:border-[#062437] transition-colors bg-white text-[#062437]" />
                      </div>
                      {gw === "jazzcash" ? (
                        <>
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-1">Password</label>
                            <input type="text" value={pg[gw].password || ""} onChange={(e) => setPg({ ...pg, [gw]: { ...pg[gw], password: e.target.value } })}
                              className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm outline-none focus:border-[#062437] transition-colors bg-white text-[#062437]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-1">Integrity Salt</label>
                            <input type="text" value={pg[gw].salt || ""} onChange={(e) => setPg({ ...pg, [gw]: { ...pg[gw], salt: e.target.value } })}
                              className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm outline-none focus:border-[#062437] transition-colors bg-white text-[#062437]" />
                          </div>
                        </>
                      ) : (
                        <div className="col-span-2">
                          <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-1">Secret Key</label>
                          <input type="text" value={pg[gw].secret || ""} onChange={(e) => setPg({ ...pg, [gw]: { ...pg[gw], secret: e.target.value } })}
                            className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm outline-none focus:border-[#062437] transition-colors bg-white text-[#062437]" />
                        </div>
                      )}
                      <div className="col-span-2">
                        <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-1">Endpoint URL</label>
                        <input type="text" value={pg[gw].endpoint} onChange={(e) => setPg({ ...pg, [gw]: { ...pg[gw], endpoint: e.target.value } })}
                          className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm outline-none focus:border-[#062437] transition-colors bg-white text-[#062437]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
