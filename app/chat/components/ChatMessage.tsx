import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, User } from "lucide-react"
import { MarkdownRenderer } from "../../../components/markdown-renderer"
import { MessageActions } from "../../../components/message-actions"
import MessageTime from "../../../components/message-time"
import { MessageType } from "@/app/chat/types"

interface ChatMessageProps {
  message: MessageType
  onRegenerate?: () => void
  onEdit?: () => void
  isRendering: boolean
}

export function ChatMessage({ message, onRegenerate, onEdit, isRendering }: ChatMessageProps) {
  const isBot = message.role === "bot"

  if (!message || !message.content) {
    return null; // Don't render anything if message is empty
  }
  
  return (
    <div className={`group py-4 lg:px-4 ${isBot ? "bg-transparent" : "bg-transparent"}`}>
      <div className={`max-w-4xl mx-auto flex gap-4 ${isBot ? "" : "flex-row-reverse"}`}>
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8 border border-gray-700 hidden lg:block">
            <AvatarFallback className={isBot ? "bg-cyan-500/20 text-cyan-500" : "bg-blue-500/20 text-blue-500"}>
              {isBot ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className={`flex-1 min-w-0 ${isBot ? "" : "flex flex-col items-end"}`}>
          <div className={`flex items-center gap-2 mb-2 ${isBot ? "" : "flex-row-reverse"}`}>
            <span className="font-semibold text-white">{isBot ? "HackAware" : "You"}</span>
            <MessageTime timestamp={message.timestamp} />
          </div>

          <div className={`${isBot ? "max-w-none" : "max-w-[80%]"}`}>
            {isBot ? (
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={message.content} />
                
              </div>
            ) : (
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg">
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
              </div>
            )}
          </div>

          {isBot && !isRendering && (
            <MessageActions
              content={message.content}
              messageId={message.id}
              onRegenerate={onRegenerate}
              onEdit={onEdit}
            />
          )}
        </div>
      </div>
    </div>
  )
}
