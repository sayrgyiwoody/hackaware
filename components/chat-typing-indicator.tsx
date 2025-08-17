import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield } from "lucide-react"

export function ChatTypingIndicator() {
  return (
    <div className="group py-4 px-4">
      <div className="max-w-4xl mx-auto flex gap-4">
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8 border border-gray-700">
            <AvatarFallback className="bg-cyan-500/20 text-cyan-500">
              <Shield className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-white">HackAware</span>
            <span className="text-xs text-gray-500">thinking...</span>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[200px]">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
