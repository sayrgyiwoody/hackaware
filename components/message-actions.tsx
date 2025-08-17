"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp, ThumbsDown, Volume2, Edit3, Download, RotateCcw, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MessageActionsProps {
  content: string
  messageId: string
  onRegenerate?: () => void
  onEdit?: () => void
}

// Function to convert markdown to plain text
const markdownToPlainText = (markdown: string): string => {
  return (
    markdown
      // Remove headers (# ## ###)
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold (**text** or __text__)
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      // Remove italic (*text* or _text_)
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/_(.*?)_/g, "$1")
      // Remove strikethrough (~~text~~)
      .replace(/~~(.*?)~~/g, "$1")
      // Remove inline code (`code`)
      .replace(/`([^`]+)`/g, "$1")
      // Remove code blocks (```code```)
      .replace(/```[\s\S]*?```/g, (match) => {
        // Extract just the code content, removing language identifier and backticks
        return match
          .replace(/```\w*\n?/g, "")
          .replace(/```/g, "")
          .trim()
      })
      // Remove links [text](url) -> text
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1")
      // Remove images ![alt](url)
      .replace(/!\[([^\]]*)\]$$[^)]+$$/g, "$1")
      // Remove horizontal rules (--- or ***)
      .replace(/^[-*]{3,}$/gm, "")
      // Remove blockquotes (> text)
      .replace(/^>\s+/gm, "")
      // Remove list markers (- * +)
      .replace(/^[\s]*[-*+]\s+/gm, "• ")
      // Remove numbered list markers (1. 2. etc)
      .replace(/^[\s]*\d+\.\s+/gm, "• ")
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Clean up extra whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  )
}

export function MessageActions({ content, messageId, onRegenerate, onEdit }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)

  const handleCopy = async () => {
    try {
      // Convert markdown to plain text before copying
      const plainText = markdownToPlainText(content)
      await navigator.clipboard.writeText(plainText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      if (isPlaying) {
        speechSynthesis.cancel()
        setIsPlaying(false)
      } else {
        // Use plain text for speech synthesis
        const plainText = markdownToPlainText(content)
        const utterance = new SpeechSynthesisUtterance(plainText)
        utterance.onend = () => setIsPlaying(false)
        speechSynthesis.speak(utterance)
        setIsPlaying(true)
      }
    }
  }

  const handleDownload = () => {
    // For download, we keep the markdown format
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `hackaware-response-${messageId}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(feedback === type ? null : type)
    // In a real app, you would send this feedback to your backend
    console.log(`Feedback for message ${messageId}: ${type}`)
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0 hover:bg-gray-700">
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied as plain text!" : "Copy as plain text"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback("up")}
              className={`h-8 w-8 p-0 hover:bg-gray-700 ${feedback === "up" ? "text-green-400" : "text-gray-400"}`}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Good response</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback("down")}
              className={`h-8 w-8 p-0 hover:bg-gray-700 ${feedback === "down" ? "text-red-400" : "text-gray-400"}`}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Poor response</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeak}
              className={`h-8 w-8 p-0 hover:bg-gray-700 ${isPlaying ? "text-cyan-400" : "text-gray-400"}`}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPlaying ? "Stop reading" : "Read aloud"}</p>
          </TooltipContent>
        </Tooltip>

        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0 hover:bg-gray-700 text-gray-400"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit message</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0 hover:bg-gray-700 text-gray-400"
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download as markdown</p>
          </TooltipContent>
        </Tooltip>

        {onRegenerate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-8 w-8 p-0 hover:bg-gray-700 text-gray-400"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Regenerate response</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
