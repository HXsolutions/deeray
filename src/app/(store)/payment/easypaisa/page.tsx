import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import crypto from "crypto"
import PaymentForm from "../PaymentForm"

interface Props {
  searchParams: Promise<{ order?: string }>
}

export default async function EasypaisaPage({ searchParams }: Props) {
  const { order: orderNumber } = await searchParams
  if (!orderNumber) redirect("/")

  const order = await prisma.order.findUnique({ where: { orderNumber } })
  if (!order) redirect("/")

  const setting = await prisma.siteSetting.findUnique({ where: { key: "payment_gateway" } })
  if (!setting?.value) redirect(`/checkout/confirmation?orderNumber=${orderNumber}`)

  const gw = JSON.parse(setting.value).easypaisa
  if (!gw?.enabled) redirect(`/checkout/confirmation?orderNumber=${orderNumber}`)

  const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/return?gateway=easypaisa&order=${orderNumber}`
  const amount = Number(order.total).toFixed(2)

  const hashStr = `${gw.secret}&${gw.merchant_id}&${orderNumber}&${amount}&PKR&${returnUrl}`
  const hash = crypto.createHash("sha256").update(hashStr).digest("hex")

  const fields: Record<string, string> = {
    merchantId: gw.merchant_id,
    orderRefNum: orderNumber,
    amount: amount,
    currency: "PKR",
    merchantSignature: hash,
    returnUrl: returnUrl,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerMobile: order.customerPhone || "",
    description: `Order ${orderNumber}`,
  }

  return (
    <PaymentForm
      action={gw.endpoint || "https://easypaisa.com.pk/easypay/Index.aspx"}
      fields={fields}
      gatewayName="Easypaisa"
    />
  )
}
