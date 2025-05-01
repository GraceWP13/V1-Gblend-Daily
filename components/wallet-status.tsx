"use client"

import { Button } from "@/components/ui/button"
import { useAccount } from "@/hooks/use-account"
import { Wallet } from "lucide-react"

export function WalletStatus() {
  const { address, isConnected, connect, disconnect } = useAccount()

  if (!isConnected) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={connect}
        className="border-purple-400/50 bg-purple-800/70 text-white hover:bg-purple-700/80"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={disconnect}
      className="border-purple-400/50 bg-purple-800/70 text-white hover:bg-purple-700/80"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {address?.slice(0, 6)}...{address?.slice(-4)}
    </Button>
  )
}
