import Link from "next/link"
import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Journal | Deeray",
  description: "Stories, guides, and insights from the Deeray team — design philosophy, care guides, and the thinking behind each piece.",
}

export default async function BlogIndexPage() {
  let posts: any[] = []
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    })
  } catch {}

  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.3em] mb-4 block">Reading</span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#062437] mb-4 tracking-tight">Journal</h1>
          <p className="font-['Hanken_Grotesk'] text-lg text-[#42474c] font-light max-w-xl">
            Stories, guides, and insights from the Deeray team — exploring design, materiality, and the art of living well.
          </p>
        </div>

        <div className="space-y-1">
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="py-8 border-t border-[#e3e2e4] group-hover:border-[#062437]/20 transition-colors duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-['Hanken_Grotesk'] text-[10px] text-[#73777d] uppercase tracking-[0.15em]">
                        {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                      {post.author && (
                        <>
                          <span className="w-px h-3 bg-[#e3e2e4]" />
                          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#73777d] uppercase tracking-[0.15em]">
                            By {post.author}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl text-[#062437] group-hover:text-[#1f3a4d] transition-colors mb-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c] font-light leading-relaxed max-w-2xl">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#f4f3f5] flex items-center justify-center group-hover:bg-[#062437] transition-all duration-500">
                      <svg className="w-4 h-4 text-[#73777d] group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-[#73777d] font-['Hanken_Grotesk'] text-sm py-12 font-light">No journal entries yet. Coming soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}
