"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function BackgroundPreview() {
  const [showOriginal, setShowOriginal] = useState(false)

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-center mb-6 space-x-4">
        <Button
          variant={showOriginal ? "outline" : "default"}
          onClick={() => setShowOriginal(false)}
          className={!showOriginal ? "bg-blue-600" : ""}
        >
          New Cityscape Background
        </Button>
        <Button
          variant={showOriginal ? "default" : "outline"}
          onClick={() => setShowOriginal(true)}
          className={showOriginal ? "bg-purple-600" : ""}
        >
          Current Aurora Background
        </Button>
      </div>

      <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-gray-200 shadow-xl">
        {/* Background Layer */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${showOriginal ? "opacity-100" : "opacity-0"}`}
          style={{
            background: "linear-gradient(to bottom right, rgb(233, 213, 255), rgb(251, 207, 232), rgb(219, 234, 254))",
          }}
        ></div>
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${showOriginal ? "opacity-0" : "opacity-100"}`}
          style={{
            backgroundImage:
              "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fluent%20Graphical-GNrwZMd516aOk5WfI7GWZ3P951glT9.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Content Layer with backdrop filter */}
        <div className="absolute inset-0 flex flex-col">
          {/* Header */}
          <div
            className={`border-b ${showOriginal ? "border-white/20 bg-white/40" : "border-blue-900/20 bg-blue-950/40"} backdrop-blur-md p-4`}
          >
            <div className="container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                <span
                  className={`font-bold ${showOriginal ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600" : "text-white"}`}
                >
                  Gblend Daily
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className={showOriginal ? "text-gray-800" : "text-white"}>
                  Calendar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={showOriginal ? "" : "border-blue-400/30 bg-blue-900/30 text-white"}
                >
                  0x1234...5678
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 container p-6 flex items-center justify-center">
            <Card
              className={`w-full max-w-md ${showOriginal ? "bg-white/40" : "bg-blue-950/40"} backdrop-blur-md border ${showOriginal ? "border-white/50" : "border-blue-800/50"}`}
            >
              <CardHeader>
                <CardTitle className={showOriginal ? "text-gray-800" : "text-white"}>Gblend Attendance 🎨</CardTitle>
                <CardDescription className={showOriginal ? "text-gray-700" : "text-blue-200"}>
                  Mark your attendance daily
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid grid-cols-7 gap-2 ${showOriginal ? "text-gray-800" : "text-white"}`}>
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-10 flex items-center justify-center rounded-md ${
                        i % 7 === 0
                          ? "bg-transparent"
                          : i === 15
                            ? `${showOriginal ? "bg-purple-100/50" : "bg-blue-800/50"} border ${showOriginal ? "border-purple-200" : "border-blue-700"}`
                            : `border ${showOriginal ? "border-gray-200" : "border-blue-800/70"}`
                      }`}
                    >
                      {i % 7 !== 0 && i + 1}
                      {i === 15 && <span className="absolute bottom-1 right-1 text-xs">🎨</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${showOriginal ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-blue-600"}`}
                >
                  Mark Today's Attendance
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Footer */}
          <div
            className={`border-t ${showOriginal ? "border-white/20 bg-white/40" : "border-blue-900/20 bg-blue-950/40"} backdrop-blur-md p-4`}
          >
            <div className="container flex justify-between items-center">
              <p className={`text-sm ${showOriginal ? "text-gray-700" : "text-blue-200"}`}>
                &copy; 2023 Gblend Daily Attendance
              </p>
              <p className={`text-sm ${showOriginal ? "text-gray-700" : "text-blue-200"}`}>Built with ❤️ for Fluent</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-2 text-gray-800">Background Preview Notes:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>The new background creates a night cityscape aesthetic with blue and orange tones</li>
          <li>Text colors have been adjusted to be readable against the darker background</li>
          <li>UI elements use a dark blue semi-transparent background with blur effects</li>
          <li>The overall mood is more urban and tech-focused compared to the current aurora theme</li>
          <li>This is just a preview - no changes have been applied to your actual app</li>
        </ul>
      </div>
    </div>
  )
}
