"use client"; // if using Next.js app directory

import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // adjust import
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CircleStop,
  Send,
  Shield,
  Eye,
  Code,
  CheckCircle,
  Lightbulb,
  Scan,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ChatTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  handleStop: () => void;
  isRendering: boolean;
  showSuggestions: boolean;
  suggestions: string[];
  selectSuggestion: (s: string) => void;
  filterSuggestions: (input: string) => void;
  inputContainerRef: React.RefObject<HTMLDivElement>;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    urlToScan : string;
  // Add other props needed for URL scan and Quiz tabs...
}

export default function ChatTabs({
  activeTab,
  setActiveTab,
  input,
  setInput,
  handleSendMessage,
  handleStop,
  isRendering,
  showSuggestions,
  suggestions,
  selectSuggestion,
  filterSuggestions,
  inputContainerRef,
    textareaRef,
  urlToScan
}: // other props...
ChatTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="text">General Chat</TabsTrigger>
        <TabsTrigger value="url">URL Scan</TabsTrigger>
        <TabsTrigger value="quiz">Security Quiz</TabsTrigger>
      </TabsList>

      <TabsContent value="text" className="mt-0">
        {/* Move your General Chat JSX here */}
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

                const el = textareaRef.current;
                if (el) {
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }
              }}
              rows={1}
              placeholder="Ask about web security..."
              className="min-h-[60px] bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500 overflow-hidden resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isRendering) handleSendMessage();
                }
                if (e.key === "Escape") setShowSuggestions(false);
              }}
              onFocus={() => {
                if (input.length >= 2) filterSuggestions(input);
              }}
            />
            <Button
              onClick={isRendering ? handleStop : handleSendMessage}
              size="icon"
              className="bg-cyan-500 hover:bg-cyan-600 mt-auto py-4 h-fit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRendering ? (
                <CircleStop className="w-8 h-8" strokeWidth={2.25} />
              ) : (
                <Send className="w-6 h-6" />
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
                    Comprehensive security and privacy analysis for any website
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
                        Analyze security headers, SSL/TLS configuration, and
                        HTTPS implementation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500/20 p-1.5 rounded-full">
                      <Eye className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Privacy & Tracking</h4>
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
                        Check Content Security Policy, cookie security, and
                        compliance standards
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

      <TabsContent value="quiz" className="mt-0">
        {/* Move your Quiz JSX here */}
      </TabsContent>
    </Tabs>
  );
}
