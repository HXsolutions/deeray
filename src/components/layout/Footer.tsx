import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#062437] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-10">
          <div className="md:col-span-4">
            <Link href="/" className="font-serif text-4xl lowercase mb-6 block tracking-tight">
              deeray
            </Link>
            <p className="text-white/40 font-['Hanken_Grotesk'] text-sm leading-relaxed max-w-sm font-light">
              Curating the future of domestic environments with precision, poise, and architectural integrity. Every piece, a statement. Every detail, intentional.
            </p>
            <div className="mt-8 flex gap-6">
              <a href="https://instagram.com/deeray.studio" target="_blank" rel="noreferrer noopener" className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors">Instagram</a>
              <a href="https://facebook.com/deeray.studio" target="_blank" rel="noreferrer noopener" className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors">Facebook</a>
            </div>
          </div>

          <div className="md:col-span-3">
            <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] tracking-[0.3em] uppercase mb-8 block">Services</span>
            <nav className="flex flex-col gap-4">
              <Link href="/order-tracking/demo" className="font-['Hanken_Grotesk'] text-sm text-white/50 hover:text-white transition-all duration-300 font-light">
                Order Tracking
              </Link>
              <Link href="/returns" className="font-['Hanken_Grotesk'] text-sm text-white/50 hover:text-white transition-all duration-300 font-light">
                Shipping Information
              </Link>
              <Link href="/returns" className="font-['Hanken_Grotesk'] text-sm text-white/50 hover:text-white transition-all duration-300 font-light">
                Returns & Exchanges
              </Link>
              <Link href="/faq" className="font-['Hanken_Grotesk'] text-sm text-white/50 hover:text-white transition-all duration-300 font-light">
                FAQ
              </Link>
            </nav>
          </div>

          <div className="md:col-span-2">
            <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] tracking-[0.3em] uppercase mb-8 block">Company</span>
            <nav className="flex flex-col gap-4">
              <Link href="/about" className="font-['Hanken_Grotesk'] text-sm text-white/50 hover:text-white transition-all duration-300 font-light">
                About Us
              </Link>
              <Link href="/blog" className="font-['Hanken_Grotesk'] text-sm text-white/50 hover:text-white transition-all duration-300 font-light">
                Journal
              </Link>
              <Link href="/privacy" className="font-['Hanken_Grotesk'] text-sm text-white/50 hover:text-white transition-all duration-300 font-light">
                Privacy Policy
              </Link>
              <Link href="/terms" className="font-['Hanken_Grotesk'] text-sm text-white/50 hover:text-white transition-all duration-300 font-light">
                Terms of Use
              </Link>
            </nav>
          </div>

          <div className="md:col-span-3">
            <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] tracking-[0.3em] uppercase mb-8 block">Contact</span>
            <div className="space-y-4">
              <p className="font-['Hanken_Grotesk'] text-sm text-white/50 font-light">
                Pakistan-wide Delivery
              </p>
              <p className="font-['Hanken_Grotesk'] text-sm text-white/50 font-light">
                hello@deeray.store
              </p>
              <p className="font-['Hanken_Grotesk'] text-sm text-white/50 font-light">
                +92 300 1234567
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 font-['Hanken_Grotesk'] text-[9px] uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} DEERAY STUDIO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <span className="font-['Hanken_Grotesk'] text-[9px] text-white/20 uppercase tracking-widest">VISA</span>
            <span className="font-['Hanken_Grotesk'] text-[9px] text-white/20 uppercase tracking-widest">MASTERCARD</span>
            <span className="font-['Hanken_Grotesk'] text-[9px] text-white/20 uppercase tracking-widest">APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
