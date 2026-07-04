import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: {
    default: "Deeray — Minimal Home Essentials",
    template: "%s | Deeray",
  },
  description: "Thoughtfully designed home essentials for the modern space. Minimal, functional, refined.",
  openGraph: {
    title: "Deeray — Minimal Home Essentials",
    description: "Thoughtfully designed home essentials for the modern space. Minimal, functional, refined.",
    siteName: "Deeray",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
