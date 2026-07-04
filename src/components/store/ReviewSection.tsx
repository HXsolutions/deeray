"use client"

import { useEffect, useState, FormEvent } from "react"

interface ReviewItem {
  id: number
  customerName: string
  rating: number
  title: string | null
  comment: string | null
  createdAt: string
}

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [form, setForm] = useState({ name: "", email: "", rating: 5, title: "", comment: "" })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
  }, [productId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, productId }),
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c]">Thank you for your review! It will appear after approval.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-serif text-2xl text-[#062437] mb-6">Reviews</h3>

      {reviews.length === 0 ? (
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d] mb-8">No reviews yet. Be the first to review this product.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {reviews.map((r) => (
            <div key={r.id} className="border border-[#e3e2e4] rounded-[16px] p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-600 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className="font-['Hanken_Grotesk'] text-xs text-[#73777d]">{r.customerName}</span>
              </div>
              {r.title && <p className="font-['Hanken_Grotesk'] text-sm font-medium text-[#062437]">{r.title}</p>}
              {r.comment && <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c] mt-1">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-[#e3e2e4] pt-8">
        <h4 className="font-['Hanken_Grotesk'] text-sm font-medium text-[#062437] mb-4">Write a Review</h4>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })}
                className={`text-xl ${n <= form.rating ? "text-yellow-600" : "text-[#e3e2e4]"}`}>{n <= form.rating ? "★" : "☆"}</button>
            ))}
          </div>
          <input type="text" placeholder="Your Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-[#e3e2e4] rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#062437] font-['Hanken_Grotesk']" />
          <input type="email" placeholder="Your Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-[#e3e2e4] rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#062437] font-['Hanken_Grotesk']" />
          <input type="text" placeholder="Review Title (optional)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-[#e3e2e4] rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#062437] font-['Hanken_Grotesk']" />
          <textarea placeholder="Your Review (optional)" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="w-full border border-[#e3e2e4] rounded-[20px] px-6 py-3 text-sm focus:outline-none focus:border-[#062437] font-['Hanken_Grotesk'] resize-none h-24" />
          <button type="submit"
            className="bg-[#062437] text-white px-8 py-3 rounded-full text-xs uppercase tracking-[0.15em] hover:bg-[#1f3a4d] transition-all duration-500 font-['Hanken_Grotesk']">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  )
}
