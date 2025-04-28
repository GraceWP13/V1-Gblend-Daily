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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 border border-white/50">
        <CardHeader>
          <CardTitle>Daily Quiz</CardTitle>
          <CardDescription>Answer correctly to mark your attendance for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="font-medium">{selectedQuestion.question}</div>

            <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} disabled={isSubmitted}>
              {selectedQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} disabled={isSubmitted} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>

            {isSubmitted && (
              <div
                className={`p-3 rounded-md ${
                  isCorrect
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                {isCorrect ? "Correct! Marking your attendance..." : "Incorrect. Please try again."}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onComplete(false)} className="bg-white/50 border-white/50">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || isSubmitted}
            className={
              isSubmitted ? (isCorrect ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700") : ""
            }
          >
            Submit Answer
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
