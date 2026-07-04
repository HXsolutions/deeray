import nodemailer from "nodemailer"

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  customerName,
  items,
  total,
  shippingAddress,
  confirmationToken,
}: {
  to: string
  orderNumber: string
  customerName: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  shippingAddress: { line1?: string; city?: string; state?: string; zip?: string }
  confirmationToken?: string
}) {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn("SMTP not configured — skipping email")
    return
  }

  const itemsHtml = items
    .map(
      (i) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e3e2e4;font-size:14px;color:#062437;">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e3e2e4;font-size:14px;color:#42474c;text-align:center;">${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e3e2e4;font-size:14px;color:#062437;text-align:right;">Rs. ${(i.price * i.quantity).toLocaleString("en-IN")}</td>
    </tr>`
    )
    .join("")

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf9fa;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9fa;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;">
        <tr><td style="padding:40px 40px 0;text-align:center;">
          <h1 style="font-size:28px;color:#062437;margin:0 0 8px;">Order Confirmed</h1>
          <p style="font-size:14px;color:#42474c;margin:0 0 24px;">Thank you for your order, ${customerName}.</p>
        </td></tr>
        <tr><td style="padding:0 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9fa;border-radius:12px;padding:20px;margin-bottom:24px;">
            <tr><td style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#73777d;padding-bottom:4px;">Order Number</td></tr>
            <tr><td style="font-size:22px;color:#062437;font-weight:600;">${orderNumber}</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 40px;">
          <h2 style="font-size:16px;color:#062437;margin:0 0 12px;">Items</h2>
          <table width="100%" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th style="text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#73777d;padding-bottom:8px;border-bottom:1px solid #e3e2e4;">Item</th>
                <th style="text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#73777d;padding-bottom:8px;border-bottom:1px solid #e3e2e4;">Qty</th>
                <th style="text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#73777d;padding-bottom:8px;border-bottom:1px solid #e3e2e4;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </td></tr>
        <tr><td style="padding:20px 40px 0;border-top:1px solid #e3e2e4;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="font-size:14px;color:#42474c;">Total</td><td style="font-size:18px;color:#062437;font-weight:600;text-align:right;">Rs. ${total.toLocaleString("en-IN")}</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 40px;">
          <h2 style="font-size:16px;color:#062437;margin:0 0 8px;">Shipping Address</h2>
          <p style="font-size:14px;color:#42474c;margin:0;">${shippingAddress.line1 || ""}<br>${shippingAddress.city || ""}, ${shippingAddress.state || ""} ${shippingAddress.zip || ""}</p>
        </td></tr>
        ${confirmationToken ? `
        <tr><td style="padding:24px 40px 0;text-align:center;">
          <p style="font-size:14px;color:#42474c;margin:0 0 16px;">Please confirm your order so we can start processing it.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/order-confirm/${confirmationToken}" style="display:inline-block;background:#062437;color:#ffffff;padding:14px 36px;border-radius:40px;font-size:12px;text-transform:uppercase;letter-spacing:2px;text-decoration:none;">Confirm Order</a>
        </td></tr>
        <tr><td style="padding:24px 40px 40px;text-align:center;border-top:1px solid #e3e2e4;">
        ` : `
        <tr><td style="padding:24px 40px 40px;text-align:center;border-top:1px solid #e3e2e4;">
        `}
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/order-tracking/${orderNumber}" style="display:inline-block;color:#062437;padding:14px 36px;border-radius:40px;font-size:12px;text-transform:uppercase;letter-spacing:2px;text-decoration:none;border:1px solid #e3e2e4;">Track Order</a>
        </td></tr>
      </table>
      <p style="font-size:12px;color:#73777d;margin-top:24px;">Deeray</p>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await transporter.sendMail({
      from: `"Deeray" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `Order Confirmed — ${orderNumber}`,
      html,
    })
  } catch (error) {
    console.error("Email send failed:", error)
  }
}

