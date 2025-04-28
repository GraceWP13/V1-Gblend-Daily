"use client"

import { useContext } from "react"
import { Web3Context } from "@/components/web3-provider"

export function useAccount() {
  const context = useContext(Web3Context)

  if (!context) {
    throw new Error("useAccount must be used within a Web3Provider")
  }

  const address = context.signer?.address
  const isConnected = !!context.signer

  return {
    address,
    isConnected,
    provider: context.provider,
    signer: context.signer,
    connect: context.connect,
    disconnect: context.disconnect,
    switchNetwork: context.switchNetwork,
    isCorrectNetwork: context.isCorrectNetwork,
  }
}
