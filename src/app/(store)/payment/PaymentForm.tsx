"use client"

import { useEffect, useRef } from "react"

export default function PaymentForm({
  action,
  fields,
  gatewayName,
}: {
  action: string
  fields: Record<string, string>
  gatewayName: string
}) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => formRef.current?.submit(), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 rounded-full bg-[#d8e5e2] mx-auto mb-6 flex items-center justify-center">
          <svg className="w-6 h-6 text-[#121e1c] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c] mb-4">
          Redirecting to <strong className="text-[#062437]">{gatewayName}</strong> for payment...
        </p>
        <p className="font-['Hanken_Grotesk'] text-xs text-[#73777d] mb-6">
          Do not close this page or press back.
        </p>
        <form ref={formRef} method="POST" action={action}>
          {Object.entries(fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <button type="submit"
            className="bg-[#062437] text-white px-8 py-3 rounded-full text-xs uppercase tracking-[0.15em] hover:bg-[#1f3a4d] transition-all duration-500 font-['Hanken_Grotesk']">
            Continue to {gatewayName}
          </button>
        </form>
      </div>
    </div>
  )
}
