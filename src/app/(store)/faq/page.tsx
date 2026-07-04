import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ | Deeray",
  description: "Frequently asked questions about Deeray products, ordering, shipping, and returns.",
}

export default function FAQPage() {
  const faqs = [
    {
      q: "How do I place an order?",
      a: "Browse our collections, select your desired products, choose your preferred variant and quantity, and click \"Add to Cart.\" When you're ready, proceed to checkout, enter your shipping details, choose a payment method, and confirm your order.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery (COD) across Pakistan, as well as JazzCash and Easypaisa for online payments. Secure card payments via Stripe are coming soon.",
    },
    {
      q: "How long does delivery take?",
      a: "Delivery times vary by location: 2–3 business days for major cities (Karachi, Lahore, Islamabad), 3–5 business days for other cities, and 5–7 business days for remote areas.",
    },
    {
      q: "Do you offer free shipping?",
      a: "Yes, orders over Rs. 10,000 qualify for free standard shipping anywhere in Pakistan.",
    },
    {
      q: "What is your return policy?",
      a: "We offer a 30-day return window for unused items in original packaging. See our full return policy for details.",
      link: { href: "/returns", label: "View Return Policy" },
    },
    {
      q: "Can I track my order?",
      a: "Yes! Use your order number and email address on our order tracking page to see real-time updates on your shipment.",
      link: { href: "/order-tracking/demo", label: "Track Your Order" },
    },
    {
      q: "How do I care for my Deeray products?",
      a: "Care instructions vary by product. Generally, we recommend cleaning with a soft, damp cloth and avoiding abrasive cleaners. Specific care guides are included with each product.",
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, we only ship within Pakistan. International shipping is coming soon.",
    },
    {
      q: "How can I contact Deeray?",
      a: "You can reach us via email at hello@deeray.store or phone at +92 300 1234567. We aim to respond within 24 hours.",
    },
  ]

  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.3em] mb-4 block">Help</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[#062437] mb-4 tracking-tight">Frequently Asked Questions</h1>
        <p className="font-['Hanken_Grotesk'] text-base text-[#42474c] font-light mb-12">
          Everything you need to know about ordering from Deeray.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-[#e3e2e4] rounded-[16px] p-8">
              <h3 className="font-serif text-xl text-[#062437] mb-3">{faq.q}</h3>
              <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c] font-light leading-relaxed">{faq.a}</p>
              {faq.link && (
                <Link href={faq.link.href} className="inline-block mt-3 font-['Hanken_Grotesk'] text-xs text-[#715b3a] uppercase tracking-[0.15em] hover:text-[#062437] transition-colors">
                  {faq.link.label} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
