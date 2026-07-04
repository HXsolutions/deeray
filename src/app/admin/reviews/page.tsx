"use client"

import { useEffect, useState } from "react"

interface Review {
  id: number
  customerName: string
  customerEmail: string
  rating: number
  title: string | null
  comment: string | null
  isApproved: boolean
  createdAt: string
  product: { name: string }
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#062437] mb-10">Reviews</h1>

      {loading ? (
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d]">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="font-['Hanken_Grotesk'] text-sm text-[#73777d]">No reviews yet.</p>
      ) : (
        <div className="bg-white border border-[#e3e2e4] rounded-[16px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3e2e4] bg-[#faf9fa]">
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Product</th>
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Customer</th>
                <th className="text-center px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Rating</th>
                <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Comment</th>
                <th className="text-center px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Status</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-b border-[#e3e2e4] last:border-0 hover:bg-[#faf9fa] transition-colors">
                  <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#062437]">{r.product.name}</td>
                  <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#42474c]">{r.customerName}</td>
                  <td className="px-6 py-4 text-center font-['Hanken_Grotesk'] text-[#062437]">{r.rating}/5</td>
                  <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#42474c] max-w-xs truncate">{r.comment || "—"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full ${r.isApproved ? "bg-[#d8e5e2] text-[#121e1c]" : "bg-[#ffdad6] text-[#93000a]"}`}>
                      {r.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
