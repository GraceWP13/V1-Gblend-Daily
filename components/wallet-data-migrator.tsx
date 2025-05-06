"use client"

import { useEffect } from "react"
import { useAccount } from "@/hooks/use-account"
import { migrateToWalletStorage } from "@/lib/wallet-storage"

export function WalletDataMigrator() {
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && address) {
      // Migrate any legacy data to wallet-specific storage
      migrateToWalletStorage(address)
    }
  }, [address, isConnected])

  // This is a utility component that doesn't render anything
  return null
}
