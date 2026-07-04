import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("admin123", 12)

  const admin = await prisma.admin.upsert({
    where: { email: "admin@deeray.com" },
    update: {},
    create: {
      email: "admin@deeray.com",
      name: "Deeray Admin",
      password,
    },
  })

  console.log("✔ Admin seeded:", admin.email)

  // ── Categories ──────────────────────────────────────────────

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "pure" },
      update: {},
      create: {
        name: "Pure",
        slug: "pure",
        description: "Pure air, pure water — engineered filtration for the modern home.",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "shield" },
      update: {},
      create: {
        name: "Shield",
        slug: "shield",
        description: "Advanced hygiene solutions for the conscious, modern lifestyle.",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "aura" },
      update: {},
      create: {
        name: "Aura",
        slug: "aura",
        description: "Ambient design that transforms living spaces into personal sanctuaries.",
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "carry" },
      update: {},
      create: {
        name: "Carry",
        slug: "carry",
        description: "Premium vessels for the rituals of daily hydration, on the move or at rest.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      },
    }),
  ])

  console.log(`✔ ${categories.length} categories seeded`)

  // ── Tags ────────────────────────────────────────────────────

  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: "new-arrival" }, update: { name: "New Arrival" }, create: { name: "New Arrival", slug: "new-arrival" } }),
    prisma.tag.upsert({ where: { slug: "best-seller" }, update: { name: "Best Seller" }, create: { name: "Best Seller", slug: "best-seller" } }),
    prisma.tag.upsert({ where: { slug: "limited-edition" }, update: { name: "Limited Edition" }, create: { name: "Limited Edition", slug: "limited-edition" } }),
    prisma.tag.upsert({ where: { slug: "sale" }, update: { name: "Sale" }, create: { name: "Sale", slug: "sale" } }),
    prisma.tag.upsert({ where: { slug: "handcrafted" }, update: { name: "Handcrafted" }, create: { name: "Handcrafted", slug: "handcrafted" } }),
  ])

  console.log(`✔ ${tags.length} tags seeded`)

  // ── Helper to find category by slug ─────────────────────────

  const cat = (slug: string) => categories.find((c) => c.slug === slug)!

  // ── Products ────────────────────────────────────────────────

  const productData = [
    {
      name: "The Kashmir Overcoat",
      slug: "kashmir-overcoat",
      brief: "Hand-tailored vicuña-blend overcoat with silk lining.",
      description: `A masterwork of precision tailoring, The Kashmir Overcoat is crafted from the world's finest vicuña-blend fabric sourced from the highlands of Peru. Each coat requires over 72 hours of hand-stitching by master artisans in Milan.

The silhouette is sculptural yet effortless — a relaxed shoulder, suppressed waist, and a sweeping hem that moves like liquid. Inside, a full silk lining in midnight navy bears our signature monogram.

Every detail has been considered: mother-of-pearl buttons from Naples, horn-rimmed buttonholes stitched by hand, and an interior pocket sized perfectly for a leather-bound journal.

This is not merely an overcoat. It is an heirloom.`,
      categorySlug: "pure",
      brand: "Deeray Atelier",
      isFeatured: true,
      variants: [
        { sku: "KO-44", size: "44", color: "Charcoal", price: 285000, comparePrice: 320000, stock: 5 },
        { sku: "KO-46", size: "46", color: "Charcoal", price: 285000, stock: 8 },
        { sku: "KO-48", size: "48", color: "Charcoal", price: 285000, stock: 3 },
        { sku: "KO-50", size: "50", color: "Charcoal", price: 295000, stock: 2 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=90", alt: "Kashmir Overcoat — Front View" },
        { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=90", alt: "Kashmir Overcoat — Detail" },
        { url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&q=90", alt: "Kashmir Overcoat — Silhouette" },
        { url: "https://images.unsplash.com/photo-1608236415055-3a792a590cbf?w=1200&q=90", alt: "Kashmir Overcoat — Fabric Detail" },
      ],
      tags: ["new-arrival", "limited-edition", "handcrafted"],
      reviews: [
        { customerName: "Zaid M.", customerEmail: "zaid@example.com", rating: 5, title: "Absolute masterpiece", comment: "The weight, the drape, the stitching — everything about this coat whispers luxury. Worth every rupee.", isApproved: true },
        { customerName: "Ahmed K.", customerEmail: "ahmed@example.com", rating: 5, title: "Heirloom quality", comment: "I own overcoats from Brioni and Kiton. This rivals both at a fraction of the price. Extraordinary.", isApproved: true },
      ],
    },
    {
      name: "Rose Absolute Eau de Parfum",
      slug: "rose-absolute-edp",
      brief: "A thousand hand-picked Turkish roses in every crystal flacon.",
      description: `Rose Absolute is an olfactory ode to the gardens of Isparta, where centifolia roses have been cultivated for generations. Each 100ml flacon contains the essence of over one thousand hand-picked blooms, cold-extracted to preserve their volatile aromatics.

The composition unfolds in three acts: an opening of bergamot and pink peppercorn gives way to a heart of Turkish rose absolute and Bulgarian otto, settled on a base of Venezuelan ambrette seed, Australian sandalwood, and Kashmir cedar.

The flacon itself is a sculpture — mouth-blown crystal faceted by Murano glass masters, finished with a 24-karat gold-plated collar and a hand-engraved deer motif.

A fragrance for those who understand that true luxury is invisible yet unforgettable.`,
      categorySlug: "aura",
      brand: "Deeray Parfums",
      isFeatured: true,
      variants: [
        { sku: "RA-50", size: "50ml", color: "Crystal", price: 45000, comparePrice: 52000, stock: 12 },
        { sku: "RA-100", size: "100ml", color: "Crystal", price: 75000, stock: 8 },
        { sku: "RA-TRAVEL", size: "10ml", color: "Travel", price: 12000, stock: 25 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=90", alt: "Rose Absolute — Flacon" },
        { url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=90", alt: "Rose Absolute — Detail" },
        { url: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1200&q=90", alt: "Rose Absolute — Packaging" },
      ],
      tags: ["new-arrival", "best-seller"],
      reviews: [
        { customerName: "Sara H.", customerEmail: "sara@example.com", rating: 5, title: "The most beautiful rose", comment: "I've tried every rose perfume from Frédéric Malle to Diptyque. This surpasses them all. Stunning longevity.", isApproved: true },
      ],
    },
    {
      name: "Obsidian Leather Tote",
      slug: "obsidian-leather-tote",
      brief: "Full-grain Italian leather tote, hand-stitched and unlined.",
      description: `The Obsidian Tote is a study in restraint. Cut from a single hide of Tuscan full-grain leather that has been vegetable-tanned over eight weeks, it develops a patina unique to its owner.

There is no lining — the raw leather interior is a feature, not a compromise, showcasing the hide's natural markings and the hand-stitching of Florentine artisans who have honed their craft across three generations.

The bag is structured yet soft, with a single internal snap pocket, solid brass hardware cast in Jaipur, and a detachable shoulder strap. It fits a 16-inch laptop, a leather journal, and the day's essentials.

A bag that will outlive you and look better with every passing year.`,
      categorySlug: "carry",
      brand: "Deeray Atelier",
      isFeatured: true,
      variants: [
        { sku: "OT-BLK", size: "Standard", color: "Obsidian Black", price: 185000, comparePrice: 210000, stock: 7 },
        { sku: "OT-TAB", size: "Standard", color: "Tabacco", price: 185000, stock: 4 },
        { sku: "OT-BRN", size: "Standard", color: "Walnut Brown", price: 195000, stock: 3 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1200&q=90", alt: "Obsidian Tote — Front" },
        { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=90", alt: "Obsidian Tote — Detail" },
        { url: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1200&q=90", alt: "Obsidian Tote — Hardware" },
        { url: "https://images.unsplash.com/photo-1563903532908-af5dcd22a6c7?w=1200&q=90", alt: "Obsidian Tote — Lifestyle" },
      ],
      tags: ["best-seller", "handcrafted"],
      reviews: [
        { customerName: "Omar F.", customerEmail: "omar@example.com", rating: 5, title: "Worth the investment", comment: "Six months of daily use and it looks better than the day I bought it. The patina is incredible.", isApproved: true },
      ],
    },
    {
      name: "Silk Georgette Evening Gown",
      slug: "silk-georgette-gown",
      brief: "Fluid silk georgette with a hand-beaded neckline.",
      description: `The Silk Georgette Evening Gown is liquid poetry. Cut on the bias from 22-momme silk georgette sourced from the Como region of Italy, it drapes like a second skin, moving with the body rather than against it.

The neckline is a canvas — each gown features over 800 hand-sewn glass beads and freshwater pearls, applied by artisans in Mumbai who have spent decades mastering the art of embroidery. No two gowns are identical.

A secreted interior corset provides structure without sacrificing comfort, while the hem falls to a graceful floor-sweeping finish. Available in five shades, each dyed with low-impact Italian dyes that lend the silk an almost iridescent depth.

For the woman who enters a room and changes its atmosphere.`,
      categorySlug: "pure",
      brand: "Deeray Atelier",
      isFeatured: true,
      variants: [
        { sku: "EG-MID", size: "S", color: "Midnight", price: 420000, comparePrice: 480000, stock: 2 },
        { sku: "EG-MID-M", size: "M", color: "Midnight", price: 420000, stock: 3 },
        { sku: "EG-MID-L", size: "L", color: "Midnight", price: 420000, stock: 2 },
        { sku: "EG-BUR", size: "S", color: "Burgundy", price: 440000, stock: 1 },
        { sku: "EG-BUR-M", size: "M", color: "Burgundy", price: 440000, stock: 2 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=90", alt: "Evening Gown — Front" },
        { url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=90", alt: "Evening Gown — Detail" },
        { url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200&q=90", alt: "Evening Gown — Back" },
        { url: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=1200&q=90", alt: "Evening Gown — Beading Detail" },
      ],
      tags: ["limited-edition", "handcrafted"],
      reviews: [],
    },
    {
      name: "Cashmere Travel Throw",
      slug: "cashmere-travel-throw",
      brief: "Pure Mongolian cashmere, woven on traditional handlooms.",
      description: `Wrapped in this throw, the world softens. Each piece is woven on traditional handlooms in Ulaanbaatar by artisans who have worked with cashmere for generations. The fibers are hand-combed from free-ranging Hircus goats, then spun into a two-ply yarn that achieves the perfect balance of warmth and weightlessness.

At 220gsm, it is substantial enough for a transatlantic flight yet light enough to carry everywhere. The edges are hand-fringed, and each throw arrives in a silk-lined leather travel case.

A companion for journeys both great and small.`,
      categorySlug: "aura",
      brand: "Deeray Home",
      isFeatured: false,
      variants: [
        { sku: "CT-CHAR", size: "140x200cm", color: "Charcoal", price: 95000, comparePrice: 115000, stock: 15 },
        { sku: "CT-CAM", size: "140x200cm", color: "Camel", price: 95000, stock: 12 },
        { sku: "CT-CRM", size: "140x200cm", color: "Cream", price: 95000, stock: 10 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=90", alt: "Cashmere Throw — On Chair" },
        { url: "https://images.unsplash.com/photo-1602872030213-6f62e1bf7e2f?w=1200&q=90", alt: "Cashmere Throw — Detail" },
        { url: "https://images.unsplash.com/photo-1591955506261-4b33e84a9624?w=1200&q=90", alt: "Cashmere Throw — Travel Case" },
      ],
      tags: ["best-seller", "handcrafted"],
      reviews: [
        { customerName: "Fatima A.", customerEmail: "fatima@example.com", rating: 5, title: "Heavenly soft", comment: "I take this everywhere — flights, hotels, even to the office. It transforms any seat into a sanctuary.", isApproved: true },
        { customerName: "Ali R.", customerEmail: "ali@example.com", rating: 4, title: "Beautiful but delicate", comment: "Gorgeous quality. Just be careful with snags — cashmere this fine needs gentle handling.", isApproved: true },
      ],
    },
    {
      name: "The Safari Jacket",
      slug: "safari-jacket",
      brief: "Portuguese corduroy safari jacket with four bellows pockets.",
      description: `A modern take on the classic safari jacket, cut from heavyweight Portuguese corduroy with a distinct 16-wale rib. The silhouette is relaxed — designed to be worn open over a linen shirt or cinched at the waist with the integrated belt.

Four bellows pockets sit at the front, each secured with a horn button and pleated for expansion. The collar rolls beautifully, softening with wear. Inside, a single hidden pocket sits at the left breast — perfect for a passport or a fountain pen.

Construction details include felled seams, corozo nut buttons, and a curved hem that falls just below the hip. This is a jacket made for discovery.`,
      categorySlug: "shield",
      brand: "Deeray Atelier",
      isFeatured: false,
      variants: [
        { sku: "SJ-46", size: "46", color: "Tobacco", price: 125000, stock: 6 },
        { sku: "SJ-48", size: "48", color: "Tobacco", price: 125000, stock: 8 },
        { sku: "SJ-50", size: "50", color: "Tobacco", price: 125000, stock: 4 },
        { sku: "SJ-52", size: "52", color: "Tobacco", price: 132000, stock: 3 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1200&q=90", alt: "Safari Jacket — Front" },
        { url: "https://images.unsplash.com/photo-1608236415055-3a792a590cbf?w=1200&q=90", alt: "Safari Jacket — Detail" },
        { url: "https://images.unsplash.com/photo-1531072901036-d2bd07b2b33e?w=1200&q=90", alt: "Safari Jacket — Fit" },
      ],
      tags: ["new-arrival"],
      reviews: [],
    },
    {
      name: "Amber & Oud Candle Collection",
      slug: "amber-oud-candle",
      brief: "Hand-poured coconut wax candles in mouth-blown glass vessels.",
      description: `The Amber & Oud Candle transforms any room into a sanctuary. Each candle is hand-poured in small batches using a proprietary blend of coconut and apricot wax that burns cleaner and longer than traditional paraffin.

The fragrance is layered and complex: top notes of saffron and Calabrian bergamot give way to a heart of Cambodian oud and amber resin, settled on a base of Australian sandalwood and guaiac wood. The burn time is approximately 80 hours.

The vessel itself is a keepsake — mouth-blown borosilicate glass with an organic, uneven rim that catches the light. When the candle is spent, it becomes a drinking glass, a vase, or a vessel for small treasures.

Presented in a Japanese paper box tied with silk ribbon.`,
      categorySlug: "aura",
      brand: "Deeray Home",
      isFeatured: false,
      variants: [
        { sku: "AC-SINGLE", size: "Single (340g)", color: "Amber Glass", price: 18000, stock: 30 },
        { sku: "AC-DUO", size: "Duo (2×340g)", color: "Amber Glass", price: 32000, comparePrice: 36000, stock: 15 },
        { sku: "AC-TRIO", size: "Trio (3×340g)", color: "Amber Glass", price: 45000, stock: 10 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&q=90", alt: "Amber & Oud Candle — Single" },
        { url: "https://images.unsplash.com/photo-1602872030213-6f62e1bf7e2f?w=1200&q=90", alt: "Amber & Oud — Trio" },
        { url: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=1200&q=90", alt: "Amber & Oud — Detail" },
      ],
      tags: ["new-arrival", "handcrafted"],
      reviews: [],
    },
    {
      name: "Crocodile-Embossed Cardholder",
      slug: "crocodile-cardholder",
      brief: "Italian calfskin with crocodile embossing, six card slots.",
      description: `Essentialism at its finest. This cardholder is cut from a single piece of Italian calfskin that has been embossed with a genuine crocodile grain, then hand-finished with natural dyes that allow the leather's character to show through.

Six card slots are arranged in a thoughtful layout — two on each side and two hidden central compartments for bills or a SIM card. The edges are painted by hand in a matching pigment, a technique that requires three separate applications and twelve hours of drying time.

Compact enough to disappear into a pocket, refined enough to pull out at a black-tie dinner.

The patina will deepen with every transaction, becoming uniquely yours.`,
      categorySlug: "carry",
      brand: "Deeray Atelier",
      isFeatured: false,
      variants: [
        { sku: "CC-BLK", size: "Standard", color: "Black", price: 32000, stock: 20 },
        { sku: "CC-BRN", size: "Standard", color: "Dark Brown", price: 32000, stock: 15 },
        { sku: "CC-BRG", size: "Standard", color: "Burgundy", price: 34000, stock: 8 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=1200&q=90", alt: "Cardholder — Front" },
        { url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=90", alt: "Cardholder — Open" },
        { url: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1200&q=90", alt: "Cardholder — Detail" },
      ],
      tags: ["best-seller"],
      reviews: [
        { customerName: "Hassan M.", customerEmail: "hassan@example.com", rating: 5, title: "Perfect everyday carry", comment: "Slips into any pocket, holds everything I need, and looks better every day. The croc embossing is subtle but distinct.", isApproved: true },
      ],
    },
  ]

  const tagMap: Record<string, number> = {}
  for (const t of tags) {
    tagMap[t.slug] = t.id
  }

  for (const pd of productData) {
    const product = await prisma.product.upsert({
      where: { slug: pd.slug },
      update: {
        name: pd.name,
        description: pd.description,
        brief: pd.brief,
        brand: pd.brand,
        isFeatured: pd.isFeatured,
        categoryId: cat(pd.categorySlug).id,
      },
      create: {
        name: pd.name,
        slug: pd.slug,
        description: pd.description,
        brief: pd.brief,
        categoryId: cat(pd.categorySlug).id,
        brand: pd.brand,
        isFeatured: pd.isFeatured,
        isActive: true,
      },
    })

    // Upsert images
    for (let i = 0; i < pd.images.length; i++) {
      const img = pd.images[i]
      const existingImages = await prisma.productImage.findMany({
        where: { productId: product.id, url: img.url },
      })
      if (existingImages.length === 0) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: img.url,
            alt: img.alt,
            order: i,
          },
        })
      }
    }

    // Upsert variants
    for (const v of pd.variants) {
      const existingVariant = await prisma.productVariant.findUnique({ where: { sku: v.sku } })
      if (!existingVariant) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            price: v.price,
            comparePrice: v.comparePrice ?? null,
            stock: v.stock,
          },
        })
      }
    }

    // Upsert tags
    for (const tagSlug of pd.tags) {
      const tagId = tagMap[tagSlug]
      if (tagId) {
        const existing = await prisma.tag.findFirst({
          where: { id: tagId, products: { some: { id: product.id } } },
        })
        if (!existing) {
          await prisma.product.update({
            where: { id: product.id },
            data: { tags: { connect: { id: tagId } } },
          })
        }
      }
    }

    // Upsert reviews
    for (const r of pd.reviews) {
      const existing = await prisma.review.findFirst({
        where: { productId: product.id, customerEmail: r.customerEmail },
      })
      if (!existing) {
        await prisma.review.create({
          data: {
            productId: product.id,
            customerName: r.customerName,
            customerEmail: r.customerEmail,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            isApproved: r.isApproved,
          },
        })
      }
    }

    console.log(`  ✔ ${pd.name}`)
  }

  // ── Blog Posts ──────────────────────────────────────────────

  const blogPosts = [
    {
      title: "The Art of Slow Luxury",
      slug: "art-of-slow-luxury",
      excerpt: "In a world that demands faster, louder, cheaper — we choose the opposite. Here's why slow luxury matters now more than ever.",
      content: `In 2025, the average person encounters between 6,000 and 10,000 brand messages every day. Logos flash across screens. Notifications demand attention. Algorithms optimize for speed, not depth.

At Deeray, we believe that true luxury is the antidote to this noise.

**What is Slow Luxury?**

Slow luxury is not about price — it's about intention. It's a garment that took 72 hours to stitch instead of 72 minutes. A fragrance that spent six months macerating before it touched a bottle. A leather bag cut from a single hide, where the natural markings tell a story that no factory can replicate.

It is the opposite of disposable. It is anti-trend. It is ownership as a long-term relationship rather than a transient transaction.

**The Craftsmanship Behind the Concept**

Every Deeray piece begins with raw materials chosen not for cost efficiency, but for character. Our vicuña-blend fabric comes from a single family-run mill in Biella, Italy that has operated since 1867. Our cashmere is hand-combed in Mongolia by artisans whose techniques predate the Mongol Empire. Our crystal flacons are mouth-blown in Murano, using methods that have remained unchanged for seven centuries.

This is not nostalgia. It is a deliberate refusal to compromise.

**Why It Matters**

When you buy a Deeray piece, you are not consuming — you are commissioning. You are participating in a chain of craftsmanship that values the maker as much as the wearer. You are choosing quality over quantity, permanence over novelty, soul over surface.

In a world racing toward the bottom, slow luxury is a quiet act of rebellion.

*— The Deeray Team*`,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=90",
      author: "The Deeray Team",
      published: true,
    },
    {
      title: "A Guide to Cashmere: Quality, Care & Longevity",
      slug: "guide-to-cashmere",
      excerpt: "Everything you need to know about selecting, wearing, and caring for the world's finest natural fiber.",
      content: `Cashmere is perhaps the most misunderstood luxury fiber. Many believe that all cashmere is created equal — that the label alone guarantees quality. The truth is far more nuanced.

**The Grading System**

Cashmere is classified by fiber diameter. The industry standard allows fibers up to 19 microns. Exceptional cashmere — the kind we use at Deeray — averages between 13.5 and 15 microns. To put that in perspective: human hair is approximately 75 microns. The difference between standard and exceptional cashmere is the difference between a rough whisper and total silence.

**Where It Comes From**

The best cashmere comes from the Kashmir goat, native to the high plateaus of Inner Mongolia and Mongolia. These goats endure winters that reach -40°C, growing a fine undercoat that provides insulation against the cold. It is this undercoat — combed by hand during the spring molting season — that becomes cashmere.

**How to Care for Cashmere**

1. **Air, don't wash.** After wearing, hang your cashmere in a well-ventilated area for 24 hours. Cashmere is self-cleaning — it needs far fewer washes than you think.

2. **Hand wash cold.** When it is time to clean, use a specialist cashmere shampoo in lukewarm water. Do not wring — press the water out gently.

3. **Dry flat.** Never hang cashmere — the weight of the water will stretch it. Roll it in a towel to remove excess moisture, then lay flat on a drying rack away from direct heat or sunlight.

4. **Store folded.** Cashmere should be folded, not hung. Hangers create shoulder bumps that never fully recover.

5. **Pilling is not a flaw.** It is a sign of natural fibers. Use a cashmere comb to remove pills gently — never a razor or a pill remover.

**The Deeray Difference**

Our cashmere throws are woven on traditional handlooms, not power looms. This means the fibers are aligned naturally rather than forced, resulting in a softer hand and greater durability. Each throw is inspected by hand before it leaves our workshop.

Invest in one exceptional piece rather than five mediocre ones. Your wardrobe — and the planet — will thank you.`,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=90",
      author: "Zaid M.",
      published: true,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        author: post.author,
        published: post.published,
      },
    })
    console.log(`  ✔ Blog: ${post.title}`)
  }

  // ── Clean up old categories ─────────────────────────────────
  const oldSlugs = ["mens-luxury", "womens-elegance", "accessories", "fragrance", "home-decor"]
  let deletedCount = 0
  for (const slug of oldSlugs) {
    try {
      await prisma.category.delete({ where: { slug } })
      deletedCount++
    } catch { /* already deleted or has references */ }
  }
  if (deletedCount > 0) console.log(`  ✔ Removed ${deletedCount} old categories`)

  console.log("\n── Seeding complete ──")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
