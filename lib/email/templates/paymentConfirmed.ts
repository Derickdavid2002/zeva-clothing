
import { escapeHtml } from "../escapeHtml";

export function paymentConfirmedTemplate({
  customerName,
  orderNumber,
}: {
  customerName: string;
  orderNumber: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
      </head>

      <body style="margin:0;padding:0;background:#100d16;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

          <div style="text-align:center;margin-bottom:32px;">
            <h1 style="color:#c5a8f5;font-size:27px;font-weight:900;letter-spacing:4px;margin:0;">
              ZEVA COLLECTION
            </h1>
            <p style="color:#a99bbd;font-size:12px;letter-spacing:2px;margin:9px 0 0;">
              YOUR STYLE. YOUR STATEMENT.
            </p>
          </div>

          <div style="background:#1b1623;border:1px solid #45345b;border-radius:16px;padding:36px 26px;text-align:center;">

            <div style="width:64px;height:64px;line-height:64px;margin:0 auto 22px;background:#c5a8f522;border:1px solid #c5a8f555;border-radius:50%;font-size:30px;">
              ✓
            </div>

            <p style="color:#c5a8f5;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">
              Payment Verified
            </p>

            <h2 style="color:#ffffff;font-size:25px;font-weight:700;margin:0 0 14px;">
              Payment Confirmed!
            </h2>

            <p style="color:#b8aabe;font-size:14px;line-height:1.8;margin:0 0 26px;">
              Hi ${escapeHtml(customerName)}, we've successfully confirmed your payment. Thank you for shopping with Zeva Collection!
            </p>

            <div style="background:#241d2e;border:1px solid #45345b;border-radius:10px;padding:18px;margin-bottom:24px;">
              <p style="color:#a99bbd;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">
                Order Number
              </p>

              <p style="color:#c5a8f5;font-size:21px;font-weight:900;letter-spacing:2px;margin:0;">
                #${escapeHtml(orderNumber)}
              </p>
            </div>

            <div style="background:#c5a8f511;border:1px solid #c5a8f533;border-radius:10px;padding:18px;">
              <p style="color:#c5a8f5;font-size:14px;font-weight:700;margin:0 0 7px;">
                Your order is being prepared!
              </p>

              <p style="color:#c8bcd5;font-size:13px;line-height:1.7;margin:0;">
                We'll keep you updated when your order is ready for dispatch.
              </p>
            </div>

          </div>

          <div style="text-align:center;margin-top:28px;">
            <p style="color:#847991;font-size:12px;line-height:1.8;">
              Thank you for choosing Zeva Collection. We appreciate your support.
            </p>

            <p style="color:#c5a8f5;font-size:12px;font-weight:700;letter-spacing:2px;">
              ZEVA COLLECTION
            </p>

            <p style="color:#655b70;font-size:11px;">
              © ${new Date().getFullYear()} Zeva Collection. All rights reserved.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
}
