"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileSearch,
  ArrowLeft,
  Upload,
  Smartphone,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function AnalyzerPage() {
  const [activeTab, setActiveTab] = useState("app")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [appName, setAppName] = useState("")

  const handleAnalyze = () => {
    if (!appName.trim()) return

    setIsAnalyzing(true)
    setProgress(0)
    setAnalysisComplete(false)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const resetAnalysis = () => {
    setAnalysisComplete(false)
    setAppName("")
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
              <FileSearch className="h-5 w-5 text-cyan-500 mr-2" />
              <span className="font-bold">Privacy Analyzer</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl py-8 px-4">
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Privacy Risk Analysis</CardTitle>
            <CardDescription>Analyze apps, websites, or files for potential privacy and security risks</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="app" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>App</span>
                </TabsTrigger>
                <TabsTrigger value="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Website</span>
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>File</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="app">
                {!analysisComplete ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="app-name" className="text-sm font-medium">
                        App Name
                      </label>
                      <Input
                        id="app-name"
                        placeholder="Enter app name (e.g., Instagram, TikTok)"
                        className="bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        disabled={isAnalyzing}
                      />
                    </div>

                    {isAnalyzing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Analyzing privacy risks...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-gray-700">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                        </Progress>
                      </div>
                    )}

                    <Button
                      onClick={handleAnalyze}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      disabled={isAnalyzing || !appName.trim()}
                    >
                      {isAnalyzing ? (
                        <>
                          <FileSearch className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FileSearch className="mr-2 h-4 w-4" />
                          Analyze Privacy Risks
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">Analysis Results: {appName}</h3>
                      <Button variant="outline" size="sm" onClick={resetAnalysis}>
                        New Analysis
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-amber-500/10 border-amber-500/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <span>Privacy Risk</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <span className="text-2xl font-bold text-amber-400">Medium</span>
                          <p className="text-sm text-gray-400 mt-2">
                            This app collects more data than necessary for its core functionality.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-500/10 border-green-500/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-500" />
                            <span>Security</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <span className="text-2xl font-bold text-green-500">Good</span>
                          <p className="text-sm text-gray-400 mt-2">
                            The app uses encryption and secure authentication methods.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-500/10 border-blue-500/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-500" />
                            <span>Data Sharing</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <span className="text-2xl font-bold text-blue-500">High</span>
                          <p className="text-sm text-gray-400 mt-2">
                            This app shares data with multiple third parties for advertising.
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-gray-800/70 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg">Data Collection Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-500/20 p-1.5 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Location Tracking</h4>
                            <p className="text-sm text-gray-400">
                              This app tracks your precise location even when not in use. Consider restricting location
                              permissions to "While Using" in your device settings.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/20 p-1.5 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Contact Access</h4>
                            <p className="text-sm text-gray-400">
                              The app requests access to your contacts. This data may be used for friend suggestions but
                              could also be used for targeted advertising.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/20 p-1.5 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Data Encryption</h4>
                            <p className="text-sm text-gray-400">
                              Your messages and personal data are encrypted during transmission, which is a good
                              security practice.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/70 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg">Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-cyan-500/20 p-1.5 rounded-full">
                            <Shield className="h-4 w-4 text-cyan-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Review App Permissions</h4>
                            <p className="text-sm text-gray-400">
                              Go to your device settings and limit this app's permissions, especially location and
                              contacts.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-cyan-500/20 p-1.5 rounded-full">
                            <Shield className="h-4 w-4 text-cyan-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Enable Privacy Features</h4>
                            <p className="text-sm text-gray-400">
                              Check the app's privacy settings and enable any available privacy-enhancing features.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-cyan-500/20 p-1.5 rounded-full">
                            <Shield className="h-4 w-4 text-cyan-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Consider Alternatives</h4>
                            <p className="text-sm text-gray-400">
                              If privacy is a major concern, consider using alternative apps with better privacy
                              practices.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                          asChild
                        >
                          <Link href="/chat">Chat with CyGuard for More Help</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="website">
                <div className="text-center py-12">
                  <Globe className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Website Analysis</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    This feature is coming soon. You'll be able to analyze websites for privacy concerns, tracking
                    scripts, and security issues.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="file">
                <div className="text-center py-12">
                  <Upload className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">File Analysis</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    This feature is coming soon. You'll be able to scan files for malware, privacy risks, and security
                    vulnerabilities.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
