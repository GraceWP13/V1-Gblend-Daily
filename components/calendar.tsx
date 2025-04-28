"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalendarProps {
  address: string
}

export function Calendar({ address }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [attendanceDays, setAttendanceDays] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

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
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const prevMonth = new Date(prev)
      prevMonth.setMonth(prev.getMonth() - 1)
      return prevMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const nextMonth = new Date(prev)
      nextMonth.setMonth(prev.getMonth() + 1)
      return nextMonth
    })
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 border border-transparent"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = date.toISOString().split("T")[0]
      const isMarked = attendanceDays.includes(dateString)
      const isToday = new Date().toISOString().split("T")[0] === dateString

      days.push(
        <div
          key={day}
          className={cn(
            "h-12 border rounded-md flex items-center justify-center relative",
            isToday ? "border-blue-500" : "border-gray-200 dark:border-gray-800",
            isMarked ? "bg-purple-50/50 backdrop-blur-sm dark:bg-purple-900/20" : "",
          )}
        >
          <span className={cn("text-sm", isToday ? "font-bold" : "")}>{day}</span>
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
    <div className="border rounded-lg p-4 bg-white/40 backdrop-blur-sm border-white/50">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevMonth} className="bg-white/50 border-white/50">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <Button variant="outline" size="icon" onClick={handleNextMonth} className="bg-white/50 border-white/50">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">Loading your attendance history...</div>
      ) : (
        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
      )}

      {attendanceDays.length > 0 && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          You have marked your attendance on {attendanceDays.length} day{attendanceDays.length !== 1 ? "s" : ""}.
        </div>
      )}
    </div>
  )
}
