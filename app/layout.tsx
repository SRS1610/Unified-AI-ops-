import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "UnifyOps AI",
  description:
    "One workspace where business users can talk to AI agents for Support, Sales, HR, Compliance, Ops and Engineering.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
