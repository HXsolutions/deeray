import Link from "next/link"

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  const categories = [
    { label: "Pure", slug: "pure", desc: "Air & Water" },
    { label: "Shield", slug: "shield", desc: "Hygiene" },
    { label: "Aura", slug: "aura", desc: "Décor" },
    { label: "Carry", slug: "carry", desc: "Drinkware" },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-8 px-6 md:px-10 pt-36">
      <aside className="w-full md:w-72 flex-shrink-0">
        <div className="sticky top-36">
          <Link href="/collections" className="font-serif text-2xl text-[#062437] mb-10 block tracking-tight">
            Collections
          </Link>
          <nav className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                className="group flex-shrink-0 px-5 py-3 rounded-full md:rounded-lg border border-[#e3e2e4] bg-white hover:bg-[#062437] hover:border-[#062437] transition-all duration-500"
              >
                <span className="font-['Hanken_Grotesk'] text-[11px] uppercase tracking-[0.15em] text-[#73777d] group-hover:text-white/60 block leading-tight">
                  {cat.label}
                </span>
                <span className="font-['Hanken_Grotesk'] text-sm text-[#1a1c1d] group-hover:text-white font-light hidden md:block">
                  {cat.desc}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
