"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NFT_CONTRACT_ADDRESS } from "@/lib/constants"
import { ExternalLink, Copy, Check } from "lucide-react"

export function ManualMint() {
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(NFT_CONTRACT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="mt-6 backdrop-blur-md bg-white/90 border border-amber-200 shadow-lg">
      <CardHeader className="bg-amber-50/90 border-b border-amber-200">
        <CardTitle className="text-amber-950 font-bold">Having trouble minting?</CardTitle>
        <CardDescription className="text-amber-800 font-medium">Try these alternative methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <p className="text-sm text-amber-900 font-medium">
            If the automatic minting isn't working, you can try interacting with the contract directly:
          </p>

          <div className="p-3 bg-amber-50/90 backdrop-blur-sm rounded-md flex items-center justify-between border border-amber-200 shadow-sm">
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-amber-950">Contract Address:</p>
              <p className="text-xs break-all text-amber-800 font-medium">{NFT_CONTRACT_ADDRESS}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-100/90"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-amber-50/90 border-t border-amber-200">
        <div className="w-full space-y-2">
          <a
            href={`https://explorer.dev.gblend.xyz/address/${NFT_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full bg-amber-100/90 border-amber-300 text-amber-950 hover:bg-amber-200/90 font-medium shadow-sm"
            >
              View Contract in Explorer <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <p className="text-xs text-center text-amber-800 font-medium">
            In the explorer, connect your wallet and try calling the contract's mint function directly
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
