"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  category: string
  price: number
  image: string
}

function formatPrice(price: number) {
  return "Rs. " + price.toLocaleString("en-IN")
}

const descriptions: Record<string, string> = {
  pure: "Optimized for clean air and water — advanced filtration technology meets minimalist design. Every product in this collection is engineered to improve the fundamental elements of your living environment.",
  shield: "Hygiene solutions for the modern home. Thoughtfully designed to help you maintain a cleaner, healthier living space without compromising on aesthetic integrity.",
  aura: "Ambient design that transforms spaces into sanctuaries. Light, texture, and form converge to create atmospheres of calm and intention.",
  carry: "Practical drinkware for the mindful lifestyle. Premium materials and precision engineering ensure your daily hydration rituals are elevated.",
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const cat = slug.toUpperCase()
  const description = descriptions[slug] || "Discover our curated selection"
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products/category/${slug}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className="pb-32">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.2em]">{cat}</span>
          <span className="w-px h-4 bg-[#e3e2e4]" />
          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#73777d] uppercase tracking-[0.2em]">Collection</span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-[#062437] mb-4 tracking-tight">
          Deeray {cat}
        </h1>
        <p className="font-['Hanken_Grotesk'] text-[15px] text-[#42474c] font-light max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      {loading ? (
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d]">Loading...</p>
      ) : products.length === 0 ? (
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d]">No products in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px] h-full">
                <div className="bg-white rounded-[19px] overflow-hidden h-full transition-all duration-500">
                  <div className="aspect-[4/5] bg-[#f4f3f5] relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-10 md:p-14 group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8">
                    <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.2em]">
                      {product.category}
                    </span>
                    <h2 className="font-serif text-2xl text-[#062437] mt-2 mb-1">{product.name}</h2>
                    <p className="font-['Hanken_Grotesk'] text-lg text-[#062437]/50 font-light">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
