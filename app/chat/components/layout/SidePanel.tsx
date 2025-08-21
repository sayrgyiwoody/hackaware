"use client";
import { useState } from "react";
import { SidePanelFooter } from "./SidePanelFooter";
import { useAuth } from "@/context/AuthContext";

export default function SidePanel({
  chatHistory,
  selectedChatId,
  selectChat,
}: {
  chatHistory: { id: string; title?: string }[];
  selectedChatId: string | null;
  selectChat: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false); // mobile toggle
  const auth = useAuth();

  if (!auth.user) {
    return null; // or handle unauthenticated state
  }

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 px-3 py-2 bg-gray-800 text-white rounded-md"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>

      {/* Overlay for mobile when side panel is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Side Panel */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen overflow-y-auto w-72 bg-gray-900 flex flex-col border-r border-gray-800 
            scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900
            transform transition-transform duration-300
            ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:relative md:block`}
      >
        {/* content */}
        {/* Close button on mobile */}
        <div className="md:hidden flex justify-end p-2">
          <button
            className="text-white text-xl"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* New Chat Button */}
        <button className="flex items-center justify-center gap-2 m-4 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm font-medium">
          + New Chat
        </button>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chatHistory.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              className={`flex items-center gap-2 p-3 text-sm rounded-md cursor-pointer hover:bg-gray-700 transition-colors ${
                selectedChatId === chat.id ? "bg-gray-700" : ""
              }`}
            >
              <div className="flex-1 truncate">
                {chat.title || `Chat ${index + 1}`}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <SidePanelFooter />
      </aside>
    </>
  );
}
