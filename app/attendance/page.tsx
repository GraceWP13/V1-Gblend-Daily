"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "@/hooks/use-account"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar } from "@/components/calendar"
import { QuizModal } from "@/components/quiz-modal"
import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/social-links"
import { hasNFT } from "@/lib/contract"

export default function AttendancePage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [hasRequiredNFT, setHasRequiredNFT] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showQuiz, setShowQuiz] = useState(false)

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

    const today = new Date().toISOString().split("T")[0]
    const lastMarked = localStorage.getItem(`gblend-attendance-${address}-last-marked`)
    const todayMarked = localStorage.getItem(`gblend-attendance-${address}-${today}`)

    setCanMarkToday(!todayMarked && lastMarked !== today)
  }, [address])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
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
      const today = new Date().toISOString().split("T")[0]
      localStorage.setItem(`gblend-attendance-${address}-${today}`, "true")
      localStorage.setItem(`gblend-attendance-${address}-last-marked`, today)
      setCanMarkToday(false)

      // Force refresh to update calendar
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Header />
      <div className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Gblend Attendance 🎨
          </h1>
          <p className="text-muted-foreground">Mark your attendance daily to show your loyalty to Fluent</p>
        </div>

        <SocialLinks />

        <Calendar address={address} />

        <div className="mt-8 text-center">
          {canMarkToday ? (
            <Button
              size="lg"
              onClick={handleMarkAttendance}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Mark Today's Attendance
            </Button>
          ) : (
            <Button size="lg" disabled>
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
