"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, ArrowLeft, Download, Chrome, ChromeIcon as Firefox, Shield, Scan, Zap } from "lucide-react"
import Link from "next/link"

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-cyan-500 mr-2" />
              <span className="font-bold">Browser Extension</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl py-8 px-4">
        <div className="text-center mb-12">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/20 mb-6">
            <Globe className="h-12 w-12 text-cyan-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">HackAware Browser Extension</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Scan websites instantly while browsing. Get real-time privacy and security insights without leaving your
            current page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-500" />
                Instant Scanning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Click the HackAware icon to instantly scan the current website for privacy and security issues.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-500" />
                Real-time Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Get notified about potential threats, trackers, and security vulnerabilities as you browse.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5 text-cyan-500" />
                Educational Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Learn about website security and privacy practices with simple explanations and tips.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Extension Preview</CardTitle>
            <CardDescription>See how the HackAware extension will work in your browser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">HackAware</span>
                </div>
                <div className="text-xs text-gray-400">Scanning: example.com</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>3 privacy risks detected</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>2 security warnings</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>HTTPS connection secure</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  View Detailed Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                The HackAware browser extension is currently in development. It will be available for Chrome, Firefox,
                and other major browsers. Sign up to be notified when it's ready!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Chrome className="h-5 w-5" />
                  <span>Chrome</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Firefox className="h-5 w-5" />
                  <span>Firefox</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Globe className="h-5 w-5" />
                  <span>Edge & Others</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="border-cyan-500 text-cyan-500 hover:bg-cyan-950 bg-transparent"
                  disabled
                >
                  <Download className="mr-2 h-4 w-4" />
                  Get Extension (Coming Soon)
                </Button>
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  asChild
                >
                  <Link href="/scanner">Try Web Scanner Instead</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
