"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WalletStatus } from "@/components/wallet-status"
import { Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-purple-300/30 bg-purple-900/50 backdrop-blur-md relative z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎨</span>
            <span className="font-bold text-white text-shadow-md">Gblend Daily</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/attendance" passHref>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-purple-800/50">
              Calendar
            </Button>
          </Link>
          <Link href="/game" passHref>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-purple-800/50">
              Tectra Runner
            </Button>
          </Link>
          <Link href="/blackjack" passHref>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-purple-800/50">
              Blackjack
            </Button>
          </Link>
          <WalletStatus />
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-purple-900/90 backdrop-blur-md border-b border-purple-300/30 z-50">
          <nav className="flex flex-col p-4 gap-2">
            <Link href="/attendance" passHref onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:text-white hover:bg-purple-800/50"
              >
                Calendar
              </Button>
            </Link>
            <Link href="/game" passHref onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:text-white hover:bg-purple-800/50"
              >
                Tectra Runner
              </Button>
            </Link>
            <Link href="/blackjack" passHref onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:text-white hover:bg-purple-800/50"
              >
                Blackjack
              </Button>
            </Link>
            <div className="mt-2">
              <WalletStatus />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
