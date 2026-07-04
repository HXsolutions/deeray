import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const url = new URL(req.url)
  const gateway = url.searchParams.get("gateway") || formData.get("gateway")?.toString()
  const orderNumber = url.searchParams.get("order") || formData.get("order")?.toString()

  if (!orderNumber || !gateway) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  const order = await prisma.order.findUnique({ where: { orderNumber } })
  if (!order) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  const txnRef = formData.get("pp_TxnRefNo")?.toString() || formData.get("transactionId")?.toString() || null
  const responseCode = formData.get("pp_ResponseCode")?.toString() || formData.get("responseCode")?.toString() || ""
  const isSuccess = responseCode === "000" || responseCode === "0"

  if (isSuccess) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        paymentId: txnRef,
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    })
  } else {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "FAILED" },
    })
  }

  return NextResponse.redirect(
    new URL(`/checkout/confirmation?orderNumber=${orderNumber}`, req.url)
  )
}
