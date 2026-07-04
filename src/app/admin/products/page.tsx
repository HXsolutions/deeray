"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  isActive: boolean
  isFeatured: boolean
  category: { name: string } | null
  variants: { sku: string }[]
  _count?: { variants: number }
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleFeatured = async (id: string, current: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !current }),
    })
    load()
  }

  if (loading) return <div className="text-[#73777d]">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-[#062437]">Products</h1>
        <Link href="/admin/products/new"
          className="bg-[#062437] text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#1f3a4d] transition-colors">
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-[#e3e2e4] rounded-[16px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e3e2e4] bg-[#faf9fa]">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#42474c] font-['Hanken_Grotesk']">Product</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#42474c] font-['Hanken_Grotesk']">Category</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#42474c] font-['Hanken_Grotesk']">Variants</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#42474c] font-['Hanken_Grotesk']">Featured</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#42474c] font-['Hanken_Grotesk']">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#42474c] font-['Hanken_Grotesk']">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[#e3e2e4] hover:bg-[#faf9fa] transition-colors">
                <td className="px-6 py-5">
                  <p className="font-['Hanken_Grotesk'] text-sm text-[#062437]">{p.name}</p>
                  <p className="text-xs text-[#73777d] mt-0.5">{p.variants?.[0]?.sku || "—"}</p>
                </td>
                <td className="px-6 py-5 text-sm text-[#42474c]">{p.category?.name || "—"}</td>
                <td className="px-6 py-5 text-sm text-[#42474c]">{p._count?.variants ?? p.variants?.length ?? 0}</td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => toggleFeatured(p.id, p.isFeatured)}
                    className={`text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest font-medium transition-colors ${
                      p.isFeatured ? "bg-[#062437] text-white" : "bg-[#efedef] text-[#73777d] hover:bg-[#e3e2e4]"
                    }`}
                  >
                    {p.isFeatured ? "Featured" : "Set"}
                  </button>
                </td>
                <td className="px-6 py-5">
                  <span className={`text-[10px] px-2 py-1 uppercase tracking-widest ${p.isActive ? "bg-[#d8e5e2] text-[#121e1c]" : "bg-[#ffdad6] text-[#93000a]"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <Link href={`/admin/products/${p.id}`}
                    className="text-[#062437] text-xs uppercase tracking-widest hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-[#73777d] text-sm">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
