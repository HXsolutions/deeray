import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About | Deeray",
  description: "Deeray curates premium home essentials — air purifiers, hygiene solutions, décor, and drinkware — for the modern Pakistani home.",
}

export default function AboutPage() {
  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.3em] mb-4 block">About</span>
        <h1 className="font-serif text-5xl md:text-7xl text-[#062437] mb-8 tracking-tight">
          Our Story
        </h1>

        <div className="prose prose-lg max-w-none font-['Hanken_Grotesk'] text-[#42474c] font-light leading-relaxed space-y-6">
          <p className="text-xl text-[#062437] font-medium">
            Deeray was born from a simple observation: the objects we live with shape how we live.
          </p>

          <p>
            In a world of mass-produced mediocrity, finding home essentials that balance genuine 
            utility with considered design has become increasingly difficult. We started Deeray to 
            change that — curating a collection of products that earn their place in your home 
            through performance, durability, and quiet beauty.
          </p>

          <p>
            Based in Pakistan, we work directly with manufacturers who share our obsession with 
            quality. Every product in the Deeray collection is tested for real-world use before 
            it reaches your door. We don&apos;t believe in disposable design. We believe in objects 
            that age gracefully, that you&apos;ll reach for every day, that become part of your 
            home&apos;s story.
          </p>

          <h2 className="font-serif text-3xl text-[#062437] font-normal pt-8">Our Philosophy</h2>

          <p>
            <strong className="text-[#062437] font-medium">Form follows function.</strong> A beautiful object 
            that doesn&apos;t work is a sculpture. A functional object that ignores aesthetics is a 
            tool. We aspire to the space between — where every product is both a pleasure to 
            use and a pleasure to behold.
          </p>

          <p>
            <strong className="text-[#062437] font-medium">Quality over quantity.</strong> We&apos;d rather 
            offer one exceptional air purifier than a dozen mediocre ones. Our collection is 
            intentionally small, rigorously edited, and constantly refined.
          </p>

          <p>
            <strong className="text-[#062437] font-medium">Sustainability through durability.</strong> 
            The most sustainable product is the one you never need to replace. We design for 
            longevity, choose materials that last, and stand behind everything we sell.
          </p>

          <h2 className="font-serif text-3xl text-[#062437] font-normal pt-8">Our Collections</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mt-8">
            {[
              { label: "Pure", desc: "Air purifiers and water filtration — the fundamentals of a healthy home." },
              { label: "Shield", desc: "Hygiene solutions engineered for modern living." },
              { label: "Aura", desc: "Ambient design and décor that transforms spaces." },
              { label: "Carry", desc: "Premium drinkware for the rituals of daily hydration." },
            ].map((c) => (
              <Link key={c.label} href={`/collections/${c.label.toLowerCase()}`}
                className="group p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[16px]">
                <div className="bg-white rounded-[15px] p-6">
                  <h3 className="font-serif text-xl text-[#062437] mb-2 group-hover:text-[#1f3a4d] transition-colors">{c.label}</h3>
                  <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c] font-light">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <p className="pt-8">
            Every product we curate is selected to improve some aspect of your daily life — the 
            air you breathe, the water you drink, the surfaces you touch, the vessels you hold. 
            We believe your home should work as well as it looks.
          </p>
        </div>
      </div>
    </div>
  )
}
