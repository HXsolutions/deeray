import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use | Deeray",
  description: "Deeray's terms and conditions governing the use of our website and services.",
}

export default function TermsPage() {
  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.3em] mb-4 block">Legal</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[#062437] mb-8 tracking-tight">Terms of Use</h1>
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d] mb-12">Last updated: January 2025</p>

        <div className="font-['Hanken_Grotesk'] text-[#42474c] font-light leading-relaxed space-y-6">
          <p>
            By using the Deeray website and services, you agree to the following terms and conditions. 
            Please read them carefully before placing an order.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Account Registration</h2>
          <p>
            When you create an account, you are responsible for maintaining the confidentiality of 
            your login credentials. You agree to provide accurate, current, and complete information 
            during the registration process.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Orders and Payment</h2>
          <p>
            All orders are subject to availability and confirmation of payment. We reserve the right 
            to refuse or cancel any order for any reason, including but not limited to product 
            availability, pricing errors, or suspected fraud.
          </p>
          <p>
            Prices are listed in Pakistani Rupees (PKR) and inclusive of applicable taxes. Payment 
            must be received in full before orders are processed.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Product Information</h2>
          <p>
            We make every effort to display product images and descriptions accurately. However, 
            colors and specifications may vary slightly from what appears on your screen. We 
            reserve the right to modify product specifications without prior notice.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Intellectual Property</h2>
          <p>
            All content on this website — including text, images, logos, and design — is the 
            property of Deeray Studio and is protected by applicable intellectual property laws. 
            You may not reproduce, distribute, or use our content without prior written permission.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Limitation of Liability</h2>
          <p>
            Deeray Studio shall not be liable for any indirect, incidental, or consequential 
            damages arising from the use of our products or website, to the fullest extent 
            permitted by law.
          </p>

          <h2 className="font-serif text-2xl text-[#062437] font-normal pt-6">Contact</h2>
          <p>
            For questions about these terms, please contact us at 
            <span className="text-[#062437]"> hello@deeray.store</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
