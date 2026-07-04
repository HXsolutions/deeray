import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (!post) return { title: "Not Found" }
    return {
      title: `${post.title} | Deeray Journal`,
      description: post.excerpt || post.title,
    }
  } catch {
    return { title: "Journal | Deeray" }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  let post
  try {
    post = await prisma.blogPost.findUnique({ where: { slug, published: true } })
  } catch {
    notFound()
  }
  if (!post) notFound()

  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <article className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 font-['Hanken_Grotesk'] text-xs text-[#73777d] uppercase tracking-[0.2em] hover:text-[#062437] transition-colors mb-10">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to Journal
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#73777d] uppercase tracking-[0.15em]">
            {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          {post.author && (
            <>
              <span className="w-px h-3 bg-[#e3e2e4]" />
              <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.15em]">
                By {post.author}
              </span>
            </>
          )}
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-[#062437] mb-8 tracking-tight leading-[1.1]">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg md:text-xl text-[#42474c] leading-relaxed mb-10 font-light italic border-l-2 border-[#062437]/10 pl-6">
            {post.excerpt}
          </p>
        )}

        {post.image && (
          <div className="rounded-[20px] overflow-hidden mb-12">
            <img src={post.image} alt={post.title} className="w-full aspect-video object-cover" />
          </div>
        )}

        <div className="font-['Hanken_Grotesk'] text-base md:text-lg text-[#42474c] leading-[1.8] font-light space-y-6 max-w-none">
          {post.content.split("\n").map((paragraph, i) => (
            paragraph.trim() ? <p key={i}>{paragraph}</p> : null
          ))}
        </div>
      </article>
    </div>
  )
}
