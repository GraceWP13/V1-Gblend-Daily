"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalendarProps {
  address: string
}

export function Calendar({ address }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    // Initialize with current UTC date
    const now = new Date()
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  })
  const [attendanceDays, setAttendanceDays] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Get today's date in UTC
  const getTodayUTC = () => {
    const now = new Date()
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  }

  // Format date to YYYY-MM-DD in UTC
  const formatDateUTC = (date: Date) => {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`
  }

  // Load attendance data whenever the address changes
  useEffect(() => {
    const loadAttendance = () => {
      if (!address) return

      setLoading(true)
      const days: string[] = []
      const prefix = `gblend-attendance-${address}-`

      // Get all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix) && !key.endsWith("-last-marked")) {
          const dateStr = key.replace(prefix, "")
          // Validate that it's a proper date format (YYYY-MM-DD)
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            days.push(dateStr)
          }
        }
      }

      console.log("Loaded attendance days:", days)
      setAttendanceDays(days)
      setLoading(false)
    }

    loadAttendance()
  }, [address])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(Date.UTC(year, month, 1)).getUTCDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const prevMonth = new Date(prev)
      prevMonth.setUTCMonth(prev.getUTCMonth() - 1)
      return prevMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const nextMonth = new Date(prev)
      nextMonth.setUTCMonth(prev.getUTCMonth() + 1)
      return nextMonth
    })
  }

  const renderCalendar = () => {
    const year = currentDate.getUTCFullYear()
    const month = currentDate.getUTCMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 border border-transparent"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(year, month, day))
      const dateString = formatDateUTC(date)
      const isMarked = attendanceDays.includes(dateString)
      const isToday = formatDateUTC(getTodayUTC()) === dateString

      days.push(
        <div
          key={day}
          className={cn(
            "h-12 border rounded-md flex items-center justify-center relative",
            isToday ? "border-pink-500 shadow-md" : "border-purple-300/50",
            isMarked ? "bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-sm" : "bg-white/20 backdrop-blur-sm",
          )}
        >
          <span
            className={cn("text-sm font-bold", isMarked ? "text-white" : "text-white", isToday ? "text-white" : "")}
          >
            {day}
          </span>
          {isMarked && (
            <div className="absolute bottom-1 right-1">
              <span className="text-sm">🎨</span>
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="border rounded-lg p-4 bg-white/10 backdrop-blur-md border-purple-300/50 shadow-lg">
      <div className="flex items-center justify-between mb-4 bg-purple-900/50 p-2 rounded-md border border-purple-400/30">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <h2 className="text-xl font-bold text-white">
          {monthNames[currentDate.getUTCMonth()]} {currentDate.getUTCFullYear()} (UTC)
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-sm"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 bg-purple-900/50 p-2 rounded-md border border-purple-400/30">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-bold text-white">
            {day}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="py-8 text-center text-white font-bold">Loading your attendance history...</div>
      ) : (
        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
      )}

      {attendanceDays.length > 0 && (
        <div className="mt-4 text-center text-sm font-medium text-white bg-purple-900/30 p-2 rounded-md border border-purple-300/30">
          You have marked your attendance on <span className="font-bold">{attendanceDays.length}</span> day
          {attendanceDays.length !== 1 ? "s" : ""}.
        </div>
      )}
    </div>
  )
}
