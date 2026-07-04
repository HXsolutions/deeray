import Link from "next/link"

const categories = [
  { label: "PURE", title: "Air & Water", desc: "Pure air, pure water — engineered filtration for the modern home", slug: "pure", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8hzvY3X-W70t_4YIKIlhecrOAFLr7jcDDFv79hGCbfr8R_8M0uGIHX9KgI1vWKh9yPR378UTlnFzsI-zoS4DTnAJSleSQNRVukvT-l9x2hP84WQL9KWpVIHGnFIlVq2uuuphn5CmiEYNUxnf2ljJGZKVRGRerXtsG20_pCGqi0HSuhh9cTD2uU8_ARqh6YfsRrVhPyzZcN8oB6CjcSINbJATnI5FgYC4cOVJT6rBngdcig0RCMEKx-48TnAGciOSRiapsCFcCjWU" },
  { label: "SHIELD", title: "Hygiene", desc: "Advanced hygiene solutions for the conscious, modern lifestyle", slug: "shield", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyf-UHsL0KnqrsSrer4JABIhcGsx1fVRMFN7rtQ37ZpvfGadcYwyl2p4TyOCTotF3OhmUGsjrxp-XyYS3DOYCpq-LRiI94doJpi4BIBIH-s9TFI8mquLWlUrB6kZK0_HAZOf7OmTHQrAA7Mq0xHGNSt3-ZkgdKSW6aYyHwijTfcS5dnHqbr4MsGsB1qJ_PJiW0Hd6Pws_zvnoSMLmIEMp9AUZhAO_tVlbPJ1cl-hHnFYL65ELsXlIYqEaI7jlpQ1CJ41-1Kz77naU" },
  { label: "AURA", title: "Décor", desc: "Ambient design that transforms living spaces into personal sanctuaries", slug: "aura", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBT94kfTQPJG-P7qZEPuyRTFOQGda8qIYgqIokR0B8eI0KIvsh9iJlogzDnsHP1pBNn_dLRlgncT5yEqp-1Au5dYxB9XG-zwh72o3eaiBeBkI8yciY_qIjbax-L4OvNS_PoEDTmfo2xj1swFJ79113IAvUBH59RZFiHUdgGOPOJtt6OaGrvZlhTL1F04y0LFRFGselBCoSrWtjSAvM5c6UOu5M7P8U6KkEUZQbHMHvHFyh-FYBYa6G9DomHf-CgZAPyLbUUcSWlOJI" },
  { label: "CARRY", title: "Drinkware", desc: "Premium vessels for the rituals of daily hydration, on the move or at rest", slug: "carry", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCijCnmejkGgkQ_1x9lzLtKt2FJaRKYUqvMLdjHyULDfnAmayz8j3Sh8bXDOoHf_f_bo0qm_Z5Xo9e--ZUP84N4ThCvzNDOXqaGnrBzeONmNIWk1t7TiCGGuEHhGrd3k6BFXMcaRCI6eyRv6FrJXrlCq9UUBllOPOZuT3myGKjOAbEkfyav9RdMzNoEsns2UArQqatCbLIYIu6uv1RKdvQw4FMT_ofAKCNINeA6fJMRbNu8_1NrFhIPlSrQ3xGRiSmKWUUdVqs0Zis" },
]

export default function AllCollections() {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.3em] mb-4 block">Collections</span>
          <h1 className="font-serif text-5xl md:text-7xl text-[#062437] mb-4 tracking-tight">All Collections</h1>
          <p className="font-['Hanken_Grotesk'] text-lg text-[#42474c] font-light max-w-xl">
            Explore our curated selection of home essentials — each category thoughtfully designed to elevate your everyday.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/collections/${cat.slug}`}
              className="group relative h-[420px] overflow-hidden rounded-[20px]"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${cat.bg}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062437]/80 via-[#062437]/20 to-transparent" />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-[#062437]/20 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <span className="text-white/50 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] block mb-2">
                  {cat.label}
                </span>
                <h2 className="text-white font-serif text-4xl md:text-5xl mb-3">{cat.title}</h2>
                <p className="text-white/50 font-['Hanken_Grotesk'] text-sm font-light max-w-md">{cat.desc}</p>
              </div>
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:translate-x-4 md:group-hover:translate-x-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
