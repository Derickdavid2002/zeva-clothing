import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !req.auth
  ) {
    return NextResponse.redirect(
      new URL("/admin/login", req.nextUrl)
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}