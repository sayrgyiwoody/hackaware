"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft, Shield, Eye, Lock, Globe, Users, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function LearnPage() {
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
              <span className="font-bold">Learn Cybersecurity</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Learn Web Security & Privacy</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Understanding cybersecurity doesn't have to be complicated. Learn about common threats, privacy risks, and
            how to protect yourself and your websites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-cyan-500" />
                Privacy Fundamentals
              </CardTitle>
              <CardDescription>Learn about data privacy and tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• What are third-party trackers?</li>
                <li>• How cookies work and privacy implications</li>
                <li>• Understanding data collection</li>
                <li>• Privacy laws in Myanmar</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-500" />
                Web Security Basics
              </CardTitle>
              <CardDescription>Essential security concepts</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• HTTPS and secure connections</li>
                <li>• Security headers explained</li>
                <li>• Cross-Site Scripting (XSS)</li>
                <li>• Clickjacking prevention</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-cyan-500" />
                Safe Browsing
              </CardTitle>
              <CardDescription>Protect yourself online</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Identifying suspicious websites</li>
                <li>• Phishing detection</li>
                <li>• Browser security settings</li>
                <li>• VPN and privacy tools</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-500" />
              Why This Matters for Myanmar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              As Myanmar's digital ecosystem grows, many websites are being created by students, small business owners,
              and independent developers. However, cybersecurity awareness is still developing, which can lead to:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-cyan-400">Common Issues We See:</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Websites without HTTPS encryption</li>
                  <li>• Missing privacy policies</li>
                  <li>• Outdated software with vulnerabilities</li>
                  <li>• Tracking users without consent</li>
                  <li>• Weak security configurations</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-cyan-400">Why It Matters:</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Protects user personal information</li>
                  <li>• Builds trust with customers</li>
                  <li>• Complies with international standards</li>
                  <li>• Prevents cyber attacks</li>
                  <li>• Supports digital literacy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Common Website Security Issues in Myanmar</CardTitle>
            <CardDescription>Real examples of what HackAware detects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="bg-red-500/20 p-1.5 rounded-full">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium">Missing Security Headers</h4>
                <p className="text-sm text-gray-400 mb-2">
                  Many Myanmar websites don't configure proper security headers, leaving them vulnerable to attacks.
                </p>
                <div className="bg-gray-900/50 p-3 rounded border border-gray-600 text-xs">
                  <strong>Example:</strong> A local e-commerce site without Content-Security-Policy allows malicious
                  scripts to be injected, potentially stealing customer payment information.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-500/20 p-1.5 rounded-full">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <h4 className="font-medium">Tracking Without Consent</h4>
                <p className="text-sm text-gray-400 mb-2">
                  Many sites use Google Analytics or Facebook Pixel without asking users for permission first.
                </p>
                <div className="bg-gray-900/50 p-3 rounded border border-gray-600 text-xs">
                  <strong>Impact:</strong> This violates user privacy and may not comply with international data
                  protection laws as Myanmar integrates more with global markets.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-500/20 p-1.5 rounded-full">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <h4 className="font-medium">Outdated Libraries</h4>
                <p className="text-sm text-gray-400 mb-2">
                  Using old versions of jQuery, Bootstrap, or other libraries with known security vulnerabilities.
                </p>
                <div className="bg-gray-900/50 p-3 rounded border border-gray-600 text-xs">
                  <strong>Solution:</strong> Regularly update all JavaScript libraries and frameworks to their latest
                  secure versions.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cyan-500/10 border-cyan-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ready to Make Myanmar's Web Safer?</h3>
              <p className="text-gray-400 mb-6">
                Start by scanning your own website or any site you're curious about. HackAware will explain everything
                in simple terms and help you understand how to fix issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  asChild
                >
                  <Link href="/scanner">Scan a Website</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-cyan-500 text-cyan-500 hover:bg-cyan-950 bg-transparent"
                  asChild
                >
                  <Link href="/chat">Ask HackAware AI</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
