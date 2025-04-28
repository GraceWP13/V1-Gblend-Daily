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
        <CardTitle>Having trouble minting?</CardTitle>
        <CardDescription>Try these alternative methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm">
            If the automatic minting isn't working, you can try interacting with the contract directly:
          </p>

          <div className="p-3 bg-muted rounded-md flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-medium">Contract Address:</p>
              <p className="text-xs break-all">{NFT_CONTRACT_ADDRESS}</p>
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
            <Button variant="outline" className="w-full">
              View Contract in Explorer <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <p className="text-xs text-center text-muted-foreground">
            In the explorer, connect your wallet and try calling the contract's mint function directly
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
