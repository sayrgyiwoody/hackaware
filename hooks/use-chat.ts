import { useState } from "react";

export function useChat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<
    { id: number; title?: string }[]
  >([
    { id: 1, title: "First Chat" },
    { id: 2, title: "Second Chat" },
  ]);
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const selectChat = (id: number) => setActiveChat(id);
  const newChat = () => {
    const id = Date.now();
    setChatHistory((prev) => [
      ...prev,
      { id, title: `Chat ${prev.length + 1}` },
    ]);
    setActiveChat(id);
  };

  return {
    isSidebarOpen,
    toggleSidebar,
    chatHistory,
    activeChat,
    selectChat,
    newChat,
  };
}
