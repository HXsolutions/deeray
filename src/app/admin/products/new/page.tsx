"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminProductNew() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [form, setForm] = useState({
    name: "", slug: "", brief: "", description: "", categoryId: "", brand: "", isFeatured: false,
  })
  const [images, setImages] = useState<string[]>([])
  const [variants, setVariants] = useState([{ sku: "", price: 0, comparePrice: 0, stock: 0, size: "", color: "" }])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((data) => setCategories(data.categories))
  }, [])

  const addVariant = () => setVariants([...variants, { sku: "", price: 0, comparePrice: 0, stock: 0, size: "", color: "" }])

  const updateVariant = (i: number, field: string, value: any) => {
    const updated = [...variants]
    ;(updated[i] as any)[field] = value
    setVariants(updated)
  }

  const removeVariant = (i: number) => {
    if (variants.length <= 1) return
    setVariants(variants.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images: images.filter(Boolean), variants }),
      })
      if (res.ok) router.push("/admin/products")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#062437] mb-8">New Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-[#e3e2e4] p-6">
            <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Details</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Product Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]" />
              <input type="text" placeholder="Slug *" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]" />
              <input type="text" placeholder="Brief description" value={form.brief} onChange={(e) => setForm({ ...form, brief: e.target.value })}
                className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]" />
              <textarea placeholder="Full description *" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437] h-32" />
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]">
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]" />
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="accent-[#062437]" />
                Featured Product
              </label>
            </div>
          </div>

          <div className="bg-white border border-[#e3e2e4] p-6">
            <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Images (URLs)</h3>
            {images.map((url, i) => (
              <input key={i} type="text" placeholder={`Image URL ${i + 1}`} value={url} onChange={(e) => {
                const updated = [...images]; updated[i] = e.target.value; setImages(updated)
              }} className="w-full border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437] mb-3" />
            ))}
            <button type="button" onClick={() => setImages([...images, ""])}
              className="text-[#062437] text-xs uppercase tracking-widest hover:underline">+ Add Image</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#e3e2e4] p-6">
            <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">Variants</h3>
            {variants.map((v, i) => (
              <div key={i} className="p-4 mb-4 border border-[#e3e2e4]">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="SKU *" required value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    className="col-span-2 border border-[#e3e2e4] px-3 py-2 text-sm focus:outline-none focus:border-[#062437]" />
                  <input type="number" placeholder="Price" value={v.price || ""} onChange={(e) => updateVariant(i, "price", parseFloat(e.target.value) || 0)}
                    className="border border-[#e3e2e4] px-3 py-2 text-sm focus:outline-none focus:border-[#062437]" />
                  <input type="number" placeholder="Compare Price" value={v.comparePrice || ""} onChange={(e) => updateVariant(i, "comparePrice", parseFloat(e.target.value) || 0)}
                    className="border border-[#e3e2e4] px-3 py-2 text-sm focus:outline-none focus:border-[#062437]" />
                  <input type="number" placeholder="Stock" value={v.stock || ""} onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
                    className="border border-[#e3e2e4] px-3 py-2 text-sm focus:outline-none focus:border-[#062437]" />
                  <input type="text" placeholder="Size" value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)}
                    className="border border-[#e3e2e4] px-3 py-2 text-sm focus:outline-none focus:border-[#062437]" />
                  <input type="text" placeholder="Color" value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)}
                    className="border border-[#e3e2e4] px-3 py-2 text-sm focus:outline-none focus:border-[#062437]" />
                </div>
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)}
                    className="mt-3 text-[#ba1a1a] text-xs uppercase tracking-widest hover:underline">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addVariant}
              className="text-[#062437] text-xs uppercase tracking-widest hover:underline">+ Add Variant</button>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-[#062437] text-white py-4 text-xs uppercase tracking-widest hover:bg-[#1f3a4d] disabled:opacity-50">
            {saving ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
