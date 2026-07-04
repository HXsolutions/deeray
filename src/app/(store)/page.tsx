"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"

interface FeaturedProduct {
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

function AnimateInView({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const isDragging = useRef(false)

  useEffect(() => {
    fetch("/api/products/featured")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {})
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % products.length)
  }, [products.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length)
  }, [products.length])

  useEffect(() => {
    if (products.length === 0) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide, products.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const handleMouseDown = (e: MouseEvent) => { startX.current = e.pageX; isDragging.current = true }
    const handleMouseUp = () => { isDragging.current = false }
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const walk = e.pageX - startX.current
      if (Math.abs(walk) > 100) { if (walk > 0) prevSlide(); else nextSlide(); isDragging.current = false }
    }
    const handleTouchStart = (e: TouchEvent) => { startX.current = e.touches[0].pageX; isDragging.current = true }
    const handleTouchEnd = () => { isDragging.current = false }
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      const walk = e.touches[0].pageX - startX.current
      if (Math.abs(walk) > 50) { if (walk > 0) prevSlide(); else nextSlide(); isDragging.current = false }
    }

    track.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousemove", handleMouseMove)
    track.addEventListener("touchstart", handleTouchStart)
    track.addEventListener("touchend", handleTouchEnd)
    track.addEventListener("touchmove", handleTouchMove)

    return () => {
      track.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousemove", handleMouseMove)
      track.removeEventListener("touchstart", handleTouchStart)
      track.removeEventListener("touchend", handleTouchEnd)
      track.removeEventListener("touchmove", handleTouchMove)
    }
  }, [nextSlide, prevSlide])

  function getCarouselClass(index: number) {
    const diff = index - currentSlide
    const len = products.length
    if (diff === 0) return "active"
    if (diff === -1 || (currentSlide === 0 && index === len - 1)) return "prev"
    if (diff === 1 || (currentSlide === len - 1 && index === 0)) return "next"
    return "hidden-side"
  }

  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-[#062437]">
        <div className="absolute inset-0 w-full h-full">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida/AP1WRLuVVswmnFXPgnRNIzoZlqbE4knmRIcpymlUgHGVJVHkZtQHImvuyzZ0ZYDdqi9UB0UCqvTa9BKmNiUyTq_dnvMGD6NPUuweXSDTAtICIFqeQuzb45NEtNqz5y1SYoYwzsX5OShh2TuLmNReP4TU5ZhJ6032eMh05Ucm0MpuZP2BYs6vxCljUjg_MsjRRGD2Z5dhOVyL3unQ8DQMEfGVyRxuHqFJqj2KwFGgqjxCc869RG65vFrSos64hWw')",
              animation: "ken-burns 30s ease-out forwards",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#062437]/60 via-[#062437]/30 to-[#062437]" />
        <div className="relative z-10 flex flex-col items-center w-full px-4">
          <AnimateInView>
            <span className="font-['Hanken_Grotesk'] text-[11px] text-white/40 uppercase tracking-[0.3em] mb-8 block text-center">
              Home Essentials — Curated
            </span>
          </AnimateInView>
          <h1 className="text-white font-serif font-bold text-[16vw] md:text-[14vw] leading-none lowercase tracking-[-0.03em] flex items-baseline justify-center w-full select-none">
            {"deeray".split("").map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 80, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.08 }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
          <AnimateInView delay={0.3}>
            <p className="text-white/50 font-['Hanken_Grotesk'] text-sm md:text-base tracking-wider uppercase mt-4 font-light">
              Where Design Meets Purpose
            </p>
          </AnimateInView>
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.8 }}
          >
            <Link
              href="/collections"
              className="group relative inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full pl-8 pr-2 h-[54px] font-['Hanken_Grotesk'] text-[11px] uppercase tracking-[0.25em] hover:bg-white hover:text-[#062437] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              <span>Explore Collection</span>
              <span className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#062437]/10 flex items-center justify-center transition-all duration-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-20 -mt-12 md:-mt-24 px-6 md:px-10 mb-24 md:mb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { num: "01", label: "Pure", title: "Air & Water", slug: "pure", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8hzvY3X-W70t_4YIKIlhecrOAFLr7jcDDFv79hGCbfr8R_8M0uGIHX9KgI1vWKh9yPR378UTlnFzsI-zoS4DTnAJSleSQNRVukvT-l9x2hP84WQL9KWpVIHGnFIlVq2uuuphn5CmiEYNUxnf2ljJGZKVRGRerXtsG20_pCGqi0HSuhh9cTD2uU8_ARqh6YfsRrVhPyzZcN8oB6CjcSINbJATnI5FgYC4cOVJT6rBngdcig0RCMEKx-48TnAGciOSRiapsCFcCjWU" },
            { num: "02", label: "Shield", title: "Hygiene", slug: "shield", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyf-UHsL0KnqrsSrer4JABIhcGsx1fVRMFN7rtQ37ZpvfGadcYwyl2p4TyOCTotF3OhmUGsjrxp-XyYS3DOYCpq-LRiI94doJpi4BIBIH-s9TFI8mquLWlUrB6kZK0_HAZOf7OmTHQrAA7Mq0xHGNSt3-ZkgdKSW6aYyHwijTfcS5dnHqbr4MsGsB1qJ_PJiW0Hd6Pws_zvnoSMLmIEMp9AUZhAO_tVlbPJ1cl-hHnFYL65ELsXlIYqEaI7jlpQ1CJ41-1Kz77naU" },
            { num: "03", label: "Aura", title: "Décor", slug: "aura", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBT94kfTQPJG-P7qZEPuyRTFOQGda8qIYgqIokR0B8eI0KIvsh9iJlogzDnsHP1pBNn_dLRlgncT5yEqp-1Au5dYxB9XG-zwh72o3eaiBeBkI8yciY_qIjbax-L4OvNS_PoEDTmfo2xj1swFJ79113IAvUBH59RZFiHUdgGOPOJtt6OaGrvZlhTL1F04y0LFRFGselBCoSrWtjSAvM5c6UOu5M7P8U6KkEUZQbHMHvHFyh-FYBYa6G9DomHf-CgZAPyLbUUcSWlOJI" },
            { num: "04", label: "Carry", title: "Drinkware", slug: "carry", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCijCnmejkGgkQ_1x9lzLtKt2FJaRKYUqvMLdjHyULDfnAmayz8j3Sh8bXDOoHf_f_bo0qm_Z5Xo9e--ZUP84N4ThCvzNDOXqaGnrBzeONmNIWk1t7TiCGGuEHhGrd3k6BFXMcaRCI6eyRv6FrJXrlCq9UUBllOPOZuT3myGKjOAbEkfyav9RdMzNoEsns2UArQqatCbLIYIu6uv1RKdvQw4FMT_ofAKCNINeA6fJMRbNu8_1NrFhIPlSrQ3xGRiSmKWUUdVqs0Zis" },
          ].map((tile, i) => (
            <Link key={i} href={`/collections/${tile.slug}`}
              className={`relative group h-[400px] md:h-[580px] overflow-hidden rounded-xl bg-[#efedef] ${i === 1 || i === 3 ? "md:translate-y-16" : ""}`}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${tile.bg}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062437]/80 via-[#062437]/30 to-transparent group-hover:from-[#062437]/90 group-hover:via-[#062437]/40 transition-all duration-700" />
              <div className="absolute bottom-8 left-8">
                <span className="text-white font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] opacity-80">{tile.num} — {tile.label}</span>
                <h4 className="text-white font-serif text-2xl mt-1">{tile.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative w-full bg-[#faf9fa] py-28 md:py-36 overflow-hidden">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10">
              <AnimateInView>
                <span className="font-['Hanken_Grotesk'] text-[11px] text-[#715b3a] uppercase tracking-[0.25em] mb-3 block">Selected Pieces</span>
                <div className="flex items-end justify-between">
                  <h2 className="font-serif text-3xl md:text-5xl text-[#062437] leading-[1.1]">
                    <span>The Minimalist Edit</span>
                  </h2>
                  <Link href="/collections"
                    className="hidden md:inline-flex items-center gap-2 font-['Hanken_Grotesk'] text-[11px] text-[#062437] uppercase tracking-[0.2em] pb-1 border-b border-[#062437]/20 hover:border-[#062437] transition-all duration-500">
                    <span>View All</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </AnimateInView>
            </div>

            <div className="relative w-full h-[320px] md:h-[380px] flex items-center justify-center" style={{ perspective: "2000px" }}>
              <div ref={trackRef} className="flex items-center justify-center w-full h-full relative select-none" style={{ transformStyle: "preserve-3d", cursor: "grab" }}>
                {products.map((product, index) => (
                  <Link key={product.id} href={`/products/${product.slug}`}
                    className={`absolute w-[200px] md:w-[300px] flex flex-col items-center transition-all duration-800 ${
                      getCarouselClass(index) === "active" ? "z-30 opacity-100" : getCarouselClass(index) === "prev" || getCarouselClass(index) === "next" ? "z-20 opacity-60" : "opacity-0 pointer-events-none"
                    }`}
                    style={{
                      transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
                      transform: getCarouselClass(index) === "active" ? "translate3d(0, 0, 100px)" : getCarouselClass(index) === "prev" ? "translate3d(-35%, 0, -200px) rotateY(25deg) scale(0.85)" : getCarouselClass(index) === "next" ? "translate3d(35%, 0, -200px) rotateY(-25deg) scale(0.85)" : "translate3d(0, 0, -500px) scale(0.5)",
                    }}
                  >
                    <div className="w-full aspect-[3/4] bg-[#f4f3f5] rounded-2xl overflow-hidden mb-4 shadow-2xl ring-1 ring-black/5">
                      <div className="w-full h-full p-8 md:p-10 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="font-['Hanken_Grotesk'] text-[9px] text-[#715b3a] uppercase mb-1 block tracking-[0.2em]">{product.category}</span>
                      <h3 className="font-serif text-lg md:text-xl text-[#062437] mb-0.5">{product.name}</h3>
                      <p className="font-['Hanken_Grotesk'] text-sm md:text-base text-[#062437]/50 font-light">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

      {/* Brand Statement */}
      <section className="relative bg-[#062437] text-white py-20 md:py-40 px-6 md:px-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-cover bg-center grayscale contrast-125" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDyf-UHsL0KnqrsSrer4JABIhcGsx1fVRMFN7rtQ37ZpvfGadcYwyl2p4TyOCTotF3OhmUGsjrxp-XyYS3DOYCpq-LRiI94doJpi4BIBIH-s9TFI8mquLWlUrB6kZK0_HAZOf7OmTHQrAA7Mq0xHGNSt3-ZkgdKSW6aYyHwijTfcS5dnHqbr4MsGsB1qJ_PJiW0Hd6Pws_zvnoSMLmIEMp9AUZhAO_tVlbPJ1cl-hHnFYL65ELsXlIYqEaI7jlpQ1CJ41-1Kz77naU')" }} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
          <div>
            <h2 className="font-serif text-[2.5rem] md:text-7xl leading-[0.95] mb-8 md:mb-12">
              Your home <br />should <span className="italic">work</span> <br />as well as <br />it <span className="italic">looks.</span>
            </h2>
            <div className="h-px w-32 bg-[#715b3a] mb-12"></div>
          </div>
          <div className="flex flex-col space-y-10">
            <p className="font-['Hanken_Grotesk'] text-lg md:text-xl text-white/70 leading-relaxed font-light">
              At Deeray, we believe that luxury isn&apos;t just about appearance—it&apos;s about the seamless integration of form and utility. Our curation focuses on high-performance home essentials that solve modern living challenges.
            </p>
            <p className="font-['Hanken_Grotesk'] text-lg md:text-xl text-white/70 leading-relaxed font-light border-l border-white/10 pl-10">
              From the air you breathe to the water you consume, every element of the Deeray collection is rigorously tested to ensure it meets our standards of absolute minimalist aesthetic.
            </p>
            <div className="pt-8">
              <Link href="/collections" className="font-['Hanken_Grotesk'] text-white border-b border-[#715b3a] pb-1 uppercase tracking-[0.2em] text-[11px] hover:text-white/70 transition-colors">
                Our Philosophy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#faf9fa] py-28 md:py-36 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <AnimateInView>
            <div className="text-center mb-20">
              <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.3em] mb-4 block">Why Deeray</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[#062437] mb-4">Crafted for Living</h2>
              <p className="font-['Hanken_Grotesk'] text-[15px] text-[#42474c] font-light max-w-lg mx-auto">Three principles guide every piece we curate</p>
            </div>
          </AnimateInView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {[
                { number: "01", title: "Architectural", desc: "Each object is designed with the same rigor as a building — proportion, materiality, and light are never afterthoughts." },
                { number: "02", title: "Enduring", desc: "We select for longevity. Pieces that age gracefully, resist trends, and remain relevant across decades, not seasons." },
                { number: "03", title: "Intentional", desc: "Nothing is superfluous. Every detail serves a purpose, every material is chosen for its integrity and utility." },
              ].map((val, i) => (
                <AnimateInView key={i} delay={i * 0.15}>
                  <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px] h-full">
                    <div className="bg-white rounded-[19px] p-10 h-full">
                      <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.2em] block mb-6">{val.number}</span>
                      <h3 className="font-serif text-2xl text-[#062437] mb-4">{val.title}</h3>
                      <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c] font-light leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                </AnimateInView>
              ))}
            </div>
        </div>
      </section>

      {/* Instagram Strip */}
      <section className="bg-[#F2F0ED] py-24 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <AnimateInView>
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.3em] mb-3 block">Follow Us</span>
                <a href="https://instagram.com/deeray.studio" target="_blank" rel="noreferrer noopener">
                  <h3 className="font-serif text-3xl md:text-4xl text-[#062437] lowercase italic tracking-tight hover:opacity-60 transition-opacity">@deeray.store</h3>
                </a>
              </div>
              <a href="https://instagram.com/deeray.studio" target="_blank" rel="noreferrer noopener" className="hidden md:block font-['Hanken_Grotesk'] text-[11px] text-[#715b3a] tracking-[0.2em] lowercase border-b border-[#715b3a]/20 pb-1 hover:text-[#062437] transition-colors">Instagram</a>
            </div>
          </AnimateInView>
        </div>
        <div className="flex overflow-x-auto gap-4 px-6 md:px-10 pb-4" style={{ scrollbarWidth: "none" }}>
          {[
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDyf-UHsL0KnqrsSrer4JABIhcGsx1fVRMFN7rtQ37ZpvfGadcYwyl2p4TyOCTotF3OhmUGsjrxp-XyYS3DOYCpq-LRiI94doJpi4BIBIH-s9TFI8mquLWlUrB6kZK0_HAZOf7OmTHQrAA7Mq0xHGNSt3-ZkgdKSW6aYyHwijTfcS5dnHqbr4MsGsB1qJ_PJiW0Hd6Pws_zvnoSMLmIEMp9AUZhAO_tVlbPJ1cl-hHnFYL65ELsXlIYqEaI7jlpQ1CJ41-1Kz77naU",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC8hzvY3X-W70t_4YIKIlhecrOAFLr7jcDDFv79hGCbfr8R_8M0uGIHX9KgI1vWKh9yPR378UTlnFzsI-zoS4DTnAJSleSQNRVukvT-l9x2hP84WQL9KWpVIHGnFIlVq2uuuphn5CmiEYNUxnf2ljJGZKVRGRerXtsG20_pCGqi0HSuhh9cTD2uU8_ARqh6YfsRrVhPyzZcN8oB6CjcSINbJATnI5FgYC4cOVJT6rBngdcig0RCMEKx-48TnAGciOSRiapsCFcCjWU",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBT94kfTQPJG-P7qZEPuyRTFOQGda8qIYgqIokR0B8eI0KIvsh9iJlogzDnsHP1pBNn_dLRlgncT5yEqp-1Au5dYxB9XG-zwh72o3eaiBeBkI8yciY_qIjbax-L4OvNS_PoEDTmfo2xj1swFJ79113IAvUBH59RZFiHUdgGOPOJtt6OaGrvZlhTL1F04y0LFRFGselBCoSrWtjSAvM5c6UOu5M7P8U6KkEUZQbHMHvHFyh-FYBYa6G9DomHf-CgZAPyLbUUcSWlOJI",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCijCnmejkGgkQ_1x9lzLtKt2FJaRKYUqvMLdjHyULDfnAmayz8j3Sh8bXDOoHf_f_bo0qm_Z5Xo9e--ZUP84N4ThCvzNDOXqaGnrBzeONmNIWk1t7TiCGGuEHhGrd3k6BFXMcaRCI6eyRv6FrJXrlCq9UUBllOPOZuT3myGKjOAbEkfyav9RdMzNoEsns2UArQqatCbLIYIu6uv1RKdvQw4FMT_ofAKCNINeA6fJMRbNu8_1NrFhIPlSrQ3xGRiSmKWUUdVqs0Zis",
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`min-w-[280px] md:min-w-[320px] h-[380px] md:h-[420px] rounded-[20px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${i % 2 === 0 ? "translate-y-6" : ""}`}
            >
              <img className="w-full h-full object-cover" src={img} alt="" />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
