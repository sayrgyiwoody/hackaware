"use client";

import type React from "react";
import { useState, type RefObject, useCallback, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Shield,
  HelpCircle,
  Scan,
  PauseOctagon,
  Send,
  Eye,
  Code,
  CheckCircle,
  Upload,
  File,
  X,
  CheckCircle2,
} from "lucide-react";
import { getToken } from "@/lib/authService";

interface InputTabsProps {
  input: string;
  setInput: (val: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  inputContainerRef: RefObject<HTMLDivElement>;
  isRendering: boolean;
  handleSendMessage: () => void;
  handleStop: () => void;

  // Suggestions
  suggestions: string[];
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  filterSuggestions: (val: string) => void;
  selectSuggestion: (val: string) => void;

  // URL Scan
  urlToScan: string;
  setUrlToScan: (val: string) => void;
  isUrlScanning: boolean;
  scanUrl: (url:string) => void;
  showAnalysisModal: boolean;
  setShowAnalysisModal: (val: boolean) => void;
  setMessages: (msgs: any) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function uploadFileToFastAPI(
  file: File,
  endpoint = `${API_URL}/file/files/scan`
): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const token = getToken();
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
}

export default function InputTabs({
  input,
  setInput,
  textareaRef,
  inputContainerRef,
  isRendering,
  handleSendMessage,
  handleStop,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  filterSuggestions,
  selectSuggestion,
  urlToScan,
  setUrlToScan,
  isUrlScanning,
  scanUrl,
  showAnalysisModal,
  setShowAnalysisModal,
  setMessages,
}: InputTabsProps) {
  const [activeTab, setActiveTab] = useState("text");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "uploading" | "success" | "error" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setUploadStatus(null);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
        setUploadStatus(null);
      }
    },
    []
  );

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setUploadStatus(null);
  }, []);

  const uploadFile = useCallback(async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");

    try {
      const data = await uploadFileToFastAPI(selectedFile);
      console.log("File uploaded successfully:", data);
      setMessages((msgs) => [
        ...msgs,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `File Scan Result: ${selectedFile.name}`,
          datetime: new Date(),
          type: "file",
          fileAnalysis: data,
        },
      ]);
      setUploadStatus("success");
    } catch (error) {
      setUploadStatus("error");
    }
  }, [selectedFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="w-full max-w-4xl p-4 border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 lg:rounded-xl mx-auto lg:mb-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="text">General Chat</TabsTrigger>
          <TabsTrigger value="url">URL Scan</TabsTrigger>
          <TabsTrigger value="upload">File Upload</TabsTrigger>
        </TabsList>

        {/* GENERAL CHAT */}
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

                  const el = textareaRef.current;
                  if (el) {
                    el.style.height = "auto";
                    el.style.height = el.scrollHeight + "px";
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
                  if (input.length >= 2) filterSuggestions(input);
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

        {/* URL SCAN */}
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
                    e.preventDefault();
                    if (urlToScan.trim() && !isUrlScanning) {
                      scanUrl(urlToScan);
                    }
                  };
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
                    {[
                      {
                        icon: <Shield className="h-4 w-4 text-cyan-500" />,
                        title: "Security Headers & HTTPS",
                        desc: "Analyze security headers, SSL/TLS configuration, and HTTPS implementation",
                        bg: "bg-cyan-500/20",
                      },
                      {
                        icon: <Eye className="h-4 w-4 text-amber-500" />,
                        title: "Privacy & Tracking",
                        desc: "Detect third-party trackers, cookies, and privacy compliance issues",
                        bg: "bg-amber-500/20",
                      },
                      {
                        icon: <Code className="h-4 w-4 text-red-500" />,
                        title: "JavaScript Vulnerabilities",
                        desc: "Scan for outdated libraries and known security vulnerabilities",
                        bg: "bg-red-500/20",
                      },
                      {
                        icon: (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ),
                        title: "Security Best Practices",
                        desc: "Check Content Security Policy, cookie security, and compliance standards",
                        bg: "bg-green-500/20",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`${item.bg} p-1.5 rounded-full`}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                className="bg-cyan-500 hover:bg-cyan-600"
                onClick={()=>scanUrl(urlToScan)}
                disabled={!urlToScan.trim() || isUrlScanning}
              >
                <Scan className="h-4 w-4 mr-1" />
                {isUrlScanning ? "Scanning..." : "Scan Now"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* FILE UPLOAD */}
        <TabsContent value="upload" className="mt-0">
          <div className="space-y-4">
            {/* Drag and Drop Area */}
            {!selectedFile && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {isDragOver ? "Drop file here" : "Drag and drop a file here"}
                </p>
                <p className="text-gray-400 mb-4">or</p>
                <Button
                  variant="outline"
                  className="cursor-pointer bg-transparent"
                  onClick={handleBrowseClick}
                >
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            {/* Selected File Display */}
            {selectedFile && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-200">Selected File</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatFileSize(selectedFile.size)} •{" "}
                          {selectedFile.type || "Unknown type"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {uploadStatus === "uploading" && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-500 border-t-transparent" />
                      )}
                      {uploadStatus === "success" && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      {uploadStatus === "error" && (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      {!uploadStatus && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="h-8 w-8 p-0 hover:bg-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={uploadFile}
                    disabled={!selectedFile || uploadStatus === "uploading"}
                    className="bg-cyan-500 hover:bg-cyan-600"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadStatus(null);
                    }}
                    disabled={uploadStatus === "uploading"}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