export async function sendShipmentUpdateEmail({
  to,
  orderNumber,
  customerName,
  trackingNumber,
  courierCompany,
}: {
  to: string
  orderNumber: string
  customerName: string
  trackingNumber: string
  courierCompany: string
}) {
  const transporter = getTransporter()
  if (!transporter) return

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf9fa;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9fa;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;">
        <tr><td style="padding:40px 40px 0;text-align:center;">
          <h1 style="font-size:28px;color:#062437;margin:0 0 8px;">Your Order Has Shipped</h1>
          <p style="font-size:14px;color:#42474c;margin:0 0 24px;">Hi ${customerName}, your order is on its way!</p>
        </td></tr>
        <tr><td style="padding:0 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9fa;border-radius:12px;padding:20px;margin-bottom:24px;">
            <tr><td style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#73777d;padding-bottom:4px;">Order ${orderNumber}</td></tr>
            <tr><td style="font-size:14px;color:#062437;">Courier: ${courierCompany}</td></tr>
            <tr><td style="font-size:14px;color:#062437;">Tracking: ${trackingNumber}</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 40px 40px;text-align:center;border-top:1px solid #e3e2e4;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/order-tracking/${orderNumber}" style="display:inline-block;background:#062437;color:#ffffff;padding:14px 36px;border-radius:40px;font-size:12px;text-transform:uppercase;letter-spacing:2px;text-decoration:none;">Track Order</a>
        </td></tr>
      </table>
      <p style="font-size:12px;color:#73777d;margin-top:24px;">Deeray</p>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await transporter.sendMail({
      from: `"Deeray" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `Your Order Has Shipped — ${orderNumber}`,
      html,
    })
  } catch (error) {
    console.error("Email send failed:", error)
  }
}

export async function sendOrderCancellationEmail({
  to,
  orderNumber,
  customerName,
  reason,
}: {
  to: string
  orderNumber: string
  customerName: string
  reason?: string
}) {
  const transporter = getTransporter()
  if (!transporter) return

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf9fa;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9fa;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;">
        <tr><td style="padding:40px 40px 0;text-align:center;">
          <div style="width:64px;height:64px;border-radius:50%;background:#ffdad6;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ba1a1a" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
          <h1 style="font-size:28px;color:#062437;margin:0 0 8px;">Order Cancelled</h1>
          <p style="font-size:14px;color:#42474c;margin:0 0 24px;">Hi ${customerName}, your order has been cancelled.</p>
        </td></tr>
        <tr><td style="padding:0 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9fa;border-radius:12px;padding:20px;margin-bottom:24px;">
            <tr><td style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#73777d;padding-bottom:4px;">Order Number</td></tr>
            <tr><td style="font-size:22px;color:#062437;font-weight:600;">${orderNumber}</td></tr>
          </table>
        </td></tr>
        ${reason ? `
        <tr><td style="padding:0 40px 24px;">
          <h2 style="font-size:14px;color:#062437;margin:0 0 8px;">Reason</h2>
          <p style="font-size:14px;color:#42474c;margin:0;">${reason}</p>
        </td></tr>
        ` : ""}
        <tr><td style="padding:24px 40px 40px;text-align:center;border-top:1px solid #e3e2e4;">
          <p style="font-size:14px;color:#42474c;margin:0 0 16px;">If you have any questions, please contact us.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="display:inline-block;background:#062437;color:#ffffff;padding:14px 36px;border-radius:40px;font-size:12px;text-transform:uppercase;letter-spacing:2px;text-decoration:none;">Visit Deeray</a>
        </td></tr>
      </table>
      <p style="font-size:12px;color:#73777d;margin-top:24px;">Deeray</p>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await transporter.sendMail({
      from: `"Deeray" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `Order Cancelled — ${orderNumber}`,
      html,
    })
  } catch (error) {
    console.error("Email send failed:", error)
  }
}
