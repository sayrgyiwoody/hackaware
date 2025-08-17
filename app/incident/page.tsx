"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, ArrowLeft, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

type Step = {
  id: number
  title: string
  description: string
  type: "radio" | "text"
  options?: string[]
}

const steps: Step[] = [
  {
    id: 1,
    title: "What happened?",
    description: "Select the type of incident you experienced",
    type: "radio",
    options: [
      "I clicked on a suspicious link",
      "I shared personal information",
      "I downloaded a suspicious file",
      "My account was hacked",
      "I received a suspicious email/message",
      "Other issue",
    ],
  },
  {
    id: 2,
    title: "When did it happen?",
    description: "Select when the incident occurred",
    type: "radio",
    options: [
      "Just now (within the last hour)",
      "Today (within 24 hours)",
      "This week",
      "More than a week ago",
      "I'm not sure",
    ],
  },
  {
    id: 3,
    title: "Additional details",
    description: "Please provide any additional information that might help us assess the situation",
    type: "text",
  },
]

export default function IncidentPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  const handleRadioChange = (value: string) => {
    setAnswers({ ...answers, [steps[currentStep].id]: value })
  }

  const handleTextChange = (value: string) => {
    setAnswers({ ...answers, [steps[currentStep].id]: value })
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers({})
    setIsComplete(false)
  }

  const isNextDisabled = !answers[steps[currentStep]?.id]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-cyan-500 mr-2" />
              <span className="font-bold">Incident Response</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl py-8 px-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle>Security Incident Assistant</CardTitle>
            <CardDescription>Let's walk through what happened and determine the best course of action</CardDescription>
          </CardHeader>
          <CardContent>
            {!isComplete ? (
              <>
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span>
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-700">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                  </Progress>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{steps[currentStep].title}</h3>
                    <p className="text-gray-400 mb-6">{steps[currentStep].description}</p>
                  </div>

                  {steps[currentStep].type === "radio" && (
                    <RadioGroup
                      value={answers[steps[currentStep].id]}
                      onValueChange={handleRadioChange}
                      className="space-y-3"
                    >
                      {steps[currentStep].options?.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700 hover:border-cyan-500/50 cursor-pointer"
                          onClick={() => handleRadioChange(option)}
                        >
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {steps[currentStep].type === "text" && (
                    <Textarea
                      placeholder="Please describe what happened in detail..."
                      className="min-h-[150px] bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                      value={answers[steps[currentStep].id] || ""}
                      onChange={(e) => handleTextChange(e.target.value)}
                    />
                  )}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isNextDisabled}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    {currentStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/20 mb-6">
                    <Shield className="h-12 w-12 text-cyan-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Analysis Complete</h3>
                  <p className="text-gray-400 mb-6">
                    Based on the information you provided, we've analyzed your incident and prepared recommendations.
                  </p>
                </div>

                <Card className="bg-gray-800/70 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Incident Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-500/20 p-1.5 rounded-full">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Risk Level: Medium</h4>
                        <p className="text-sm text-gray-400">
                          Based on your description, this incident poses a moderate risk to your digital security.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-cyan-500/20 p-1.5 rounded-full">
                        <Shield className="h-4 w-4 text-cyan-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Immediate Actions Required</h4>
                        <ul className="text-sm text-gray-400 list-disc pl-5 mt-1 space-y-1">
                          <li>Change passwords for any potentially affected accounts</li>
                          <li>Enable two-factor authentication where available</li>
                          <li>Monitor your accounts for suspicious activity</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/70 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500/20 p-1.5 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Secure Your Accounts</h4>
                        <p className="text-sm text-gray-400">
                          Update passwords for all important accounts, especially those that share the same password.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-green-500/20 p-1.5 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Run a Security Scan</h4>
                        <p className="text-sm text-gray-400">
                          Use reputable antivirus software to scan your device for potential malware.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-green-500/20 p-1.5 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Monitor Financial Statements</h4>
                        <p className="text-sm text-gray-400">
                          Check your bank and credit card statements for unauthorized transactions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    Start Over
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    asChild
                  >
                    <Link href="/chat">Chat with CyGuard for Help</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
