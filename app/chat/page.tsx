"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ChatTypingIndicator } from "@/components/chat-typing-indicator";
import {
  autoSuggestQueries,
  chatHistory,
  welcomeMessage,
} from "./mockdata";
import { MessageType } from "./types";
import { useAuth } from "@/context/AuthContext";
import SidePanel from "./components/layout/SidePanel";
import MessageRenderer from "./components/MessageRenderer";
import InputTabs from "./components/InputTabs";
import ChatHeader from "./components/ChatHeader";

export default function ChatPage() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<MessageType[]>(welcomeMessage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [urlToScan, setUrlToScan] = useState("");
  const [isUrlScanning, setIsUrlScanning] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const stopRef = useRef(false);
  const controller = new AbortController();
  const signal = controller.signal;

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

  const [selectedChatId, setSelectedChatId] = useState(null);

  function selectChat(id: string): void {
    setSelectedChatId(id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex">
      {/* Side Panel */}
      <SidePanel
        chatHistory={chatHistory}
        selectedChatId={selectedChatId}
        selectChat={selectChat}
      />

      <main className="flex flex-col w-full h-screen  relative">
        <ChatHeader user={user} />
        {/* scrollable area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scrollbar-none lg:p-4 space-y-4 min-h-0 container mx-auto max-w-5xl"
        >
          {messages.map((message) => (
            <div key={message.id}>
              <MessageRenderer message={message} isRendering={isRendering} />
            </div>
          ))}
          {isTyping && <ChatTypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed input area */}
        <InputTabs
          input={input}
          setInput={setInput}
          textareaRef={textareaRef}
          inputContainerRef={inputContainerRef}
          isRendering={isRendering}
          handleSendMessage={handleSendMessage}
          handleStop={handleStop}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          filterSuggestions={filterSuggestions}
          selectSuggestion={selectSuggestion}
          urlToScan={urlToScan}
          setUrlToScan={setUrlToScan}
          isUrlScanning={isUrlScanning}
          scanUrl={scanUrl}
          showAnalysisModal={showAnalysisModal}
          setShowAnalysisModal={setShowAnalysisModal}
        />
      </main>
    </div>
  );
}
