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
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { ChatTypingIndicator } from "@/components/chat-typing-indicator";
import { autoSuggestQueries, welcomeMessage } from "./mockdata";
import { MessageType } from "./types";
import { useAuth } from "@/context/AuthContext";
import SidePanel from "./components/layout/SidePanel";
import MessageRenderer from "./components/MessageRenderer";
import InputTabs from "./components/ChatWindow/InputTabs";
import ChatHeader from "./components/ChatWindow/ChatHeader";
import WelcomeMessage from "./components/ChatWindow/WelcomeMessage";
import { getToken } from "@/lib/authService";
import { readStreamingJson } from "@/lib/utils";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useConversationMessages } from "@/hooks/use-conversation-messages";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useMessage } from "@/context/MessageContext";

export default function ChatPage() {
  const { user, loading: userLoading, refetch } = useAuth();
  const router = useRouter();
  const { setMessage } = useMessage();

  useEffect(() => {
    if (!user && !userLoading) {
      setMessage("You need to login first");
      router.push("/login");
    }
  }, [user, userLoading, router, setMessage]);

  if (!user) {
    return null; // prevent rendering ChatPage until redirect happens
  }

  const {
    conversations: chatHistory,
    loading: fetchingHistory,
    error,
    refetch: refetchChatHistory,
  } = useChatHistory();

  useEffect(() => {
    refetch(); // force refresh when entering chat page
  }, [refetch]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const {
    messages,
    setMessages,
    refetch: refetchConversationMessages,
  } = useConversationMessages(selectedChatId);

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

  const createChat = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/chat/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: input }),
        signal,
      });

      if (!response.body) throw new Error("No response body");

      // Initial bot message
      let botText = "";
      let lastChunk: any = null;

      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        datetime: new Date(),
        status: "info",
      };

      setMessages((prev) => [...prev, botMessage]);

      // Stream chunks and update message progressively
      await readStreamingJson(
        response,
        (parsed) => {
          lastChunk = parsed; // store last parsed chunk
          const content = parsed.message?.content || "";
          const cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, "");
          botText += cleaned;

          setIsTyping(false);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessage.id ? { ...msg, content: botText } : msg
            )
          );
        },
        stopRef
      );

      // Get conversation_id from the last parsed chunk
      const conversation_id = lastChunk?.conversation_id;
      setConversationId(conversation_id);
    } catch (error: any) {
      console.error("Error creating chat:", error?.message || error);
    }
  };

  // Sends a user message in an existing conversation
  const sendMessage = async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${API_URL}/chat/conversation/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question: input }),
          signal,
        }
      );

      if (!response.body) throw new Error("ReadableStream not supported");

      let botText = "";
      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        datetime: new Date(),
        status: "info",
      };

      setMessages((prev) => [...prev, botMessage]);

      await readStreamingJson(
        response,
        (parsed) => {
          const content = parsed.message?.content || "";
          const cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, "");
          botText += cleaned;

          setIsTyping(false);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessage.id ? { ...msg, content: botText } : msg
            )
          );

          if (botText.trim() !== "") setIsTyping(false);
        },
        stopRef
      );
    } catch (error: any) {
      console.error("Error sending message:", error?.message || error);
    }
  };

  // Handles user message submission
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setShowSuggestions(false);
    stopRef.current = false;

    // Add user message to chat
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      datetime: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setIsTyping(true);
    setIsRendering(true);

    // Decide whether to create a new chat or send in existing conversation
    if (messages.length === 0) {
      await createChat(); // first message
    } else {
      await sendMessage(); // subsequent messages
    }

    setIsTyping(false);
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
      role: "assistant",
      content: `🔍 **Initiating comprehensive security scan of ${urlToScan}**\n\nScanning for vulnerabilities, privacy issues, and security misconfigurations...`,
      datetime: new Date(),
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

  function selectChat(id: string): void {
    setSelectedChatId(id);
    setConversationId(id);
  }

  const newChat = () => {
    if (messages.length === 0) {
      return;
    }
    setSelectedChatId(null);
    setMessages([]);
  };

  return (
    <SidebarProvider>
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 flex h-screen w-full">
        {/* Side Panel */}
        <SidePanel
          chatHistory={chatHistory}
          selectedChatId={selectedChatId}
          selectChat={selectChat}
          newChat={newChat}
          isFetching={fetchingHistory}
        />

        <main className="flex flex-col w-full h-screen  relative">
          <ChatHeader
            user={user}
            chatHistory={chatHistory}
            selectedChatId={selectedChatId}
          />
          {/* scrollable area */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scrollbar-none lg:p-4 space-y-4 min-h-0 container mx-auto max-w-5xl"
          >
            {messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <>
                {messages?.map((message, index) => (
                  <div key={index}>
                    <MessageRenderer
                      message={message}
                      isRendering={isRendering}
                    />
                  </div>
                ))}
                {isTyping && <ChatTypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}

            {!isUserAtBottom && (
              <button
                onClick={() => scrollToBottom()}
                className="fixed bottom-40  md:bottom-4 right-4 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center animate-bounce"
              >
                <ChevronDown size={24} />
              </button>
            )}
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
    </SidebarProvider>
  );
}
