import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletStatus } from "@/components/wallet-status"

export function Header() {
  return (
    <header className="border-b border-white/20 bg-white/40 backdrop-blur supports-[backdrop-filter]:bg-white/30 relative z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎨</span>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Gblend Daily
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/attendance" passHref>
            <Button variant="ghost" className="text-gray-800 hover:text-gray-900 hover:bg-white/50">
              Calendar
            </Button>
          </Link>
          <WalletStatus />
        </nav>
      </div>
    </header>
  )
}
