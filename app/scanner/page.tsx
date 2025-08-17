"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Shield, ArrowLeft, Scan, Globe, AlertTriangle, CheckCircle, Info, Eye, Server } from "lucide-react"
import Link from "next/link"

export default function ScannerPage() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("privacy")

  const handleScan = () => {
    if (!url.trim()) return

    setIsScanning(true)
    setProgress(0)
    setScanComplete(false)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setScanComplete(true)
          return 100
        }
        return prev + 8
      })
    }, 200)
  }

  const resetScan = () => {
    setScanComplete(false)
    setUrl("")
    setProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <Scan className="h-5 w-5 text-cyan-500 mr-2" />
              <span className="font-bold">Website Scanner</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl py-8 px-4">
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-cyan-500" />
              Scan, Secure, and Learn
            </CardTitle>
            <CardDescription>
              Enter a website URL to analyze privacy risks, security vulnerabilities, and get educational insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!scanComplete ? (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Enter website URL (e.g., https://example.com)"
                      className="pl-10 bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={isScanning}
                    />
                  </div>
                  <Button
                    onClick={handleScan}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    disabled={isScanning || !url.trim()}
                  >
                    {isScanning ? (
                      <>
                        <Scan className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2 h-4 w-4" />
                        Scan Website
                      </>
                    )}
                  </Button>
                </div>

                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing website security and privacy...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-gray-700">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                    </Progress>
                    <div className="text-xs text-gray-400 space-y-1">
                      {progress > 20 && <div>✓ Checking HTTP headers</div>}
                      {progress > 40 && <div>✓ Scanning for third-party trackers</div>}
                      {progress > 60 && <div>✓ Analyzing JavaScript libraries</div>}
                      {progress > 80 && <div>✓ Checking privacy policies</div>}
                    </div>
                  </div>
                )}

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-cyan-500" />
                    What HackAware Scans For:
                  </h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Third-party trackers and analytics scripts</li>
                    <li>• Missing or misconfigured security headers</li>
                    <li>• Outdated JavaScript libraries and vulnerabilities</li>
                    <li>• Cookie exposure and privacy concerns</li>
                    <li>• HTTPS configuration and mixed content</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Scan Results: {url}</h3>
                  <Button variant="outline" size="sm" onClick={resetScan}>
                    New Scan
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-amber-500/10 border-amber-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="h-5 w-5 text-amber-500" />
                        <span>Privacy Risk</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-2xl font-bold text-amber-400">Medium</span>
                      <p className="text-sm text-gray-400 mt-2">
                        Found 3 third-party trackers without consent mechanisms
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-500/10 border-red-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-500" />
                        <span>Security</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-2xl font-bold text-red-500">High Risk</span>
                      <p className="text-sm text-gray-400 mt-2">
                        Missing critical security headers and outdated libraries
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Server className="h-5 w-5 text-blue-500" />
                        <span>Configuration</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-2xl font-bold text-blue-500">Fair</span>
                      <p className="text-sm text-gray-400 mt-2">HTTPS enabled but some best practices missing</p>
                    </CardContent>
                  </Card>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="privacy">Privacy Issues</TabsTrigger>
                    <TabsTrigger value="security">Security Flaws</TabsTrigger>
                    <TabsTrigger value="learn">Learn & Fix</TabsTrigger>
                  </TabsList>

                  <TabsContent value="privacy" className="space-y-4">
                    <Card className="bg-gray-800/70 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg">Privacy Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-500/20 p-1.5 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Google Analytics Tracking</h4>
                            <p className="text-sm text-gray-400">
                              This website uses Google Analytics without asking for user consent. This collects personal
                              data like IP addresses and browsing behavior.
                            </p>
                            <div className="mt-2 text-xs text-cyan-400">
                              Impact: Violates GDPR and privacy regulations in Myanmar
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/20 p-1.5 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Facebook Pixel</h4>
                            <p className="text-sm text-gray-400">
                              Facebook tracking pixel is active, sharing user behavior data with Meta for advertising
                              purposes.
                            </p>
                            <div className="mt-2 text-xs text-cyan-400">Impact: Privacy concerns for Myanmar users</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/20 p-1.5 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">No Cookie Consent Banner</h4>
                            <p className="text-sm text-gray-400">
                              Website doesn't ask users before setting tracking cookies, which is required by modern
                              privacy laws.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4">
                    <Card className="bg-gray-800/70 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg">Security Vulnerabilities</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-500/20 p-1.5 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Missing Content Security Policy (CSP)</h4>
                            <p className="text-sm text-gray-400">
                              No CSP header found. This makes the website vulnerable to Cross-Site Scripting (XSS)
                              attacks where malicious scripts can be injected.
                            </p>
                            <div className="mt-2 text-xs text-cyan-400">
                              Risk Level: High - Attackers can steal user data
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-red-500/20 p-1.5 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Outdated jQuery Library</h4>
                            <p className="text-sm text-gray-400">
                              Using jQuery 2.1.4 (released 2015) which has known security vulnerabilities. This could be
                              exploited by attackers.
                            </p>
                            <div className="mt-2 text-xs text-cyan-400">
                              Solution: Update to jQuery 3.6+ or modern alternatives
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/20 p-1.5 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">No X-Frame-Options Header</h4>
                            <p className="text-sm text-gray-400">
                              Website can be embedded in frames, making it vulnerable to clickjacking attacks.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="learn" className="space-y-4">
                    <Card className="bg-gray-800/70 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg">How to Fix These Issues</CardTitle>
                        <CardDescription>Step-by-step guidance for developers and website owners</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/20 p-1.5 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Add Cookie Consent Banner</h4>
                            <p className="text-sm text-gray-400 mb-2">
                              Implement a consent management system to ask users before tracking them.
                            </p>
                            <div className="bg-gray-900/50 p-3 rounded border border-gray-600 text-xs font-mono">
                              {`<!-- Add this to your website -->`}
                              <br />
                              {`<script src="cookieconsent.js"></script>`}
                              <br />
                              {`// Only load trackers after consent`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/20 p-1.5 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Add Security Headers</h4>
                            <p className="text-sm text-gray-400 mb-2">
                              Configure your server to send security headers that protect against common attacks.
                            </p>
                            <div className="bg-gray-900/50 p-3 rounded border border-gray-600 text-xs font-mono">
                              {`Content-Security-Policy: default-src 'self'`}
                              <br />
                              {`X-Frame-Options: DENY`}
                              <br />
                              {`X-Content-Type-Options: nosniff`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/20 p-1.5 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Update JavaScript Libraries</h4>
                            <p className="text-sm text-gray-400">
                              Replace outdated libraries with modern, secure versions to eliminate known
                              vulnerabilities.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-cyan-500/10 border-cyan-500/30">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="font-medium mb-2">Need Help Implementing These Fixes?</h3>
                          <p className="text-sm text-gray-400 mb-4">
                            Chat with HackAware's AI assistant for personalized guidance and explanations.
                          </p>
                          <Button
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                            asChild
                          >
                            <Link href="/chat">Chat with HackAware AI</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
