
import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
