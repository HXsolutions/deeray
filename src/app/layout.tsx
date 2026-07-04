import type { Metadata } from "next"
import "./globals.css"
import Analytics from "@/components/Analytics"

export const metadata: Metadata = {
  title: {
    default: "Deeray — Minimalist Home Essentials",
    template: "%s | Deeray",
  },
  description: "Curating the future of domestic environments with precision, poise, and architectural integrity.",
  openGraph: {
    title: "Deeray — Minimalist Home Essentials",
    description: "Curating the future of domestic environments with precision, poise, and architectural integrity.",
    siteName: "Deeray",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Deeray", description: "Curating the future of domestic environments." },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png" }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Hanken+Grotesk:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased film-grain">
        <Analytics />
        {children}
      </body>
    </html>
  )
}
