import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductDetailClient from "./ProductDetailClient"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { where: { isActive: true } },
      category: true,
    },
  })

  if (!product) notFound()

  const serialized = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    brief: product.brief,
    brand: product.brand,
    category: { name: product.category.name },
    images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      price: Number(v.price),
      comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
      stock: v.stock,
    })),
  }

  return <ProductDetailClient product={serialized} />
}
