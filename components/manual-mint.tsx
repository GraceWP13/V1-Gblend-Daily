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
    <Card className="mt-6 backdrop-blur-sm bg-white/40 border border-white/50">
      <CardHeader>
        <CardTitle className="text-gray-800">Having trouble minting?</CardTitle>
        <CardDescription className="text-gray-700">Try these alternative methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-800">
            If the automatic minting isn't working, you can try interacting with the contract directly:
          </p>

          <div className="p-3 bg-white/60 backdrop-blur-sm rounded-md flex items-center justify-between border border-white/50">
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-gray-800">Contract Address:</p>
              <p className="text-xs break-all text-gray-700">{NFT_CONTRACT_ADDRESS}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
          <a
            href={`https://explorer.dev.gblend.xyz/address/${NFT_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="outline" className="w-full bg-white/50 border-white/50">
              <span className="text-gray-800">View Contract in Explorer</span> <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <p className="text-xs text-center text-gray-700">
            In the explorer, connect your wallet and try calling the contract's mint function directly
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
