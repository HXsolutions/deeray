"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"

const CART_ICON = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
)

const X_ICON = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = useCallback(() => {
    fetch("/api/cart/count")
      .then((r) => r.json())
      .then((data) => setCartCount(data.count || 0))
      .catch(() => {})
  }, [])

  useEffect(() => {
    refreshCartCount()
    window.addEventListener("cart-updated", refreshCartCount)
    return () => window.removeEventListener("cart-updated", refreshCartCount)
  }, [refreshCartCount])

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-6">
        <div
          className={`flex items-center justify-between w-full max-w-7xl px-8 h-16 rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            scrolled || menuOpen
              ? "bg-[#062437]/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(6,36,55,0.3)] border border-white/10"
              : "bg-[#062437]/40 backdrop-blur-lg border border-white/10"
          }`}
        >
          <Link href="/" className="font-serif text-2xl text-white lowercase tracking-tight">
            deeray
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/collections"
              className="font-['Hanken_Grotesk'] text-[11px] text-white/70 hover:text-white transition-all duration-300 uppercase tracking-[0.2em]"
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="font-['Hanken_Grotesk'] text-[11px] text-white/70 hover:text-white transition-all duration-300 uppercase tracking-[0.2em]"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="font-['Hanken_Grotesk'] text-[11px] text-white/70 hover:text-white transition-all duration-300 uppercase tracking-[0.2em]"
            >
              Journal
            </Link>
            <Link
              href="/search"
              className="font-['Hanken_Grotesk'] text-[11px] text-white/70 hover:text-white transition-all duration-300 uppercase tracking-[0.2em]"
            >
              Search
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative text-white/80 hover:text-white transition-colors" title="Cart">
              {CART_ICON}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full bg-white text-[10px] font-bold text-[#062437] flex items-center justify-center font-['Hanken_Grotesk'] leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-6 h-6 flex items-center justify-center text-white md:hidden"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Menu</span>
              {menuOpen ? X_ICON : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-[#062437] backdrop-blur-3xl" />
        <div className="relative h-full flex flex-col items-center justify-center gap-4 md:gap-6 overflow-y-auto py-20">
          {/* Collections group */}
          <div className="flex flex-col items-center gap-3"
            style={{
              transitionDuration: "0.6s",
              transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
              transitionDelay: menuOpen ? "0ms" : "0ms",
              transitionProperty: "all",
              transform: menuOpen ? "translateY(0) scale(1)" : "translateY(40px) scale(0.9)",
              opacity: menuOpen ? 1 : 0,
            }}
          >
            <Link
              href="/collections"
              onClick={() => setMenuOpen(false)}
              className="font-serif text-3xl md:text-5xl text-white/90 hover:text-white lowercase tracking-tight"
            >
              Collections
            </Link>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { href: "/collections/pure", label: "Pure" },
                { href: "/collections/shield", label: "Shield" },
                { href: "/collections/aura", label: "Aura" },
                { href: "/collections/carry", label: "Carry" },
              ].map((cat, i) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-5 py-2 border border-white/15 text-white/60 hover:text-white hover:border-white/40 rounded-full font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em]"
                  style={{
                    transitionDuration: "0.6s",
                    transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
                    transitionDelay: menuOpen ? `${(i + 1) * 70}ms` : "0ms",
                    transitionProperty: "all",
                  }}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {[
            { href: "/about", label: "About" },
            { href: "/blog", label: "Journal" },
            { href: "/contact", label: "Contact" },
            { href: "/search", label: "Search" },
          ].map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-serif text-3xl md:text-5xl text-white/90 hover:text-white lowercase tracking-tight"
              style={{
                transitionDuration: "0.6s",
                transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
                transitionDelay: menuOpen ? `${(i + 2) * 70}ms` : "0ms",
                transitionProperty: "all",
                transform: menuOpen ? "translateY(0) scale(1)" : "translateY(40px) scale(0.9)",
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/collections"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center gap-3 border border-white/20 text-white rounded-full px-8 md:px-10 h-[44px] md:h-[50px] font-['Hanken_Grotesk'] text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-[#062437]"
            style={{
              transitionDuration: "0.6s",
              transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
              transitionDelay: menuOpen ? "560ms" : "0ms",
              transitionProperty: "all",
              transform: menuOpen ? "translateY(0) scale(1)" : "translateY(40px) scale(0.9)",
              opacity: menuOpen ? 1 : 0,
            }}
          >
            Shop Now
          </Link>
        </div>
      </div>
    </>
  )
}
