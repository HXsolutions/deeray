"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function OrderConfirmPage() {
  const params = useParams()
  const token = params.token as string

  const [state, setState] = useState<"loading" | "success" | "error" | "already">("loading")
  const [orderNumber, setOrderNumber] = useState("")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    fetch(`/api/orders/confirm?token=${token}`)
      .then(async (r) => {
        const data = await r.json()
        if (data.alreadyConfirmed) {
          setState("already")
          setOrderNumber(data.orderNumber)
          setMsg(`Order ${data.orderNumber} was already confirmed.`)
        } else if (data.confirmed) {
          setState("success")
          setOrderNumber(data.orderNumber)
          setMsg(`Order ${data.orderNumber} is confirmed! We'll start preparing your items.`)
        } else {
          setState("error")
          setMsg(data.error || "Failed to confirm order")
        }
      })
      .catch(() => {
        setState("error")
        setMsg("Something went wrong. Please try again.")
      })
  }, [token])

  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center">
        {state === "loading" && (
          <>
            <div className="w-20 h-20 bg-[#e3e2e4] rounded-full mx-auto mb-8 animate-pulse" />
            <div className="h-10 bg-[#e3e2e4] rounded-full w-64 mx-auto mb-6 animate-pulse" />
          </>
        )}

        {(state === "success" || state === "already") && (
          <>
            <div className="w-20 h-20 rounded-full bg-[#062437] mx-auto mb-8 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#062437] mb-4 tracking-tight">
              {state === "success" ? "Order Confirmed!" : "Already Confirmed"}
            </h1>
            <p className="font-['Hanken_Grotesk'] text-base text-[#42474c] mb-10 font-light">{msg}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={orderNumber ? `/order-tracking/${orderNumber}` : "/"}
                className="inline-flex items-center gap-3 bg-[#062437] text-white rounded-full px-10 py-4 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] hover:bg-[#1f3a4d] transition-all duration-500">
                Track Order
              </Link>
              <Link href="/collections"
                className="inline-flex items-center gap-3 border border-[#e3e2e4] text-[#42474c] rounded-full px-10 py-4 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] hover:border-[#062437] hover:text-[#062437] transition-all duration-500">
                Continue Shopping
              </Link>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-[#ffdad6] mx-auto mb-8 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#ba1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#062437] mb-4 tracking-tight">Confirmation Failed</h1>
            <p className="font-['Hanken_Grotesk'] text-base text-[#42474c] mb-10 font-light">{msg}</p>
            <Link href="/collections"
              className="inline-flex items-center gap-3 border border-[#e3e2e4] text-[#42474c] rounded-full px-10 py-4 font-['Hanken_Grotesk'] text-xs uppercase tracking-[0.2em] hover:border-[#062437] hover:text-[#062437] transition-all duration-500">
              Continue Shopping
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
