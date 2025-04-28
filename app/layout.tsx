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
        {/* Aurora-like background with multiple layers for depth */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 z-0"></div>
        <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-purple-300/30 to-blue-300/30 z-0"></div>
        <div className="fixed inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/360_F_1076259957_a82ZDqRzC85S5ADSE0l8fZwQ6AJCCBl5.jpg-bdn2eysC91Y7zB5DwPYAAvx7e0gq25.jpeg')] bg-cover bg-center opacity-60 mix-blend-soft-light pointer-events-none z-0"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-100/30 z-0"></div>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Web3Provider>{children}</Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
