
import { escapeHtml } from "../escapeHtml";

export function newOrderAlertTemplate({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  address,
  state,
  items,
  subtotal,
  deliveryFee,
  total,
  proofUrl,
}: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  state: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  proofUrl: string;
}) {
  const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:14px 8px 14px 0;border-bottom:1px solid #30263c;color:#f0edf5;font-size:14px;">
            ${escapeHtml(item.name)}
          </td>
          <td style="padding:14px 8px;border-bottom:1px solid #30263c;color:#c8b8e8;font-size:14px;text-align:center;">
            ${item.qty}
          </td>
          <td style="padding:14px 0 14px 8px;border-bottom:1px solid #30263c;color:#c8b8e8;font-size:14px;text-align:right;font-weight:700;">
            ${fmt(item.price * item.qty)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
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

          <div style="background:#1b1623;border:1px solid #45345b;border-radius:16px;padding:28px 24px;">

            <div style="margin-bottom:28px;">
              <p style="color:#c5a8f5;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;">
                New Order Notification
              </p>
              <h2 style="color:#ffffff;font-size:23px;margin:0 0 8px;">
                A new order has arrived!
              </h2>
              <p style="color:#c5a8f5;font-size:14px;font-weight:700;margin:0;">
                Order #${escapeHtml(orderNumber)}
              </p>
            </div>

            <div style="background:#241d2e;border:1px solid #382b49;border-radius:10px;padding:18px;margin-bottom:24px;">
              <p style="color:#a99bbd;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 14px;">
                Customer Details
              </p>

              <p style="color:#ffffff;font-size:14px;margin:0 0 9px;">
                <strong>Name:</strong> ${escapeHtml(customerName)}
              </p>
              <p style="color:#ffffff;font-size:14px;margin:0 0 9px;">
                <strong>Email:</strong> ${escapeHtml(customerEmail)}
              </p>
              <p style="color:#ffffff;font-size:14px;margin:0 0 9px;">
                <strong>Phone:</strong> ${escapeHtml(customerPhone)}
              </p>
              <p style="color:#ffffff;font-size:14px;line-height:1.6;margin:0;">
                <strong>Delivery Address:</strong><br />
                ${escapeHtml(address)}, ${escapeHtml(state)} State
              </p>
            </div>

            <div style="margin-bottom:24px;">
              <p style="color:#a99bbd;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">
                Order Items
              </p>

              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="color:#a99bbd;font-size:11px;text-align:left;padding-bottom:10px;">PRODUCT</th>
                    <th style="color:#a99bbd;font-size:11px;text-align:center;padding-bottom:10px;">QTY</th>
                    <th style="color:#a99bbd;font-size:11px;text-align:right;padding-bottom:10px;">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </div>

            <div style="border-top:1px solid #45345b;padding-top:18px;margin-bottom:24px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
                <span style="color:#a99bbd;font-size:14px;">Subtotal</span>
                <span style="color:#ffffff;font-size:14px;">${fmt(subtotal)}</span>
              </div>

              <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
                <span style="color:#a99bbd;font-size:14px;">Delivery Fee</span>
                <span style="color:#ffffff;font-size:14px;">${fmt(deliveryFee)}</span>
              </div>

              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="color:#ffffff;font-size:16px;font-weight:700;">Order Total</span>
                <span style="color:#c5a8f5;font-size:21px;font-weight:900;">${fmt(total)}</span>
              </div>
            </div>

            <div style="background:#241d2e;border:1px solid #45345b;border-radius:10px;padding:20px;">
              <p style="color:#a99bbd;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;">
                Payment Proof
              </p>

              <p style="color:#e6deef;font-size:13px;line-height:1.6;margin:0 0 16px;">
                The customer has submitted payment evidence. Review the transfer before confirming the order.
              </p>

              <a
                href="${escapeHtml(proofUrl)}"
                target="_blank"
                style="display:inline-block;background:#b99aeF;color:#17121f;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;"
              >
                View Payment Proof →
              </a>
            </div>

          </div>

          <div style="text-align:center;margin-top:28px;">
            <p style="color:#847991;font-size:12px;line-height:1.7;">
              Please visit your Zeva Collection admin dashboard to review and manage this order.
            </p>
            <p style="color:#c5a8f5;font-size:12px;font-weight:700;letter-spacing:2px;">
              ZEVA COLLECTION
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
}
