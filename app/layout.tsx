import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Zeva Collection",
  description: "Discover curated fashion, glasses, nails and beauty essentials at Zeva Collection.",
  applicationName: "Zeva Collection",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ background: "#060606", overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  )
}