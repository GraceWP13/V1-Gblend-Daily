import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletStatus } from "@/components/wallet-status"

export function Header() {
  return (
    <header className="border-b border-purple-300/30 bg-purple-900/50 backdrop-blur-md relative z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎨</span>
            <span className="font-bold text-white text-shadow-md">Gblend Daily</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/attendance" passHref>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-purple-800/50">
              Calendar
            </Button>
          </Link>
          <WalletStatus />
        </nav>
      </div>
    </header>
  )
}
