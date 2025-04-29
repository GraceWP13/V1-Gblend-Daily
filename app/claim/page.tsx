"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "@/hooks/use-account"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { hasNFT, claimNFT, checkBalance } from "@/lib/contract"
import { Loader2, ExternalLink, AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ManualMint } from "@/components/manual-mint"
import { SocialLinks } from "@/components/social-links"

export default function ClaimPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [hasRequiredNFT, setHasRequiredNFT] = useState(false)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const [checkingBalance, setCheckingBalance] = useState(false)
  const [showManualMint, setShowManualMint] = useState(false)

  // Get today's date in UTC format YYYY-MM-DD
  const getTodayUTC = () => {
    const now = new Date()
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`
  }

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
      return
    }

    const checkNFTAndBalance = async () => {
      try {
        const [hasToken, userBalance] = await Promise.all([hasNFT(address), checkBalance(address)])

        setHasRequiredNFT(hasToken)
        setBalance(userBalance)

        if (hasToken) {
          // Redirect to attendance page after a short delay
          setTimeout(() => {
            router.push("/attendance")
          }, 2000)
        }
      } catch (error) {
        console.error("Error checking NFT:", error)
      } finally {
        setLoading(false)
      }
    }

    checkNFTAndBalance()
  }, [address, isConnected, router])

  const handleRefreshBalance = async () => {
    if (!address) return

    setCheckingBalance(true)
    try {
      const userBalance = await checkBalance(address)
      setBalance(userBalance)
    } catch (error) {
      console.error("Error refreshing balance:", error)
    } finally {
      setCheckingBalance(false)
    }
  }

  const handleClaim = async () => {
    if (!address) return

    setClaiming(true)
    setError(null)

    try {
      const tx = await claimNFT()
      setTxHash(tx.hash)

      // Wait for transaction confirmation
      await tx.wait()

      // Check NFT again
      const hasToken = await hasNFT(address)
      setHasRequiredNFT(hasToken)

      if (hasToken) {
        setTimeout(() => {
          router.push("/attendance")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Error claiming NFT:", error)

      // Extract a user-friendly error message
      let errorMessage = "Failed to claim NFT. "

      if (error.message && error.message.includes("Insufficient balance")) {
        errorMessage = "You don't have enough tokens to pay for gas. Please get tokens from the faucet first."
      } else if (error.message && error.message.includes("user rejected")) {
        errorMessage = "Transaction was rejected. Please try again."
      } else if (error.message && error.message.includes("All mint attempts failed")) {
        errorMessage = "Unable to mint NFT. Please make sure you have tokens from the faucet and try again later."
      } else {
        errorMessage += "Please make sure you have tokens from the Fluent faucet."
      }

      setError(errorMessage)
      setShowManualMint(true)
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container flex items-center justify-center">
          <div className="animate-pulse text-gray-800">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  const hasBalance = Number.parseFloat(balance) > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Claim Your Gblend NFT
          </h1>
        </div>

        <SocialLinks />

        <Card className="w-full max-w-md backdrop-blur-sm bg-white/40 border border-white/50">
          <CardHeader>
            <CardTitle className="text-gray-800">Claim Your Gblend NFT</CardTitle>
            <CardDescription className="text-gray-700">
              You need to claim the Gblend NFT to access the attendance calendar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasRequiredNFT ? (
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-medium text-green-600 dark:text-green-400">NFT Already Claimed!</h3>
                <p className="text-sm mt-1 text-gray-800">Redirecting to attendance page...</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-64 h-64 mx-auto rounded-lg overflow-hidden relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/aurora-bg.jpeg')" }}
                  ></div>
                  <img
                    src="/images/dino-nft-pass.png"
                    alt="Gblend NFT Pass"
                    className="relative z-10 w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Gblend Attendance NFT</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    This NFT grants you access to the daily attendance system
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-md border border-white/50">
              <div>
                <p className="text-sm font-medium text-gray-800">Your Balance:</p>
                <p className={`text-sm ${hasBalance ? "text-green-600" : "text-red-600"}`}>{balance} ETH</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshBalance}
                disabled={checkingBalance}
                className="bg-white/50 border-white/50"
              >
                {checkingBalance ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span className="sr-only">Refresh balance</span>
              </Button>
            </div>

            {!hasBalance && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No tokens detected</AlertTitle>
                <AlertDescription>
                  You need tokens to pay for gas fees. Please get tokens from the{" "}
                  <a
                    href="https://faucet.dev.gblend.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                  >
                    Fluent faucet
                  </a>{" "}
                  before claiming.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {txHash && (
              <div className="text-sm p-3 bg-white/60 backdrop-blur-sm rounded-md border border-white/50">
                <p className="font-medium text-gray-800">Transaction submitted:</p>
                <a
                  href={`https://explorer.dev.gblend.xyz/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {txHash}
                </a>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!hasRequiredNFT && (
              <>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  onClick={handleClaim}
                  disabled={claiming || !hasBalance}
                >
                  {claiming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    "Claim NFT"
                  )}
                </Button>

                <div className="flex flex-col space-y-2 w-full">
                  <a
                    href="https://faucet.dev.gblend.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-center text-blue-500 hover:underline inline-flex items-center justify-center w-full"
                  >
                    Need tokens? Get them from the Fluent faucet <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </>
            )}
          </CardFooter>
        </Card>

        {showManualMint && <ManualMint />}
      </div>
      <Footer />
    </div>
  )
}
