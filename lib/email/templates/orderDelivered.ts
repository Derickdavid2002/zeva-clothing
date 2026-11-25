import { escapeHtml } from "../escapeHtml";

export function orderDeliveredTemplate({
  customerName,
  orderNumber,
}: {
  customerName: string;
  orderNumber: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#060606;font-family:Helvetica,Arial,sans-serif">
        <div style="max-width:600px;margin:0 auto;padding:40px 20px">
          <div style="text-align:center;margin-bottom:40px">
            <h1 style="color:#B99AEF;font-size:24px;font-weight:900;letter-spacing:3px;text-transform:uppercase;margin:0">
              ZEVA COLLECTION
            </h1>
            <p style="color:#D8C9F5;font-size:12px;font-style:italic;margin:6px 0 0">
              Style that speaks.
            </p>
          </div>

          <div style="background:#111111;border:1px solid #39284D;border-radius:16px;padding:32px;text-align:center">
            <div style="font-size:48px;margin-bottom:16px">🌸</div>

            <h2 style="color:#f0f0f0;font-size:22px;font-weight:700;margin:0 0 12px">
              Order Delivered!
            </h2>

            <p style="color:#a1a1aa;font-size:14px;margin:0 0 24px;line-height:1.7">
              Hi ${escapeHtml(customerName)}, your order
              <strong style="color:#B99AEF">#${escapeHtml(orderNumber)}</strong>
              has been delivered! We hope you love your Zeva Collection order.
            </p>

            <div style="background:#B99AEF12;border:1px solid #B99AEF44;border-radius:10px;padding:16px">
              <p style="color:#D8C9F5;font-size:14px;font-weight:600;margin:0;line-height:1.6">
                Thank you for shopping with Zeva Collection!
              </p>
            </div>
          </div>

          <div style="text-align:center;margin-top:32px">
            <p style="color:#666;font-size:12px">
              We appreciate your support.
            </p>
            <p style="color:#4a4a4a;font-size:12px">
              © ${new Date().getFullYear()} Zeva Collection
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}