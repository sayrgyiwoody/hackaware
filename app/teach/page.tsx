"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, ArrowRight, BookOpen, Award, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

type QuizQuestion = {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which of these is a sign of a phishing attempt?",
    options: [
      "An email from your bank asking you to verify your account by clicking a link",
      "A message from a colleague with a shared document from your company's official domain",
      "An email newsletter you subscribed to",
      "A password reset email you requested",
    ],
    correctAnswer: 0,
    explanation:
      "Legitimate banks never ask you to verify your account by clicking on a link in an email. They will ask you to go directly to their website by typing the URL in your browser.",
  },
  {
    id: 2,
    question: "What is a strong password practice?",
    options: [
      "Using the same password for all accounts so you don't forget it",
      "Creating passwords with personal information like birthdays",
      "Using a unique passphrase with a mix of characters for each account",
      "Changing your password every day",
    ],
    correctAnswer: 2,
    explanation:
      "Using unique passphrases with a mix of uppercase, lowercase, numbers, and special characters provides the best security. Password managers can help you create and store these.",
  },
  {
    id: 3,
    question: "What should you do if you suspect your device has malware?",
    options: [
      "Ignore it as long as your device still works",
      "Disconnect from the internet and run a security scan",
      "Share your concerns on social media",
      "Download more security software from any website",
    ],
    correctAnswer: 1,
    explanation:
      "Disconnecting from the internet prevents the malware from sending your data out or downloading additional malicious code. Running a security scan from reputable software can help identify and remove the threat.",
  },
]

export default function TeachPage() {
  const [currentLevel, setCurrentLevel] = useState("beginner")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return
    setSelectedAnswer(answerIndex)
  }

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return

    setIsAnswered(true)
    if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    // Update progress
    setProgress(((currentQuestion + 1) / quizQuestions.length) * 100)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setProgress(0)
  }

  const isLastQuestion = currentQuestion === quizQuestions.length - 1
  const isQuizComplete = isAnswered && isLastQuestion

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-cyan-500 mr-2" />
              <span className="font-bold">Teach Me Mode</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl py-8 px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-500" />
              <h2 className="text-xl font-bold">Cybersecurity Basics</h2>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>
                Score: {score}/{quizQuestions.length}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-gray-700">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
          </Progress>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Learning Levels</CardTitle>
                <CardDescription>Progress through all levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={currentLevel === "beginner" ? "default" : "outline"}
                  className={
                    currentLevel === "beginner"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 w-full justify-start"
                      : "w-full justify-start"
                  }
                  onClick={() => setCurrentLevel("beginner")}
                >
                  Beginner
                </Button>
                <Button
                  variant={currentLevel === "intermediate" ? "default" : "outline"}
                  className={
                    currentLevel === "intermediate"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 w-full justify-start"
                      : "w-full justify-start"
                  }
                  onClick={() => setCurrentLevel("intermediate")}
                  disabled
                >
                  Intermediate
                </Button>
                <Button
                  variant={currentLevel === "advanced" ? "default" : "outline"}
                  className={
                    currentLevel === "advanced"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 w-full justify-start"
                      : "w-full justify-start"
                  }
                  onClick={() => setCurrentLevel("advanced")}
                  disabled
                >
                  Advanced
                </Button>
                <Button
                  variant={currentLevel === "expert" ? "default" : "outline"}
                  className={
                    currentLevel === "expert"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 w-full justify-start"
                      : "w-full justify-start"
                  }
                  onClick={() => setCurrentLevel("expert")}
                  disabled
                >
                  Expert
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card className="bg-gray-800/50 border-gray-700">
              {!isQuizComplete ? (
                <>
                  <CardHeader>
                    <CardTitle>
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </CardTitle>
                    <CardDescription>Select the best answer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-4">{quizQuestions[currentQuestion].question}</h3>
                    <RadioGroup value={selectedAnswer?.toString()} className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 p-3 rounded-lg border ${
                            isAnswered
                              ? index === quizQuestions[currentQuestion].correctAnswer
                                ? "border-green-500 bg-green-500/10"
                                : selectedAnswer === index
                                  ? "border-red-500 bg-red-500/10"
                                  : "border-gray-700"
                              : "border-gray-700 hover:border-cyan-500/50 cursor-pointer"
                          }`}
                          onClick={() => handleAnswerSelect(index)}
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`option-${index}`}
                            disabled={isAnswered}
                            checked={selectedAnswer === index}
                          />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                          {isAnswered && index === quizQuestions[currentQuestion].correctAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {isAnswered &&
                            selectedAnswer === index &&
                            index !== quizQuestions[currentQuestion].correctAnswer && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                        </div>
                      ))}
                    </RadioGroup>

                    {isAnswered && (
                      <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                        <h4 className="font-medium mb-2">Explanation:</h4>
                        <p>{quizQuestions[currentQuestion].explanation}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => (currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : null)}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </Button>
                    {!isAnswered ? (
                      <Button
                        onClick={handleCheckAnswer}
                        disabled={selectedAnswer === null}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      >
                        {isLastQuestion ? "See Results" : "Next Question"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle>Quiz Complete!</CardTitle>
                    <CardDescription>
                      You scored {score} out of {quizQuestions.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/20 mb-6">
                        <Award className="h-12 w-12 text-cyan-500" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {score === quizQuestions.length
                          ? "Perfect Score!"
                          : score >= quizQuestions.length / 2
                            ? "Good Job!"
                            : "Keep Learning!"}
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {score === quizQuestions.length
                          ? "You're a cybersecurity expert!"
                          : score >= quizQuestions.length / 2
                            ? "You're on your way to becoming a cybersecurity expert."
                            : "Don't worry, cybersecurity is a journey. Keep practicing!"}
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={handleRestartQuiz}>
                          Restart Quiz
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                          asChild
                        >
                          <Link href="/chat">Chat with CyGuard</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
