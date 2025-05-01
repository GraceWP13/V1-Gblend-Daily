"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { quizQuestions } from "@/lib/quiz-data"

interface QuizModalProps {
  onComplete: (success: boolean) => void
}

export function QuizModal({ onComplete }: QuizModalProps) {
  const [selectedQuestion] = useState(() => {
    // Randomly select one of the 5 questions
    const randomIndex = Math.floor(Math.random() * quizQuestions.length)
    return quizQuestions[randomIndex]
  })

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (!selectedAnswer) return

    const correct = selectedAnswer === selectedQuestion.correctAnswer
    setIsCorrect(correct)
    setIsSubmitted(true)

    if (correct) {
      // Delay closing the modal to show the success message
      setTimeout(() => {
        onComplete(true)
      }, 1500)
    } else {
      // Allow retry after showing the error message
      setTimeout(() => {
        setIsSubmitted(false)
        setSelectedAnswer(null)
      }, 1500)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md backdrop-blur-md bg-white/20 border border-purple-300/50 shadow-lg">
        <CardHeader className="bg-purple-900/50 border-b border-purple-400/30">
          <CardTitle className="text-white font-bold">Daily Quiz</CardTitle>
          <CardDescription className="text-purple-100 font-medium">
            Answer correctly to mark your attendance for today
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="font-bold text-white bg-purple-900/30 p-3 rounded-md border border-purple-300/30">
              {selectedQuestion.question}
            </div>

            <RadioGroup
              value={selectedAnswer || ""}
              onValueChange={setSelectedAnswer}
              disabled={isSubmitted}
              className="space-y-2"
            >
              {selectedQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/20 p-2 rounded-md border border-purple-300/30"
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    disabled={isSubmitted}
                    className="border-purple-400 text-white"
                  />
                  <Label htmlFor={`option-${index}`} className="text-white font-medium w-full cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {isSubmitted && (
              <div
                className={`p-3 rounded-md ${
                  isCorrect
                    ? "bg-green-900/50 text-green-100 border border-green-300/50"
                    : "bg-red-900/50 text-red-100 border border-red-300/50"
                } font-medium shadow-sm`}
              >
                {isCorrect ? "Correct! Marking your attendance..." : "Incorrect. Please try again."}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-purple-900/30 border-t border-purple-300/30">
          <Button
            variant="outline"
            onClick={() => onComplete(false)}
            className="bg-white/20 border-purple-300/50 text-white font-medium hover:bg-white/30 shadow-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || isSubmitted}
            className={
              isSubmitted
                ? isCorrect
                  ? "bg-green-600 hover:bg-green-700 text-white font-bold shadow-md"
                  : "bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-md"
            }
          >
            Submit Answer
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
