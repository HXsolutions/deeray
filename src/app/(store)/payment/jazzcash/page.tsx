import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import crypto from "crypto"
import PaymentForm from "../PaymentForm"

interface Props {
  searchParams: Promise<{ order?: string }>
}

export default async function JazzCashPage({ searchParams }: Props) {
  const { order: orderNumber } = await searchParams
  if (!orderNumber) redirect("/")

  const order = await prisma.order.findUnique({ where: { orderNumber } })
  if (!order) redirect("/")

  const setting = await prisma.siteSetting.findUnique({ where: { key: "payment_gateway" } })
  if (!setting?.value) redirect(`/checkout/confirmation?orderNumber=${orderNumber}`)

  const gw = JSON.parse(setting.value).jazzcash
  if (!gw?.enabled) redirect(`/checkout/confirmation?orderNumber=${orderNumber}`)

  const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/return?gateway=jazzcash&order=${orderNumber}`
  const txnRef = `JC${orderNumber}`
  const amount = Number(order.total).toFixed(2)
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace(/[^0-9]/g, "").slice(0, 14)

  const hashStr =
    `${gw.salt}&${gw.merchant_id}&${txnRef}&${amount}&PKR&${returnUrl}&${expiry}`
  const secureHash = crypto.createHash("sha256").update(hashStr).digest("hex").toUpperCase()

  const fields: Record<string, string> = {
    pp_Version: "2.0",
    pp_TxnType: "MP",
    pp_Language: "EN",
    pp_MerchantID: gw.merchant_id,
    pp_Password: gw.password,
    pp_BillReference: txnRef,
    pp_Amount: String(Math.round(Number(amount) * 100)),
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: expiry,
    pp_TxnExpiryDateTime: expiry,
    pp_ReturnURL: returnUrl,
    pp_SecureHash: secureHash,
    ppmpf_1: "1",
    ppmpf_2: "2",
    ppmpf_3: "3",
    ppmpf_4: "4",
    ppmpf_5: "5",
    pp_CustomerEmail: order.customerEmail,
    pp_CustomerMobile: order.customerPhone || "",
    pp_CustomerName: order.customerName,
    pp_Description: `Order ${orderNumber}`,
  }

  return (
    <PaymentForm
      action={gw.endpoint || "https://sandbox.jazzcash.com.pk/TransactionPost.aspx"}
      fields={fields}
      gatewayName="JazzCash"
    />
  )
}
