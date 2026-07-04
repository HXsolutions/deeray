import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Deeray",
  description: "Deeray's privacy policy — how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.3em] mb-4 block">Legal</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[#062437] mb-8 tracking-tight">Privacy Policy</h1>
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d] mb-12">Last updated: January 2025</p>

        <div className="font-['Hanken_Grotesk'] text-[#42474c] font-light leading-relaxed space-y-6">
          <p>
            At Deeray, we take your privacy seriously. This policy describes how we collect, use, 
            and protect your personal information when you use our website and services.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Information We Collect</h2>
          <p>
            <strong className="text-[#062437] font-medium">Information you provide:</strong> When you place an order, 
            we collect your name, email address, phone number, and shipping address. When you submit 
            a product review, we collect your name and email address.
          </p>
          <p>
            <strong className="text-[#062437] font-medium">Information automatically collected:</strong> We collect 
            basic analytics data including pages visited, time spent on site, and device information 
            through Google Analytics 4. This data is anonymized and used solely to improve our website.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">How We Use Your Information</h2>
          <ul className="space-y-2 pl-6">
            <li className="list-disc">Process and fulfill your orders</li>
            <li className="list-disc">Communicate about your order status</li>
            <li className="list-disc">Improve our products and website experience</li>
            <li className="list-disc">Send occasional promotional emails (only with your consent)</li>
          </ul>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Data Protection</h2>
          <p>
            We implement industry-standard security measures to protect your personal information. 
            All payment transactions are encrypted using SSL technology. We do not store credit 
            card information — payments are processed securely through our payment partners.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share 
            necessary information with trusted service providers (shipping carriers, payment processors) 
            solely for order fulfillment purposes.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data at any time. 
            To exercise these rights, please contact us at <span className="text-[#062437]">hello@deeray.store</span>.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Contact</h2>
          <p>
            If you have questions about this privacy policy, please reach out to us at 
            <span className="text-[#062437]"> hello@deeray.store</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
