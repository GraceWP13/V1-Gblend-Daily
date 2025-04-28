"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"
import { ethers } from "ethers"
import { CHAIN_ID, RPC_URL } from "@/lib/constants"

interface Web3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: () => Promise<void>
  isCorrectNetwork: boolean
}

export const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  connect: async () => {},
  disconnect: () => {},
  switchNetwork: async () => {},
  isCorrectNetwork: false,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)

  // Initialize provider from window.ethereum if available
  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          setProvider(provider)

          // Check if already connected
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            const signer = await provider.getSigner()
            setSigner(signer)

            // Check network
            const network = await provider.getNetwork()
            setIsCorrectNetwork(network.chainId.toString() === CHAIN_ID.toString())
          }

          // Listen for account changes
          window.ethereum.on("accountsChanged", handleAccountsChanged)
          window.ethereum.on("chainChanged", handleChainChanged)
        } catch (error) {
          console.error("Error initializing provider:", error)
        }
      }
    }

    initProvider()

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      setSigner(null)
    } else if (provider) {
      // User switched accounts
      const signer = await provider.getSigner()
      setSigner(signer)
    }
  }

  const handleChainChanged = async () => {
    if (provider) {
      const network = await provider.getNetwork()
      setIsCorrectNetwork(network.chainId.toString() === CHAIN_ID.toString())
    }
  }

  const connect = async () => {
    if (!provider) return

    try {
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      setSigner(signer)

      // Check network
      const network = await provider.getNetwork()
      setIsCorrectNetwork(network.chainId.toString() === CHAIN_ID.toString())
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const disconnect = () => {
    setSigner(null)
  }

  const switchNetwork = async () => {
    if (!provider) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${Number(CHAIN_ID).toString(16)}` }],
      })
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${Number(CHAIN_ID).toString(16)}`,
                chainName: "Fluent Devnet",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [RPC_URL],
                blockExplorerUrls: ["https://explorer.dev.gblend.xyz/"],
              },
            ],
          })
        } catch (addError) {
          console.error("Error adding network:", addError)
        }
      } else {
        console.error("Error switching network:", error)
      }
    }
  }

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        connect,
        disconnect,
        switchNetwork,
        isCorrectNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
