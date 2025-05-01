import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Web3Provider } from "@/components/web3-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gblend Daily Attendance 🎨",
  description: "Mark your daily attendance and show your loyalty to Fluent",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {/* Purple gradient background */}
        <div
          className="fixed inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/images/background-dark-aurora.png')",
          }}
        />
        {/* Simple overlay for better text visibility */}
        <div className="fixed inset-0 bg-black/10 z-0" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Web3Provider>{children}</Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
