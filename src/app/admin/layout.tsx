import Link from "next/link"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/agents", label: "Delivery Agents" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/settings", label: "Settings" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session.isLoggedIn) redirect("/login")

  return (
    <div className="min-h-screen bg-[#faf9fa] flex">
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#062437] text-white p-8 flex flex-col z-40">
        <div className="mb-10">
          <Link href="/admin" className="font-serif text-3xl lowercase tracking-tight block">deeray</Link>
          <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/50 hover:text-white text-xs uppercase tracking-widest py-2.5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/api/auth/admin/logout" method="POST" className="pt-6 border-t border-white/10">
          <button type="submit" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors w-full text-left">
            Sign Out
          </button>
        </form>

        <div className="mt-4 text-white/20 text-[10px] truncate">{session.email}</div>
      </aside>

      <main className="ml-64 p-10 flex-1">
        <div className="max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
