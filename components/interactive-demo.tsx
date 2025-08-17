"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Code, Shield } from "lucide-react"
import { useState } from "react"

interface InteractiveDemoProps {
  demo: {
    title: string
    description: string
    steps: Array<{
      step: number
      action: string
      code: string
    }>
    prevention: string
  }
}

export function InteractiveDemo({ demo }: InteractiveDemoProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const playDemo = () => {
    setIsPlaying(true)
    setCurrentStep(0)

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demo.steps.length - 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }

  return (
    <Card className="max-w-[80%] bg-gray-800/70 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-cyan-500" />
          {demo.title}
        </CardTitle>
        <p className="text-sm text-gray-400">{demo.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={playDemo} disabled={isPlaying} className="bg-cyan-500 hover:bg-cyan-600">
            <Play className="h-3 w-3 mr-1" />
            {isPlaying ? "Playing..." : "Play Demo"}
          </Button>
          <Badge variant="outline" className="border-cyan-500 text-cyan-500">
            Interactive
          </Badge>
        </div>

        <div className="space-y-3">
          {demo.steps.map((step, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all ${
                index <= currentStep ? "border-cyan-500/50 bg-cyan-500/10" : "border-gray-600 bg-gray-800/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={index <= currentStep ? "default" : "outline"}
                  className={index <= currentStep ? "bg-cyan-500" : ""}
                >
                  Step {step.step}
                </Badge>
                <span className="text-sm font-medium">{step.action}</span>
              </div>
              <pre className="text-xs bg-gray-900/50 p-2 rounded overflow-x-auto">
                <code>{step.code}</code>
              </pre>
            </div>
          ))}
        </div>

        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <h4 className="font-medium mb-1 flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            Prevention:
          </h4>
          <p className="text-sm text-gray-300">{demo.prevention}</p>
        </div>
      </CardContent>
    </Card>
  )
}
