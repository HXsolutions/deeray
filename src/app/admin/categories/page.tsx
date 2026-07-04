"use client"

import { useEffect, useState } from "react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parent: { id: string; name: string } | null
  _count: { products: number }
}

interface CategoryForm {
  name: string
  slug: string
  description: string
  image: string
  parentId: string
}

const emptyForm: CategoryForm = { name: "", slug: "", description: "", image: "", parentId: "" }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
      })
      if (!res.ok) return
      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      parentId: cat.parent?.id || "",
    })
    setEditingId(cat.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" })
    load()
  }

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

  const parentOptions = categories.filter((c) => c.id !== editingId)

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl text-[#062437]">Categories</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true) }}
          className="px-5 py-2.5 bg-[#062437] text-white font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.15em] rounded-full hover:bg-[#0a3550] transition-colors"
        >
          Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 bg-[#faf9fa] border border-[#e3e2e4] rounded-[16px] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Image URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors"
              />
            </div>
            <div>
              <label className="block font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-1.5">Parent Category</label>
              <select
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e3e2e4] rounded-lg font-['Hanken_Grotesk'] text-sm text-[#062437] bg-white outline-none focus:border-[#062437] transition-colors"
              >
                <option value="">None (Top-level)</option>
                {parentOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#062437] text-white font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.15em] rounded-full hover:bg-[#0a3550] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
              className="px-6 py-2.5 border border-[#e3e2e4] font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.15em] text-[#42474c] rounded-full hover:bg-[#faf9fa] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d]">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d]">No categories yet.</p>
      ) : (
        <div className="bg-white border border-[#e3e2e4] rounded-[16px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3e2e4] bg-[#faf9fa]">
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Name</th>
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Slug</th>
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Parent</th>
                <th className="text-center px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Products</th>
                <th className="text-right px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-[#e3e2e4] last:border-0 hover:bg-[#faf9fa] transition-colors">
                  <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#062437]">{cat.name}</td>
                  <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#42474c]">{cat.slug}</td>
                  <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#73777d]">{cat.parent?.name || "—"}</td>
                  <td className="px-6 py-4 text-center font-['Hanken_Grotesk'] text-[#062437]">{cat._count.products}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="px-3 py-1.5 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.15em] text-[#42474c] hover:text-[#062437] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="px-3 py-1.5 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.15em] text-[#93000a] hover:text-[#b0000a] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
