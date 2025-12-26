import type { Metadata } from "next"
import "./globals.css"
import AuthProvider from "./providers/AuthProvider"

export const metadata: Metadata = {
  title: "Hotel Booking Platform",
  description: "Book hotels easily",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
