import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="container mx-auto py-20 px-4 flex flex-col lg:flex-row items-center">
      <div className="lg:w-1/2 mb-10 lg:mb-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            AI Chat Assistant
          </span>{" "}
          for Website Security
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-lg">
          Experience website security through conversational interactions with HackAware. Our AI assistant scans for
          privacy risks and security vulnerabilities while you chat. Perfect for Myanmar's growing digital ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Link href="/chat">Chat with HackAware</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-cyan-500 text-cyan-500 hover:bg-cyan-950 bg-transparent"
          >
            <Link href="/learn">Learn More</Link>
          </Button>
        </div>
      </div>
      <div className="lg:w-1/2 flex justify-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">HackAware</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-white">
                  Hello! I'm HackAware, your AI website security assistant. Type any website URL in our chat, and I'll
                  scan it for privacy risks and security vulnerabilities.
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-start gap-2">
                <div className="min-w-fit mt-1">🔍</div>
                <p>
                  Just type a website URL, and I'll check for third-party trackers, missing security headers, and
                  privacy concerns.
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-start gap-2">
                <div className="min-w-fit mt-1">📚</div>
                <p>I'll explain everything in simple terms and teach you how to fix any issues I find.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
