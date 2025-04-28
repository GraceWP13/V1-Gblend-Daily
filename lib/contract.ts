"use client"

import { ethers } from "ethers"
import { NFT_CONTRACT_ADDRESS } from "./constants"

// Simplified ABI for balance checking
const NFT_ABI = ["function balanceOf(address owner) view returns (uint256)"]

export async function hasNFT(address: string): Promise<boolean> {
  if (!address || typeof window === "undefined" || !window.ethereum) {
    return false
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider)

    const balance = await contract.balanceOf(address)
    return balance > 0
  } catch (error) {
    console.error("Error checking NFT balance:", error)
    return false
  }
}

export async function checkBalance(address: string): Promise<string> {
  if (!address || typeof window === "undefined" || !window.ethereum) {
    return "0"
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const balance = await provider.getBalance(address)
    return ethers.formatEther(balance)
  } catch (error) {
    console.error("Error checking balance:", error)
    return "0"
  }
}

export async function claimNFT() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No ethereum provider found")
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const address = await signer.getAddress()

  // Check if user has enough balance for gas
  const balance = await provider.getBalance(address)
  if (balance === BigInt(0)) {
    throw new Error("Insufficient balance for gas. Please get tokens from the faucet first.")
  }

  // Try with a specific function signature for mint(address)
  try {
    // This is the function signature for mint(address)
    const data = ethers.concat([
      // Function selector for "mint(address)"
      ethers
        .id("mint(address)")
        .slice(0, 10),
      // Pad the address to 32 bytes
      ethers.zeroPadValue(address, 32),
    ])

    const tx = await signer.sendTransaction({
      to: NFT_CONTRACT_ADDRESS,
      data: data,
    })

    return tx
  } catch (error) {
    console.error("Mint with address parameter failed:", error)

    // Try with a simple mint() function
    try {
      const tx = await signer.sendTransaction({
        to: NFT_CONTRACT_ADDRESS,
        data: ethers.id("mint()").slice(0, 10),
      })
      return tx
    } catch (error) {
      console.error("Simple mint() failed:", error)

      // Try with claim() function
      try {
        const tx = await signer.sendTransaction({
          to: NFT_CONTRACT_ADDRESS,
          data: ethers.id("claim()").slice(0, 10),
        })
        return tx
      } catch (error) {
        console.error("claim() failed:", error)

        // If all attempts fail, throw a comprehensive error
        throw new Error(
          "All mint attempts failed. Please make sure you have tokens from the faucet and try again later.",
        )
      }
    }
  }
}
