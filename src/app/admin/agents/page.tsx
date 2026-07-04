"use client"

import { useState, useEffect, FormEvent } from "react"

interface Agent {
  id: string
  name: string
  company: string
  apiKey: string | null
  endpoint: string | null
  isActive: boolean
  createdAt: string
}

const emptyForm = {
  name: "",
  company: "",
  apiKey: "",
  endpoint: "",
}

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [error, setError] = useState("")

  const fetchAgents = async () => {
    const res = await fetch("/api/admin/agents")
    const data = await res.json()
    setAgents(data.agents || [])
    setLoading(false)
  }

  useEffect(() => { fetchAgents() }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    const url = editing ? "/api/admin/agents" : "/api/admin/agents"
    const method = editing ? "PUT" : "POST"
    const body = editing ? { ...form, id: editing } : form

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Failed to save agent")
      return
    }
    setForm(emptyForm)
    setEditing(null)
    fetchAgents()
  }

  const handleEdit = (agent: Agent) => {
    setForm({
      name: agent.name,
      company: agent.company,
      apiKey: "",
      endpoint: agent.endpoint || "",
    })
    setEditing(agent.id)
    setError("")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this delivery agent?")) return
    await fetch(`/api/admin/agents?id=${id}`, { method: "DELETE" })
    fetchAgents()
  }

  const handleToggleActive = async (agent: Agent) => {
    await fetch("/api/admin/agents", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agent.id, name: agent.name, company: agent.company, endpoint: agent.endpoint, isActive: !agent.isActive }),
    })
    fetchAgents()
  }

  const cancelEdit = () => {
    setForm(emptyForm)
    setEditing(null)
    setError("")
  }

  if (loading) return <div className="text-[#73777d] font-['Hanken_Grotesk']">Loading...</div>

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#062437] mb-10">Delivery Agents</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <div>
          <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px]">
            <div className="bg-white rounded-[19px] p-8">
              <h2 className="font-serif text-2xl text-[#062437] mb-6">{editing ? "Edit Agent" : "Add Agent"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-2 font-['Hanken_Grotesk']">Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-2 font-['Hanken_Grotesk']">Company</label>
                  <input type="text" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-2 font-['Hanken_Grotesk']">API Key {editing && <span className="text-[#73777d] normal-case tracking-normal">(leave blank to keep current)</span>}</label>
                  <input type="text" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                    className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-[#73777d] mb-2 font-['Hanken_Grotesk']">Endpoint URL</label>
                  <input type="url" value={form.endpoint} onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
                    className="w-full px-4 py-3 border border-[#e3e2e4] rounded-lg text-sm font-['Hanken_Grotesk'] text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors" />
                </div>
                {error && <p className="text-[#ba1a1a] text-xs font-['Hanken_Grotesk']">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <button type="submit"
                    className="bg-[#062437] text-white px-6 py-3 rounded-full text-xs uppercase tracking-[0.15em] hover:bg-[#1f3a4d] transition-all duration-500 font-['Hanken_Grotesk']">
                    {editing ? "Update Agent" : "Add Agent"}
                  </button>
                  {editing && (
                    <button type="button" onClick={cancelEdit}
                      className="border border-[#e3e2e4] text-[#42474c] px-6 py-3 rounded-full text-xs uppercase tracking-[0.15em] hover:border-[#062437] transition-all duration-500 font-['Hanken_Grotesk']">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Table */}
        <div>
          <div className="bg-white border border-[#e3e2e4] rounded-[20px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e3e2e4]">
                    <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-[#73777d] font-['Hanken_Grotesk']">Name</th>
                    <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-[#73777d] font-['Hanken_Grotesk']">Company</th>
                    <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-[#73777d] font-['Hanken_Grotesk']">Status</th>
                    <th className="text-right px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-[#73777d] font-['Hanken_Grotesk']">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-12 text-[#73777d] text-sm font-['Hanken_Grotesk']">No agents yet.</td></tr>
                  ) : agents.map((agent) => (
                    <tr key={agent.id} className="border-b border-[#e3e2e4] last:border-0 hover:bg-[#faf9fa] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-['Hanken_Grotesk'] text-[#062437]">{agent.name}</p>
                        {agent.endpoint && (
                          <p className="text-[10px] text-[#73777d] font-['Hanken_Grotesk'] mt-0.5 truncate max-w-[200px]">{agent.endpoint}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#42474c]">{agent.company}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleToggleActive(agent)}
                          className={`text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-full border font-['Hanken_Grotesk'] transition-colors ${
                            agent.isActive
                              ? "bg-[#d8e5e2] border-[#b0c7c2] text-[#121e1c]"
                              : "bg-[#e3e2e4] border-[#d1d0d3] text-[#73777d]"
                          }`}>
                          {agent.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(agent)}
                            className="text-[10px] uppercase tracking-[0.1em] text-[#062437] hover:underline font-['Hanken_Grotesk']">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(agent.id)}
                            className="text-[10px] uppercase tracking-[0.1em] text-[#ba1a1a] hover:underline font-['Hanken_Grotesk']">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
