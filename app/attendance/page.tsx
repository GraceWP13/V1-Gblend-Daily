"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "@/hooks/use-account"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar } from "@/components/calendar"
import { Dashboard } from "@/components/dashboard"
import { QuizModal } from "@/components/quiz-modal"
import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/social-links"
import { hasNFT } from "@/lib/contract"
import { getWalletData } from "@/lib/wallet-storage"

export default function AttendancePage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [hasRequiredNFT, setHasRequiredNFT] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showQuiz, setShowQuiz] = useState(false)

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

    const checkNFT = async () => {
      try {
        const hasToken = await hasNFT(address)
        setHasRequiredNFT(hasToken)
      } catch (error) {
        console.error("Error checking NFT:", error)
      } finally {
        setLoading(false)
      }
    }

    checkNFT()
  }, [address, isConnected, router])

  // Check if user has already marked attendance today
  const [canMarkToday, setCanMarkToday] = useState(false)

  useEffect(() => {
    if (!address) return

    const today = getTodayUTC()

    // Check if today is already marked in wallet storage
    const todayMarked = getWalletData(address, `attendance-${today}`, false)

    // Also check legacy storage format
    let legacyMarked = false
    try {
      legacyMarked = localStorage.getItem(`gblend-attendance-${address}-${today}`) !== null
    } catch (e) {
      console.log("Error checking legacy storage:", e)
    }

    setCanMarkToday(!todayMarked && !legacyMarked)
  }, [address])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container flex items-center justify-center">
          <div className="animate-pulse text-white font-bold bg-purple-900/50 px-4 py-2 rounded-md shadow-md">
            Loading...
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!hasRequiredNFT) {
    router.push("/claim")
    return null
  }

  const handleMarkAttendance = () => {
    setShowQuiz(true)
  }

  const handleQuizComplete = (success: boolean) => {
    setShowQuiz(false)
    if (success) {
      setCanMarkToday(false)
      // Force refresh to update calendar
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Header />
      <div className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-4 bg-purple-900/50 backdrop-blur-md p-4 rounded-lg border border-purple-400/30 shadow-md">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Gblend Attendance 🎨</h1>
          <p className="text-white font-medium">Mark your attendance daily to show your loyalty to Fluent</p>
        </div>

        <SocialLinks />

        {/* Dashboard Section */}
        <Dashboard address={address} />

        <Calendar address={address} />

        <div className="mt-8 text-center">
          {canMarkToday ? (
            <Button
              size="lg"
              onClick={handleMarkAttendance}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg"
            >
              Mark Today's Attendance
            </Button>
          ) : (
            <Button size="lg" disabled className="bg-purple-400/60 text-white font-bold cursor-not-allowed shadow-md">
              Already Marked Today
            </Button>
          )}
        </div>
      </div>

      {showQuiz && <QuizModal onComplete={handleQuizComplete} />}

      <Footer />
    </div>
  )
}
