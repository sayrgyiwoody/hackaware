"use client"

import { useState, RefObject } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Shield,
  HelpCircle,
  Scan,
  PauseOctagon,
  Send,
  Eye,
  Code,
  CheckCircle,
} from "lucide-react"

interface InputTabsProps {
  input: string
  setInput: (val: string) => void
  textareaRef: RefObject<HTMLTextAreaElement>
  inputContainerRef: RefObject<HTMLDivElement>
  isRendering: boolean
  handleSendMessage: () => void
  handleStop: () => void

  // Suggestions
  suggestions: string[]
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
  filterSuggestions: (val: string) => void
  selectSuggestion: (val: string) => void

  // URL Scan
  urlToScan: string
  setUrlToScan: (val: string) => void
  isUrlScanning: boolean
  scanUrl: () => void
  showAnalysisModal: boolean
  setShowAnalysisModal: (val: boolean) => void
}

export default function InputTabs({
  input,
  setInput,
  textareaRef,
  inputContainerRef,
  isRendering,
  handleSendMessage,
  handleStop,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  filterSuggestions,
  selectSuggestion,
  urlToScan,
  setUrlToScan,
  isUrlScanning,
  scanUrl,
  showAnalysisModal,
  setShowAnalysisModal,
}: InputTabsProps) {
  const [activeTab, setActiveTab] = useState("text")

  return (
    <div className="w-full max-w-4xl p-4 border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 lg:rounded-xl mx-auto lg:mb-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="text">General Chat</TabsTrigger>
          <TabsTrigger value="url">URL Scan</TabsTrigger>
          <TabsTrigger value="quiz">Security Quiz</TabsTrigger>
        </TabsList>

        {/* GENERAL CHAT */}
        <TabsContent value="text" className="mt-0">
          <div ref={inputContainerRef} className="relative">
            {showSuggestions && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-gray-300 border-b border-gray-700 last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  filterSuggestions(e.target.value)

                  const el = textareaRef.current
                  if (el) {
                    el.style.height = "auto"
                    el.style.height = el.scrollHeight + "px"
                  }
                }}
                rows={1}
                placeholder="Ask about web security, vulnerabilities, best practices..."
                className="min-h-[60px] bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500 overflow-hidden resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    if (!isRendering) {
                      handleSendMessage()
                    }
                  }
                  if (e.key === "Escape") {
                    setShowSuggestions(false)
                  }
                }}
                onFocus={() => {
                  if (input.length >= 2) filterSuggestions(input)
                }}
              />
              <Button
                onClick={isRendering ? handleStop : handleSendMessage}
                size="icon"
                className="bg-cyan-500 hover:bg-cyan-600 mt-auto p-2 h-fit disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRendering ? (
                  <PauseOctagon className="w-10 h-10" strokeWidth={2.25} />
                ) : (
                  <Send className="w-10 h-10" />
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* URL SCAN */}
        <TabsContent value="url" className="mt-0">
          <div className="space-y-4">
            <div className="flex gap-2 w-full">
              <Input
                value={urlToScan}
                onChange={(e) => setUrlToScan(e.target.value)}
                placeholder="Enter website URL for security scan (e.g., https://example.com)"
                className="flex-1 bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") scanUrl()
                }}
                disabled={isUrlScanning}
              />
              <Dialog
                open={showAnalysisModal}
                onOpenChange={setShowAnalysisModal}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 hover:bg-gray-700 bg-transparent"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-cyan-500" />
                      What HackAware will analyze
                    </DialogTitle>
                    <DialogDescription>
                      Comprehensive security and privacy analysis for any website
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-4">
                    {[
                      {
                        icon: <Shield className="h-4 w-4 text-cyan-500" />,
                        title: "Security Headers & HTTPS",
                        desc: "Analyze security headers, SSL/TLS configuration, and HTTPS implementation",
                        bg: "bg-cyan-500/20",
                      },
                      {
                        icon: <Eye className="h-4 w-4 text-amber-500" />,
                        title: "Privacy & Tracking",
                        desc: "Detect third-party trackers, cookies, and privacy compliance issues",
                        bg: "bg-amber-500/20",
                      },
                      {
                        icon: <Code className="h-4 w-4 text-red-500" />,
                        title: "JavaScript Vulnerabilities",
                        desc: "Scan for outdated libraries and known security vulnerabilities",
                        bg: "bg-red-500/20",
                      },
                      {
                        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                        title: "Security Best Practices",
                        desc: "Check Content Security Policy, cookie security, and compliance standards",
                        bg: "bg-green-500/20",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`${item.bg} p-1.5 rounded-full`}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                className="bg-cyan-500 hover:bg-cyan-600"
                onClick={scanUrl}
                disabled={!urlToScan.trim() || isUrlScanning}
              >
                <Scan className="h-4 w-4 mr-1" />
                {isUrlScanning ? "Scanning..." : "Scan Now"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* QUIZ */}
        <TabsContent value="quiz" className="mt-0">
          <p className="text-gray-400 text-sm">Coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
