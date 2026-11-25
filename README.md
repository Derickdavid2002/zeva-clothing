# Zeva Collection

Independent Next.js storefront and admin dashboard for Zeva Collection. This project uses its own Sanity project; it must never be configured with another store's project ID or API token.

## Requirements
- Node.js 20.19.5 or newer (Node 22 LTS is also supported by this project)
- npm
- A separate Sanity project for Zeva Collection

## Local setup
1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Use the existing dedicated Zeva Sanity project. The `.env.example` already contains its project ID and production dataset; add a write-capable `SANITY_API_TOKEN` from that same project. Never use another store’s project ID or token.
4. Set a long random `NEXTAUTH_SECRET` and `ORDER_UPLOAD_SECRET` (use different random values), plus `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
5. Set Zeva's own bank details in `NEXT_PUBLIC_BANK_NAME`, `NEXT_PUBLIC_BANK_ACCOUNT_NUMBER`, and `NEXT_PUBLIC_BANK_ACCOUNT_NAME`. These are displayed to customers during checkout.
6. To enable emails, configure a verified sender with Resend and set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `ADMIN_EMAIL`.
7. Set the public site URL and optional social links.
8. Run `npm run dev`.

## Checkout and pricing
The customer journey intentionally retains the existing store's bank-transfer checkout: delivery details, payment instructions, payment-proof upload, and confirmation. Product prices and order totals are recalculated on the server from the current Zeva Sanity product records; browser-supplied prices and totals are ignored. Size, colour, and custom options are validated against the current product configuration and saved on each order line.

The payment-proof upload route requires a short-lived, order-specific HMAC token. The general admin upload endpoint is admin-authenticated. **Important:** Sanity image assets are served through Sanity's CDN and are not private object storage. Do not treat payment-proof CDN URLs as confidential. If payment-proof confidentiality is a hard requirement, connect a private object-storage provider before production use.

## Checks
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

Do not commit `.env.local`, Sanity tokens, admin passwords, or Resend keys.
