"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccount } from "@/hooks/use-account"
import { hasNFT, checkBalance } from "@/lib/contract"
import { Loader2, Wallet, ExternalLink } from "lucide-react"

export function WalletConnect() {
  const router = useRouter()
  const { address, isConnected, connect, disconnect, isCorrectNetwork, switchNetwork } = useAccount()
  const [checkingNFT, setCheckingNFT] = useState(false)
  const [hasRequiredNFT, setHasRequiredNFT] = useState(false)
  const [balance, setBalance] = useState<string>("0")

  useEffect(() => {
    if (isConnected && address) {
      setCheckingNFT(true)
      Promise.all([hasNFT(address), checkBalance(address)])
        .then(([result, userBalance]) => {
          setHasRequiredNFT(result)
          setBalance(userBalance)
        })
        .catch((error) => {
          console.error("Error checking NFT:", error)
        })
        .finally(() => {
          setCheckingNFT(false)
        })
    }
  }, [isConnected, address])

  const handleConnect = async () => {
    await connect()
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const handleContinue = () => {
    if (hasRequiredNFT) {
      router.push("/attendance")
    } else {
      router.push("/claim")
    }
  }

  const hasBalance = Number.parseFloat(balance) > 0

  return (
    <>
      <Card className="w-full backdrop-blur-md bg-white/20 border border-purple-300/50 shadow-lg">
        <CardHeader className="bg-purple-900/50 border-b border-purple-400/30">
          <CardTitle className="text-white font-bold">Connect Your Wallet</CardTitle>
          <CardDescription className="text-purple-100 font-medium">
            Connect your wallet to access the Gblend Daily Attendance app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-purple-900/30 backdrop-blur-sm rounded-lg border border-purple-300/30 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mr-3 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Connected Wallet</p>
                      <p className="text-xs font-medium text-purple-100">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="border-purple-300/50 bg-white/20 text-white font-medium hover:bg-white/30"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>

              {!isCorrectNetwork && (
                <div className="p-4 bg-purple-900/30 backdrop-blur-sm text-white rounded-lg border border-purple-300/30 shadow-sm">
                  <h3 className="text-sm font-bold">Wrong Network</h3>
                  <p className="text-xs font-medium mt-1 mb-2">Please switch to Fluent Devnet to continue</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-purple-300/50 bg-white/20 text-white font-medium"
                    onClick={switchNetwork}
                  >
                    Switch to Fluent Devnet
                  </Button>
                </div>
              )}

              {isCorrectNetwork && (
                <div className="space-y-4">
                  <div className="p-3 bg-purple-900/30 backdrop-blur-sm rounded-md border border-purple-300/30 shadow-sm">
                    <p className="text-sm font-bold text-white">Your Balance:</p>
                    <p className={`text-sm font-medium ${hasBalance ? "text-green-300" : "text-red-300"}`}>
                      {balance} ETH
                    </p>
                    {!hasBalance && (
                      <p className="text-xs font-medium text-red-300 mt-1">
                        You need tokens to pay for gas fees. Please get tokens from the faucet.
                      </p>
                    )}
                  </div>

                  <div className="text-center">
                    {checkingNFT ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-300" />
                        <span className="text-sm font-medium text-white">Checking NFT status...</span>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-md"
                        onClick={handleContinue}
                      >
                        {hasRequiredNFT ? "Go to Attendance" : "Claim NFT"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-md">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Connect Your Wallet</h3>
                <p className="text-sm font-medium text-purple-100 mt-1 mb-4">
                  Connect your wallet to access the Gblend Daily Attendance app
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-md"
                  onClick={handleConnect}
                >
                  Connect Wallet
                </Button>
              </div>

              <div className="text-xs text-center text-purple-100 font-medium">
                <p>
                  Don't have a wallet?{" "}
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-300 font-bold hover:underline inline-flex items-center"
                  >
                    Get MetaMask <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-5 sm:mt-8 p-4 sm:p-6 bg-white/20 backdrop-blur-md rounded-lg border border-purple-300/50 shadow-lg">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-white">How it works:</h3>
        <ol className="list-decimal list-inside space-y-2 sm:space-y-3 text-xs sm:text-sm font-medium text-purple-100">
          <li>Connect your wallet</li>
          <li className="font-bold text-pink-300">
            Claim faucet at{" "}
            <a
              href="https://faucet.dev.gblend.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline inline-flex items-center"
            >
              https://faucet.dev.gblend.xyz/ <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
            <div className="block text-xs mt-1 font-medium text-pink-300 bg-purple-900/30 backdrop-blur-sm p-2 rounded-md border border-purple-300/30 shadow-sm">
              ⚠️ <strong>IMPORTANT:</strong> You MUST have tokens to pay for gas fees! After requesting from the faucet,
              wait for the transaction to complete and tokens to appear in your wallet.
            </div>
          </li>
          <li>Mint NFT Gblend NFT pass to access the Gblend calendar attendance</li>
          <li>Answer quiz and mark your calendar daily</li>
          <li>Show your calendar and prove you have already Blended as Fluent community!</li>
        </ol>
      </div>
    </>
  )
}
