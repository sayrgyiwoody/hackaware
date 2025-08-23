"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Shield,
  MessageSquare,
  BookOpen,
  ChevronRight,
  Globe,
  LogOut,
} from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { FeatureCard } from "@/components/feature-card";
import { PrivacyModal } from "@/components/privacy-modal";
import { fetchMe, logoutUser } from "@/lib/authService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(Boolean(token));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-cyan-500" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            HackAware
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </Link>
        </nav>
        {isLoggedIn ? (
            <Button
              onClick={() => {
                logoutUser();
                window.location.href = "/login";
              }}
              variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-600 bg-transparent"
            >
            Logout 
            <LogOut/>
          </Button>
          
          ) : (
            <div className=" flex space-x-2">
              <Button
              asChild
              className=" bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
            asChild
            variant="outline"
            className="border-cyan-500 text-cyan-500 hover:bg-cyan-950 bg-transparent"
          >
            <Link href="/register">Register</Link>
          </Button>
            </div>
          )}
      </header>

      <HeroSection tagline="Chat with HackAware for personalized cybersecurity advice." />

      <section className="container mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8 text-cyan-500" />}
            title="AI Chat Assistant"
            description="Get personalized cybersecurity advice through our AI chat assistant."
            link="/chat"
          />
          <FeatureCard
            icon={<BookOpen className="h-8 w-8 text-cyan-500" />}
            title="Learn & Understand"
            description="Receive clear explanations of security issues in simple language."
            link="/learn"
          />
          <FeatureCard
            icon={<Globe className="h-8 w-8 text-cyan-500" />}
            title="Browser Extension"
            description="Scan websites directly from your browser as part of our chat experience (coming soon)."
            link="/extension"
          />
        </div>
      </section>

      <section className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to secure your digital life?
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          HackAware combines AI intelligence with cybersecurity expertise to
          keep you safe online. Start chatting with HackAware today and take
          control of your digital security.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          <Link href="/chat" className="flex items-center gap-2">
            Chat with HackAware <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        <div className="mt-8">
          <PrivacyModal />
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-cyan-500" />
            <span className="font-bold">HackAware</span>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} HackAware. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
