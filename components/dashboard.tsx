"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, CheckCircle, Flame } from "lucide-react"

interface DashboardProps {
  address: string
}

export function Dashboard({ address }: DashboardProps) {
  const [attendanceCount, setAttendanceCount] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [quizCount, setQuizCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!address) return

    // Load attendance data
    const loadStats = () => {
      setLoading(true)

      try {
        // Get all attendance days
        const attendanceDays: string[] = []
        const prefix = `gblend-attendance-${address}-`

        // Get all localStorage keys for attendance
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith(prefix) && !key.endsWith("-last-marked")) {
            const dateStr = key.replace(prefix, "")
            // Validate that it's a proper date format (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
              attendanceDays.push(dateStr)
            }
          }
        }

        // Sort attendance days chronologically
        attendanceDays.sort()

        // Count total attendance days
        setAttendanceCount(attendanceDays.length)

        // Calculate current streak
        if (attendanceDays.length > 0) {
          let streak = 1
          let maxStreak = 1

          // Get today and yesterday in YYYY-MM-DD format
          const today = new Date()
          const todayStr = today.toISOString().split("T")[0]

          // Check if the most recent attendance was today or yesterday
          const lastAttendance = attendanceDays[attendanceDays.length - 1]
          const lastAttendanceDate = new Date(lastAttendance)

          // If last attendance was more than 1 day ago, streak is broken
          const daysSinceLastAttendance = Math.floor(
            (today.getTime() - lastAttendanceDate.getTime()) / (1000 * 60 * 60 * 24),
          )

          if (daysSinceLastAttendance > 1) {
            setCurrentStreak(0)
          } else {
            // Calculate streak by checking consecutive days
            for (let i = 1; i < attendanceDays.length; i++) {
              const currentDate = new Date(attendanceDays[i])
              const prevDate = new Date(attendanceDays[i - 1])

              // Check if dates are consecutive
              const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

              if (dayDiff === 1) {
                streak++
                maxStreak = Math.max(maxStreak, streak)
              } else if (dayDiff > 1) {
                streak = 1
              }
            }

            setCurrentStreak(maxStreak)
          }
        }

        // Count quiz answers (same as attendance for now since quiz is required for attendance)
        setQuizCount(attendanceDays.length)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [address])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="backdrop-blur-md bg-white/20 border border-purple-300/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-purple-300" />
            <span>Total Attendance</span>
          </CardTitle>
          <CardDescription className="text-purple-100">Days you've marked attendance</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-12 animate-pulse bg-purple-300/20 rounded-md"></div>
          ) : (
            <div className="text-3xl font-bold text-white">
              {attendanceCount} <span className="text-sm text-purple-200">days</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-white/20 border border-purple-300/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-300" />
            <span>Current Streak</span>
          </CardTitle>
          <CardDescription className="text-purple-100">Consecutive days of attendance</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-12 animate-pulse bg-purple-300/20 rounded-md"></div>
          ) : (
            <div className="text-3xl font-bold text-white">
              {currentStreak} <span className="text-sm text-purple-200">days</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-white/20 border border-purple-300/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-300" />
            <span>Quizzes Answered</span>
          </CardTitle>
          <CardDescription className="text-purple-100">Correct quiz answers</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-12 animate-pulse bg-purple-300/20 rounded-md"></div>
          ) : (
            <div className="text-3xl font-bold text-white">
              {quizCount} <span className="text-sm text-purple-200">quizzes</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
