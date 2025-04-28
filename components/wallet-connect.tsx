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
      <Card className="w-full backdrop-blur-sm bg-white/40 border border-white/50">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>Connect your wallet to access the Gblend Daily Attendance app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full mr-3 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Connected Wallet</p>
                      <p className="text-xs text-muted-foreground">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="bg-white/70 border-white/50"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>

              {!isCorrectNetwork && (
                <div className="p-4 bg-amber-50/80 backdrop-blur-sm text-amber-800 rounded-lg border border-amber-200/50">
                  <h3 className="text-sm font-medium">Wrong Network</h3>
                  <p className="text-xs mt-1 mb-2">Please switch to Fluent Devnet to continue</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-amber-200 bg-white/50"
                    onClick={switchNetwork}
                  >
                    Switch to Fluent Devnet
                  </Button>
                </div>
              )}

              {isCorrectNetwork && (
                <div className="space-y-4">
                  <div className="p-3 bg-white/60 backdrop-blur-sm rounded-md border border-white/50">
                    <p className="text-sm font-medium">Your Balance:</p>
                    <p className={`text-sm ${hasBalance ? "text-green-600" : "text-red-600"}`}>{balance} ETH</p>
                    {!hasBalance && (
                      <p className="text-xs text-red-500 mt-1">
                        You need tokens to pay for gas fees. Please get tokens from the faucet.
                      </p>
                    )}
                  </div>

                  <div className="text-center">
                    {checkingNFT ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Checking NFT status...</span>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
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
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Connect your wallet to access the Gblend Daily Attendance app
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  onClick={handleConnect}
                >
                  Connect Wallet
                </Button>
              </div>

              <div className="text-xs text-center text-muted-foreground">
                <p>
                  Don't have a wallet?{" "}
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center"
                  >
                    Get MetaMask <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 p-6 bg-white/30 backdrop-blur-sm rounded-lg border border-white/50">
        <h3 className="text-lg font-medium mb-4">How it works:</h3>
        <ol className="list-decimal list-inside space-y-3 text-sm">
          <li>Connect your wallet</li>
          <li className="font-medium text-blue-600 dark:text-blue-400">
            Claim faucet at{" "}
            <a
              href="https://faucet.dev.gblend.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline inline-flex items-center"
            >
              https://faucet.dev.gblend.xyz/ <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
            <div className="block text-xs mt-1 font-normal text-blue-500 bg-blue-50/70 backdrop-blur-sm p-2 rounded-md border border-blue-100/50">
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
