"use client"

import { useState, FormEvent } from "react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // For now, just show success (in production, send via email/API)
    await new Promise((r) => setTimeout(r, 500))
    setSent(true)
  }

  return (
    <div className="px-6 md:px-10 pt-36 pb-32 bg-[#faf9fa] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#715b3a] uppercase tracking-[0.3em] mb-4 block">Get in Touch</span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#062437] mb-4 tracking-tight">Contact Us</h1>
          <p className="font-['Hanken_Grotesk'] text-[15px] text-[#42474c] font-light max-w-md mx-auto">We&apos;d love to hear from you. Drop us a message and we&apos;ll get back to you as soon as possible.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px]">
              <div className="bg-white rounded-[19px] p-8 space-y-6">
                <div>
                  <p className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#715b3a] mb-2">Email</p>
                  <p className="font-['Hanken_Grotesk'] text-sm text-[#062437]">hello@deeray.store</p>
                </div>
                <div>
                  <p className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#715b3a] mb-2">Phone</p>
                  <p className="font-['Hanken_Grotesk'] text-sm text-[#062437]">+92 300 1234567</p>
                </div>
                <div>
                  <p className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#715b3a] mb-2">Location</p>
                  <p className="font-['Hanken_Grotesk'] text-sm text-[#062437]">Pakistan — Nationwide Delivery</p>
                </div>
                <div>
                  <p className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#715b3a] mb-2">Social</p>
                  <div className="flex gap-4">
                    <a href="https://instagram.com/deeray.studio" target="_blank" rel="noreferrer noopener" className="font-['Hanken_Grotesk'] text-sm text-[#062437] hover:underline">Instagram</a>
                    <a href="https://facebook.com/deeray.studio" target="_blank" rel="noreferrer noopener" className="font-['Hanken_Grotesk'] text-sm text-[#062437] hover:underline">Facebook</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {sent ? (
              <div className="p-[1px] bg-gradient-to-b from-[#062437]/10 to-transparent rounded-[20px]">
                <div className="bg-white rounded-[19px] p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#d8e5e2] mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#121e1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-serif text-2xl text-[#062437] mb-3">Message Sent!</h2>
                  <p className="font-['Hanken_Grotesk'] text-sm text-[#42474c] font-light">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <input type="text" placeholder="Your Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="col-span-2 md:col-span-1 border border-[#e3e2e4] rounded-full px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors bg-white" />
                  <input type="email" placeholder="Your Email *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="col-span-2 md:col-span-1 border border-[#e3e2e4] rounded-full px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors bg-white" />
                </div>
                <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-[#e3e2e4] rounded-full px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors bg-white" />
                <textarea placeholder="Your Message *" required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-[#e3e2e4] rounded-[20px] px-6 py-4 focus:outline-none focus:border-[#062437] text-sm font-['Hanken_Grotesk'] transition-colors bg-white resize-none" />
                <button type="submit"
                  className="bg-[#062437] text-white px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-[#1f3a4d] transition-all duration-500 font-['Hanken_Grotesk'] inline-flex items-center gap-3">
                  Send Message
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
