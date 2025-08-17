"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

interface SecurityQuizProps {
  quiz: {
    question: string
    options: string[]
    correct: number
    explanation: string
  }
  onNext?: (isCorrect: boolean) => void
  showNext?: boolean
}

export function SecurityQuiz({ quiz, onNext, showNext = false }: SecurityQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    setShowResult(true)
  }

  const isCorrect = selectedAnswer === quiz.correct

  const handleNext = () => {
    if (onNext) {
      onNext(isCorrect)
    }
  }

  return (
    <Card className="max-w-[80%] bg-gray-800/70 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-cyan-500" />
          Security Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
          <p className="font-medium">{quiz.question}</p>
        </div>

        <div className="space-y-2">
          {quiz.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full justify-start text-left h-auto p-3 ${
                showResult
                  ? index === quiz.correct
                    ? "border-green-500 bg-green-500/10"
                    : selectedAnswer === index
                      ? "border-red-500 bg-red-500/10"
                      : "border-gray-600"
                  : "border-gray-600 hover:border-cyan-500"
              }`}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="flex-1">{option}</span>
                {showResult && index === quiz.correct && <CheckCircle className="h-4 w-4 text-green-500" />}
                {showResult && selectedAnswer === index && index !== quiz.correct && (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {showResult && (
          <div
            className={`p-4 rounded-lg border ${
              isCorrect ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isCorrect ? "default" : "destructive"}>{isCorrect ? "Correct!" : "Incorrect"}</Badge>
            </div>
            <p className="text-sm text-gray-300">{quiz.explanation}</p>
            {showNext && (
              <div className="mt-4 text-center">
                <Button onClick={handleNext} className="bg-cyan-500 hover:bg-cyan-600">
                  Next Question →
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
