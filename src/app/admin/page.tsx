import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const [productCount, orderCount, lowStockCount] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.lowStockAlert.count({ where: { resolvedAt: null } }),
  ])

  const recentOrders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 })

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#062437] mb-10">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mb-12">
        {[
          { label: "Active Products", value: productCount },
          { label: "Total Orders", value: orderCount },
          { label: "Low Stock Alerts", value: lowStockCount, warn: lowStockCount > 0 },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e3e2e4] rounded-[16px] p-6">
            <p className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#715b3a] mb-2">{stat.label}</p>
            <p className={`font-serif text-4xl ${stat.warn ? "text-[#ba1a1a]" : "text-[#062437]"}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-2xl text-[#062437] mb-6">Recent Orders</h2>
      <div className="bg-white border border-[#e3e2e4] rounded-[16px] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e3e2e4] bg-[#faf9fa]">
              <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Order</th>
              <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Customer</th>
              <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Total</th>
              <th className="text-left px-6 py-4 font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-[#42474c]">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-[#e3e2e4] last:border-0">
                <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#062437]">{o.orderNumber}</td>
                <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#42474c]">{o.customerName}</td>
                <td className="px-6 py-4 font-['Hanken_Grotesk'] text-[#062437]">Rs. {Number(o.total).toLocaleString("en-IN")}</td>
                <td className="px-6 py-4">
                  <span className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-[#d8e5e2] text-[#121e1c]">{o.status}</span>
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center font-['Hanken_Grotesk'] text-sm text-[#73777d]">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
