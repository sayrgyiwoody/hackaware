"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Send,
  ArrowLeft,
  Scan,
  Eye,
  Code,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  CircleStop,
  OctagonMinus,
  CircleSlash2,
  PauseOctagon,
} from "lucide-react";
import Link from "next/link";
import { ChatMessage } from "@/components/chat-message";
import { ChatTypingIndicator } from "@/components/chat-typing-indicator";
import { ScanResults } from "@/components/scan-results";
import { SecurityThreatAlert } from "@/components/security-threat-alert";
import { InteractiveDemo } from "@/components/interactive-demo";
import { SecurityQuiz } from "@/components/security-quiz";
import { mockChunks, quizTopics, welcomeMessage } from "./mockdata";
import { MessageType } from "./types";
import { useAuth } from "@/context/AuthContext";
import SidePanel from "./components/SidePanel";

export default function ChatPage() {
  const { user, loading, logout } = useAuth();

  const [messages, setMessages] = useState<MessageType[]>(welcomeMessage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [securityLevel, setSecurityLevel] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userInput = "userInput"; // Declare userInput variable
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [urlToScan, setUrlToScan] = useState("");
  const [isUrlScanning, setIsUrlScanning] = useState(false);
  const [urlScanResult, setUrlScanResult] = useState<any>(null);
  const [urlScanProgress, setUrlScanProgress] = useState(0);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const stopRef = useRef(false);
  const controller = new AbortController();
  const signal = controller.signal;

  const autoSuggestQueries = [
    "Scan facebook.com for security vulnerabilities",
    "Explain XSS attacks and prevention",
    "Show me SQL injection demo",
    "What are security headers?",
    "How does HTTPS work?",
    "Analyze privacy tracking on websites",
    "Demonstrate clickjacking attack",
    "Check website for malware",
    "Explain CSRF protection",
    "Show secure coding practices",
    "What is Content Security Policy?",
    "How to prevent data breaches?",
    "Scan google.com for privacy issues",
    "Explain phishing detection",
    "Show password security best practices",
    "What is OWASP Top 10?",
    "How does a Web Application Firewall (WAF) work?",
    "Explain CORS misconfigurations",
    "Check if a site uses HSTS",
    "What are common SSL/TLS vulnerabilities?",
    "Explain session hijacking and prevention",
    "How do cookie security flags (HttpOnly, Secure, SameSite) work?",
    "Detect outdated JavaScript libraries",
    "How to secure APIs against attacks?",
    "Explain directory traversal attacks",
    "What is brute force protection?",
    "Scan a site for open redirects",
    "How to detect hidden iframes?",
    "Explain DNS spoofing and prevention",
    "What are common cloud security risks?",
  ];

  const filterSuggestions = (inputValue: string) => {
    if (inputValue.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = autoSuggestQueries
      .filter((query) => query.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 5);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const extractUrlFromMessage = (message: string): string | null => {
    const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g;
    const match = message.match(urlRegex);
    return match ? match[0] : null;
  };

  // streaming response
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // hide suggestion
    setShowSuggestions(false);

    // Reset stop flag before starting
    stopRef.current = false;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsTyping(true);
    setIsRendering(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question: input }),
        signal,
      });

      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botText = "";

      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "",
        timestamp: new Date(),
        // interactiveDemo: generateSecurityDemo(demoTopic),
        status: "info",
      };

      // Add initial bot message to chat
      setMessages((prev) => [...prev, botMessage]);

      let buffer = "";

      while (true) {
        if (stopRef.current) {
          controller.abort(); // abort fetch
          botText += "... stopped";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessage.id ? { ...msg, content: botText } : msg
            )
          );
          break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const parsed = JSON.parse(line);
            const content = parsed.message?.content || "";
            const cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, "");
            botText += cleaned;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessage.id ? { ...msg, content: botText } : msg
              )
            );

            if (botText.trim() !== "") setIsTyping(false);
          } catch (e) {
            console.warn("Could not parse line as JSON:", line);
          }
        }
      }
    } catch (error: any) {
      console.error("Error streaming response:", error?.message || error);
    } finally {
      setIsTyping(false);
    }

    setIsRendering(false);
  };

  //stop fetching tokens from text generation API
  const handleStop = () => {
    stopRef.current = true;
    setIsRendering(false);
    setIsTyping(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const scanUrl = async () => {
    if (!urlToScan.trim()) return;

    const scanMessageId = Date.now().toString();
    const scanMessage: MessageType = {
      id: scanMessageId,
      role: "bot",
      content: `🔍 **Initiating comprehensive security scan of ${urlToScan}**\n\nScanning for vulnerabilities, privacy issues, and security misconfigurations...`,
      timestamp: new Date(),
      icon: "🛡️",
      isScanning: true,
      scanProgress: 0,
      status: "info",
    };

    setMessages((prev) => [...prev, scanMessage]);
    setIsUrlScanning(true);
    setUrlScanProgress(0);

    // Show scanning progress (optional)
    const steps = [
      "Connecting to website...",
      "Analyzing HTTP headers...",
      "Checking SSL/TLS configuration...",
      "Scanning for third-party trackers...",
      "Detecting JavaScript libraries...",
      "Analyzing privacy policies...",
      "Checking security headers...",
      "Scanning for vulnerabilities...",
      "Generating security report...",
      "Finalizing analysis...",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const progress = ((i + 1) / steps.length) * 100;
      setUrlScanProgress(progress);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === scanMessageId ? { ...msg, scanProgress: progress } : msg
        )
      );
    }

    try {
      // scan the URL using your API
      const response = await fetch(`${API_URL}/scan/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question: urlToScan }),
      });

      if (!response.ok) throw new Error("Failed to fetch scan results");

      const result = await response.json();

      // Update message with real results
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === scanMessageId
            ? {
                ...msg,
                isScanning: false,
                scanResults: result,
                content: `🔍 **Security Scan Complete for ${urlToScan}**\n\nOverall Security Score: **${result.overallScore}/100**\n\nI found ${result.issues.length} security issues that need attention.`,
              }
            : msg
        )
      );
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === scanMessageId
            ? {
                ...msg,
                isScanning: false,
                status: "error",
                content: `❌ Failed to scan ${urlToScan}. Please try again.`,
              }
            : msg
        )
      );
    }

    setIsUrlScanning(false);
    setUrlToScan("");
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 50; // tolerance
    setIsUserAtBottom(atBottom);
  };

  // Scroll to bottom function
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // On initial render, scroll to bottom immediately
  useEffect(() => {
    scrollToBottom(false); // instant scroll
  }, []);

  // When messages update, scroll only if user is at bottom
  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    }
  }, [messages, isUserAtBottom]);

  const chatHistory = [
    { id: "1", title: "Introduction to Web Security" },
    { id: "2", title: "Understanding XSS Attacks" },
    { id: "3", title: "SQL Injection Prevention Tips" },
    { id: "4", title: "Analyzing HTTPS Implementation" },
    { id: "5", title: "Exploring OWASP Top 10" },
  ];

  const [selectedChatId, setSelectedChatId] = useState(null);

  function selectChat(id: string): void {
    setSelectedChatId(id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex">
      {/* Side Panel */}
      <SidePanel chatHistory={chatHistory} selectedChatId={selectedChatId} selectChat={selectChat} />

      <main className="flex flex-col w-full h-screen  relative">
        <header className="border-b border-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-cyan-500 mr-2" />
                <span className="font-bold">HackAware </span>{" "}
                <span className="hidden lg:inline-block ms-1">
                  {" "}
                  Security Chat
                </span>
              </div>
            </Link>
            {user && (
              <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-cyan-500 text-cyan-500"
              >
                {user?.expertise}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Online
              </Badge>
            </div>
            )}
          </div>
        </header>
        {/* scrollable area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scrollbar-none lg:p-4 space-y-4 min-h-0 container mx-auto max-w-5xl"
        >
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage message={message} isRendering={isRendering} />

              {message.isScanning && (
                <div className="ml-11 mt-2">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-w-[80%]">
                    <div className="flex justify-between text-sm mb-2">
                      <span>🔍 Deep security analysis in progress...</span>
                      <span>{message.scanProgress}%</span>
                    </div>
                    <Progress
                      value={message.scanProgress || 0}
                      className="h-2 bg-gray-700 mb-3"
                    >
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                    </Progress>
                    <div className="text-xs text-gray-400 space-y-1">
                      {(message.scanProgress || 0) > 15 && (
                        <div>✓ Analyzing HTTP security headers</div>
                      )}
                      {(message.scanProgress || 0) > 30 && (
                        <div>✓ Detecting third-party trackers</div>
                      )}
                      {(message.scanProgress || 0) > 45 && (
                        <div>
                          ✓ Scanning JavaScript libraries for vulnerabilities
                        </div>
                      )}
                      {(message.scanProgress || 0) > 60 && (
                        <div>✓ Checking SSL/TLS configuration</div>
                      )}
                      {(message.scanProgress || 0) > 75 && (
                        <div>
                          ✓ Analyzing privacy policies and consent mechanisms
                        </div>
                      )}
                      {(message.scanProgress || 0) > 90 && (
                        <div>✓ Generating security recommendations</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {message.scanResults && (
                <div className="ml-11 mt-2">
                  <ScanResults results={message.scanResults} />
                </div>
              )}

              {message.threatAlert && (
                <div className="ml-11 mt-2">
                  <SecurityThreatAlert alert={message.threatAlert} />
                </div>
              )}

              {message.interactiveDemo && (
                <div className="ml-11 mt-2">
                  <InteractiveDemo demo={message.interactiveDemo} />
                </div>
              )}

              {message.quiz && (
                <div className="ml-11 mt-2">
                  <SecurityQuiz
                    quiz={message.quiz}
                    onNext={(isCorrect) => showNextQuiz(isCorrect)}
                    showNext={
                      currentQuizTopic !== null &&
                      currentQuizIndex < quizQuestions.length - 1
                    }
                  />
                </div>
              )}

              {message.codeExample && (
                <div className="ml-11 mt-2">
                  <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-4 max-w-[80%]">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Code className="h-4 w-4 text-cyan-500" />
                      Code Examples
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-red-400 mb-1">
                          ❌ Vulnerable Code:
                        </div>
                        <pre className="bg-red-500/10 border border-red-500/30 rounded p-2 text-xs overflow-x-auto">
                          <code>{message.codeExample.vulnerable}</code>
                        </pre>
                      </div>
                      <div>
                        <div className="text-xs text-green-400 mb-1">
                          ✅ Secure Code:
                        </div>
                        <pre className="bg-green-500/10 border border-green-500/30 rounded p-2 text-xs overflow-x-auto">
                          <code>{message.codeExample.secure}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {message.securityTip && (
                <div className="ml-11 mt-2">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 max-w-[80%]">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-cyan-500" />
                      {message.securityTip.title}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {message.securityTip.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTyping && <ChatTypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed input area */}
        <div className="w-full max-w-4xl p-4 border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 lg:rounded-xl mx-auto lg:mb-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="text">General Chat</TabsTrigger>
              <TabsTrigger value="url">URL Scan</TabsTrigger>
              <TabsTrigger value="quiz">Security Quiz</TabsTrigger>
            </TabsList>

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
                      setInput(e.target.value);
                      filterSuggestions(e.target.value);

                      // Auto-grow logic
                      const el = textareaRef.current;
                      if (el) {
                        el.style.height = "auto"; // reset height
                        el.style.height = el.scrollHeight + "px"; // expand to fit content
                      }
                    }}
                    rows={1}
                    placeholder="Ask about web security, vulnerabilities, best practices..."
                    className="min-h-[60px] bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500 overflow-hidden resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!isRendering) {
                          handleSendMessage();
                        }
                      }
                      if (e.key === "Escape") {
                        setShowSuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      if (input.length >= 2) {
                        filterSuggestions(input);
                      }
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

            <TabsContent value="url" className="mt-0">
              <div className="space-y-4">
                <div className="flex gap-2 w-full">
                  <Input
                    value={urlToScan}
                    onChange={(e) => setUrlToScan(e.target.value)}
                    placeholder="Enter website URL for security scan (e.g., https://example.com)"
                    className="flex-1 bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        scanUrl();
                      }
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
                          Comprehensive security and privacy analysis for any
                          website
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-cyan-500/20 p-1.5 rounded-full">
                            <Shield className="h-4 w-4 text-cyan-500" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Security Headers & HTTPS
                            </h4>
                            <p className="text-sm text-gray-400">
                              Analyze security headers, SSL/TLS configuration,
                              and HTTPS implementation
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/20 p-1.5 rounded-full">
                            <Eye className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Privacy & Tracking
                            </h4>
                            <p className="text-sm text-gray-400">
                              Detect third-party trackers, cookies, and privacy
                              compliance issues
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-red-500/20 p-1.5 rounded-full">
                            <Code className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              JavaScript Vulnerabilities
                            </h4>
                            <p className="text-sm text-gray-400">
                              Scan for outdated libraries and known security
                              vulnerabilities
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/20 p-1.5 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Security Best Practices
                            </h4>
                            <p className="text-sm text-gray-400">
                              Check Content Security Policy, cookie security,
                              and compliance standards
                            </p>
                          </div>
                        </div>
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

            <TabsContent value="quiz" className="mt-0"></TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
