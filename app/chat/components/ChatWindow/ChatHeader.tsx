import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChatConversation, useChatHistory } from "@/hooks/use-chat-history";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function ChatHeader({
  user,
  chatHistory,
  selectedChatId,
}: {
  user: {
    username: string;
    email: string;
    expertise: string;
    learning_style: string;
    password: string;
  } | null;
  chatHistory: ChatConversation[];
  selectedChatId: string | null;
}) {
  return (
    <header className="border-b border-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {user && (
          <div className=" flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="font-semibold">
              {chatHistory.find((chat) => chat.id === selectedChatId)?.title ||
                "New Chat"}
            </h1>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-cyan-500 text-cyan-500">
            {user?.expertise || "not set"}
          </Badge>
          <Badge
            variant="outline"
            className={`${
              user
                ? "border-green-500 text-green-500"
                : "border-red-500 text-red-500"
            }`}
          >
            <div
              className={`w-2 h-2 ${
                user ? "bg-green-500" : "bg-red-500"
              } rounded-full mr-1`}
            ></div>
            {user ? "Online" : "Connecting.."}
          </Badge>
        </div>
      </div>
    </header>
  );
}
