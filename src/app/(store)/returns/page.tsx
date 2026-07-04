import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Returns & Shipping | Deeray",
  description: "Deeray's shipping information, return policy, and exchange process for Pakistan-wide delivery.",
}

export default function ReturnsPage() {
  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.3em] mb-4 block">Policies</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[#062437] mb-8 tracking-tight">Shipping & Returns</h1>

        <div className="space-y-12 font-['Hanken_Grotesk'] text-[#42474c] font-light leading-relaxed">
          {/* Shipping */}
          <section>
            <h2 className="font-serif text-2xl text-[#062437] font-normal mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <p>
                We offer Pakistan-wide delivery through our trusted courier partners including 
                TCS, Leopards, and Trax. Delivery times vary by location:
              </p>
              <ul className="space-y-2 pl-6">
                <li className="list-disc"><strong className="text-[#062437] font-medium">Major Cities</strong> (Karachi, Lahore, Islamabad) — 2–3 business days</li>
                <li className="list-disc"><strong className="text-[#062437] font-medium">Other Cities</strong> — 3–5 business days</li>
                <li className="list-disc"><strong className="text-[#062437] font-medium">Remote Areas</strong> — 5–7 business days</li>
              </ul>
              <p>
                Shipping costs are calculated at checkout based on your location and order weight. 
                Orders over Rs. 10,000 qualify for free standard shipping.
              </p>
            </div>
          </section>

          {/* Returns */}
          <section>
            <h2 className="font-serif text-2xl text-[#062437] font-normal mb-4">Return Policy</h2>
            <div className="space-y-4">
              <p>
                We want you to love every product you order from Deeray. If something isn&apos;t right, 
                we&apos;re here to help.
              </p>
              <p>
                <strong className="text-[#062437] font-medium">30-Day Return Window:</strong> You may return 
                any product within 30 days of delivery for a full refund or exchange, provided the 
                item is unused and in its original packaging.
              </p>
              <p>
                <strong className="text-[#062437] font-medium">Condition:</strong> Returned items must be in 
                like-new condition with all original accessories and packaging. Products showing signs 
                of use may be subject to a restocking fee.
              </p>
              <p>
                <strong className="text-[#062437] font-medium">Process:</strong> To initiate a return, please 
                contact us at <span className="text-[#062437]">hello@deeray.store</span> with your order 
                number and reason for return. We will provide a return authorization and shipping instructions.
              </p>
              <p>
                <strong className="text-[#062437] font-medium">Refunds:</strong> Once we receive and inspect 
                your return, we will process your refund within 5–7 business days. Refunds are issued 
                to the original payment method.
              </p>
            </div>
          </section>

          {/* Exchanges */}
          <section>
            <h2 className="font-serif text-2xl text-[#062437] font-normal mb-4">Exchanges</h2>
            <p>
              Need a different variant or size? We&apos;re happy to exchange your item. Contact us at 
              <span className="text-[#062437]"> hello@deeray.store</span> within 30 days of delivery, and 
              we&apos;ll guide you through the exchange process. Shipping costs for exchanges are covered 
              by Deeray for defective or incorrect items.
            </p>
          </section>

          {/* Damaged Items */}
          <section>
            <h2 className="font-serif text-2xl text-[#062437] font-normal mb-4">Damaged or Incorrect Items</h2>
            <p>
              If you receive a damaged or incorrect item, please contact us within 48 hours of delivery 
              at <span className="text-[#062437]">hello@deeray.store</span> with your order number and 
              photos of the damage. We will arrange a replacement or full refund at no additional cost.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
