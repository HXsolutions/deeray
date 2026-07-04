"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = useCallback(async (q?: string) => {
    const term = q || query
    if (!term.trim()) return
    setSearched(true)
    const res = await fetch(`/api/products/search?q=${encodeURIComponent(term)}`)
    const data = await res.json()
    setResults(data.products || [])
  }, [query])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q")
    if (q) { setQuery(q); handleSearch(q) }
  }, [handleSearch])

  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-[#062437] mb-8 tracking-tight">Search</h1>

        <div className="flex gap-3 mb-12">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 border border-[#e3e2e4] rounded-full px-8 py-5 text-sm focus:outline-none focus:border-[#062437] font-['Hanken_Grotesk'] transition-colors"
          />
          <button onClick={() => handleSearch()}
            className="bg-[#062437] text-white rounded-full px-10 py-5 text-xs uppercase tracking-[0.2em] hover:bg-[#1f3a4d] transition-all duration-500 font-['Hanken_Grotesk']">
            Search
          </button>
        </div>

        {!searched && (
          <p className="text-[#73777d] font-['Hanken_Grotesk'] text-sm font-light">
            Type above and press enter to search products across all collections.
          </p>
        )}

        {searched && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#73777d] font-['Hanken_Grotesk'] text-lg font-light">
              No results found for &ldquo;{query}&rdquo;.
            </p>
            <p className="text-[#73777d] font-['Hanken_Grotesk'] text-sm mt-2 font-light">
              Try a different search term or browse our collections.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((p: any) => (
            <Link key={p.id} href={`/products/${p.slug}`}
              className="group flex gap-5 bg-white border border-[#e3e2e4] rounded-[20px] p-5 hover:border-[#062437]/30 transition-all duration-500">
              {p.images?.[0] && (
                <div className="w-24 h-24 bg-[#f4f3f5] rounded-xl relative flex-shrink-0 overflow-hidden">
                  <Image src={p.images[0]} alt={p.name} fill className="object-contain p-3" />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <p className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.2em] mb-1">{p.category?.name}</p>
                <p className="font-['Hanken_Grotesk'] text-sm text-[#062437] group-hover:text-[#1f3a4d] transition-colors">{p.name}</p>
                {p.variants?.[0] && (
                  <p className="font-serif text-lg text-[#062437] mt-1">Rs. {Number(p.variants[0].price).toLocaleString("en-IN")}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
