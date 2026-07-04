"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import ReviewSection from "@/components/store/ReviewSection"

interface ProductVariantData {
  id: number
  sku: string
  size: string | null
  color: string | null
  price: number
  comparePrice: number | null
  stock: number
}

interface ProductImageData {
  url: string
  alt: string | null
}

interface ProductData {
  id: string
  name: string
  slug: string
  description: string
  brief: string | null
  brand: string | null
  category: { name: string }
  images: ProductImageData[]
  variants: ProductVariantData[]
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border border-[#e3e2e4] rounded-[16px] overflow-hidden [&::-webkit-details-marker]:hidden">
      <summary className="w-full flex items-center justify-between px-6 py-5 bg-white hover:bg-[#faf9fa] transition-colors text-left cursor-pointer list-none">
        <span className="font-serif text-lg text-[#062437]">{title}</span>
        <svg className="w-4 h-4 text-[#42474c] transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-6 pb-6 bg-white">{children}</div>
    </details>
  )
}

export default function ProductDetailClient({ product }: { product: ProductData }) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const variant = product.variants[selectedVariant]
  const images = product.images.map((img) => img.url)

  const handleAddToCart = useCallback(async () => {
    if (!variant) return
    setAdding(true)
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          variantId: variant.id,
          productId: product.id,
          name: product.name,
          sku: variant.sku,
          price: Number(variant.price),
          quantity,
          image: images[selectedImage],
        }),
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
      window.dispatchEvent(new CustomEvent("cart-updated"))
    } finally {
      setAdding(false)
    }
  }, [variant, quantity, product.id, product.name, images, selectedImage])

  return (
    <div className="min-h-screen bg-[#faf9fa]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-20">
        {/* Top row: Image gallery + Key purchase info */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 min-h-[70vh] lg:min-h-[80vh]">
          {/* Left: Image Gallery */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                      selectedImage === i ? "border-[#062437]" : "border-[#e3e2e4] hover:border-[#062437]/30"
                    }`}
                  >
                    <Image src={img} alt="" width={64} height={80} className="object-contain w-full h-full p-1.5" />
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div className="flex-1 p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[24px]">
                <div className="aspect-[4/5] bg-white rounded-[23px] relative overflow-hidden">
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain p-10 md:p-16"
                    priority
                  />
                </div>
              </div>
            </div>
            {/* Mobile thumbnail strip */}
            <div className="flex md:hidden gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-14 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    selectedImage === i ? "border-[#062437]" : "border-[#e3e2e4]"
                  }`}
                >
                  <Image src={img} alt="" width={56} height={64} className="object-contain w-full h-full p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Purchase Info */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.2em]">
                {product.category.name}
              </span>
              <span className="w-px h-3 bg-[#e3e2e4]" />
              <Link href="/collections" className="font-['Hanken_Grotesk'] text-[10px] text-[#73777d] uppercase tracking-[0.2em] hover:text-[#062437] transition-colors">
                View Collection
              </Link>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl text-[#062437] mb-4 tracking-tight">{product.name}</h1>

            {product.brief && (
              <p className="font-['Hanken_Grotesk'] text-base md:text-lg text-[#42474c] leading-relaxed mb-6 font-light">
                {product.brief}
              </p>
            )}

            {/* Price */}
            <div className="mb-6 py-5 border-y border-[#e3e2e4]">
              <div className="flex items-baseline justify-between">
                <p className="font-serif text-3xl text-[#062437]">
                  Rs. {Number(variant.price).toLocaleString("en-IN")}
                </p>
                <p className="font-['Hanken_Grotesk'] text-xs text-[#73777d]">
                  {variant.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c] mb-3">
                  Select Variant
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVariant(i); setQuantity(1); setAdded(false) }}
                      className={`px-6 py-3 rounded-full text-sm font-['Hanken_Grotesk'] transition-all duration-500 ${
                        selectedVariant === i
                          ? "bg-[#062437] text-white"
                          : "bg-white border border-[#e3e2e4] text-[#42474c] hover:border-[#062437]"
                      }`}
                    >
                      {v.color || v.size || `Variant ${i + 1}`} — Rs. {Number(v.price).toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-4">
              <span className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Qty</span>
              <div className="flex items-center border border-[#e3e2e4] bg-white rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-3 text-[#42474c] hover:bg-[#f4f3f5] transition-colors text-sm"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-2 py-3 text-center border-0 focus:outline-none font-['Hanken_Grotesk'] text-sm"
                />
                <button
                  onClick={() => setQuantity(Math.min(variant.stock, quantity + 1))}
                  className="px-5 py-3 text-[#42474c] hover:bg-[#f4f3f5] transition-colors text-sm"
                  disabled={quantity >= variant.stock}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || variant.stock === 0}
              className="group relative w-full bg-[#062437] text-white py-5 rounded-full font-['Hanken_Grotesk'] text-sm uppercase tracking-[0.2em] hover:bg-[#1f3a4d] transition-all duration-500 disabled:opacity-50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {added ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart
                  </>
                ) : adding ? (
                  "Adding..."
                ) : variant.stock === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    Add to Cart
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </span>
                  </>
                )}
              </span>
            </button>

            {/* Added notification */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                added ? "max-h-20 mt-4" : "max-h-0"
              }`}
            >
              <div className="bg-[#d8e5e2] rounded-full px-6 py-3 flex items-center justify-between">
                <span className="font-['Hanken_Grotesk'] text-sm text-[#121e1c]">{product.name} added to cart</span>
                <Link href="/cart" className="font-['Hanken_Grotesk'] text-xs text-[#062437] uppercase tracking-[0.15em] hover:underline">
                  View Cart &rarr;
                </Link>
              </div>
            </div>

            <Link
              href="/collections"
              className="block w-full text-center py-4 mt-4 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] text-[#42474c] hover:text-[#062437] transition-colors"
            >
              &larr; Back to Collections
            </Link>
          </div>
        </div>

        {/* Bottom section: Accordion details */}
        <div className="max-w-4xl mx-auto mt-16 lg:mt-24 space-y-3">
          <Section title="Full Description">
            <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c] font-light leading-relaxed">
              {product.description}
            </p>
          </Section>

          <Section title="Features & Specifications">
            <div className="space-y-6">
              <table className="w-full text-sm">
                <tbody>
                  {product.variants.length > 0 && (
                    <tr className="border-b border-[#e3e2e4]">
                      <td className="py-3 pr-4 font-['Hanken_Grotesk'] text-[#062437] font-medium w-1/3">Available Options</td>
                      <td className="py-3 font-['Hanken_Grotesk'] text-[#42474c] font-light">
                        {product.variants.map((v) => [v.color, v.size].filter(Boolean).join(", ")).filter(Boolean).join(" | ") || `${product.variants.length} variants`}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-[#e3e2e4]">
                    <td className="py-3 pr-4 font-['Hanken_Grotesk'] text-[#062437] font-medium w-1/3">Brand</td>
                    <td className="py-3 font-['Hanken_Grotesk'] text-[#42474c] font-light">{product.brand || "Deeray"}</td>
                  </tr>
                  <tr className="border-b border-[#e3e2e4]">
                    <td className="py-3 pr-4 font-['Hanken_Grotesk'] text-[#062437] font-medium w-1/3">Category</td>
                    <td className="py-3 font-['Hanken_Grotesk'] text-[#42474c] font-light">{product.category.name}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Shipping & Returns">
            <div className="font-['Hanken_Grotesk'] text-sm text-[#42474c] font-light space-y-3">
              <p>Free shipping on orders over Rs. 10,000. Standard delivery within 3–5 business days across Pakistan.</p>
              <p>30-day return window for unused items in original packaging.</p>
              <Link href="/returns" className="text-[#062437] font-medium hover:underline">View full Shipping & Return Policy &rarr;</Link>
            </div>
          </Section>

          {/* Reviews */}
          <div className="pt-8">
            <ReviewSection productId={product.slug} />
          </div>
        </div>
      </div>
    </div>
  )
}
