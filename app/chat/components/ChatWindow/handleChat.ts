// api/chat.ts

import { ChatConversation } from "@/hooks/use-chat-history";
import { MessageType } from "../../types";

let currentAbortController: AbortController | null = null;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type ChatParams = {
  type: "general" | "analyze" | "quiz";
  question: string;
  token: string | null;
  conversationId?: string | null; // optional for continuing chat
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  setConversationId: (id: string) => void;
  setSelectedChatId: (id: string) => void;
  setChatHistory: (newHistory: ChatConversation[]) => void;
  stopRef: React.MutableRefObject<boolean>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRendering: React.Dispatch<React.SetStateAction<boolean>>;
};

export const handleChat = async ({
  type,
  question,
  token,
  conversationId,
  setMessages,
  setConversationId,
  setSelectedChatId,
  setChatHistory,
  stopRef,
  setIsTyping,
  setIsRendering,
}: ChatParams) => {
  // Abort previous request
  if (currentAbortController) {
    currentAbortController.abort();
  }
  const abortController = new AbortController();
  currentAbortController = abortController;
  stopRef.current = false;

  // Initial bot message
  const botMessage: MessageType = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: "",
    isScanning: type === "analyze" ? true : undefined,
    scanProgress: type === "analyze" ? 0 : undefined,
    datetime: new Date(),
  };
  setMessages((prev) => [...prev, botMessage]);

  try {
    let endpoint = "";
    let body: Record<string, any> = {};
    switch (type) {
      case "general":
        endpoint = `${API_URL}/chat/new`;
        body = { question, conversation_id: conversationId };
        setIsTyping(true);
        setIsRendering(false);
        break;
      case "analyze":
        endpoint = `${API_URL}/analyze/new`;
        body = { url: question };
        break;
      case "quiz":
        endpoint = `${API_URL}/quiz/generate`;
        body = { question };
        setIsTyping(true);
        setIsRendering(false);
        break;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
      signal: abortController.signal,
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    // --- Analyze / scan ---
    if (type === "analyze") {
      const result = await response.json();

      if (stopRef.current) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id
              ? {
                  ...msg,
                  content: (msg.content || "") + " ⏹ Stopped by user",
                  isScanning: false,
                  scanProgress: 0,
                }
              : msg
          )
        );
        return;
      }

      // ✅ Only now we show rendering
      setIsRendering(true);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessage.id
            ? {
                ...msg,
                isScanning: false,
                scanProgress: 100,
                scanResults: result.scanned_output,
              }
            : msg
        )
      );

      setConversationId(result.conversation_id);
      setSelectedChatId(result.conversation_id);
      setChatHistory((prev) => [
        ...prev,
        {
          user_id: result.user_id || 0,
          title: result.title || "New Chat",
          id: result.conversation_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      setIsTyping(false);
      // keep rendering true to show scan result
      return;
    }

    // --- General / quiz streaming ---
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    let botText = "";
    const decoder = new TextDecoder();

    while (true) {
      if (stopRef.current) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id
              ? {
                  ...msg,
                  content: (msg.content || "") + " ⏹ Stopped by user",
                  isScanning: false,
                  scanProgress: 0,
                }
              : msg
          )
        );
        break;
      }

      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      botText += chunk;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessage.id ? { ...msg, content: botText } : msg
        )
      );
    }

    let result: any;
    try {
      result = JSON.parse(botText);
    } catch {
      result = {};
    }

    if (!stopRef.current) {
      setConversationId(result.conversation_id);
      setSelectedChatId(result.conversation_id);
      setChatHistory((prev) => [
        ...prev,
        {
          user_id: result.user_id || 0,
          title: result.title || "New Chat",
          id: result.conversation_id || crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    }

    setIsTyping(false);
    setIsRendering(false);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.log("Chat request aborted by user");
    } else {
      console.error("handleChat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "system",
          content: "Something went wrong. Please try again.",
        },
      ]);
    }

    setIsTyping(false);
    setIsRendering(false);
  } finally {
    currentAbortController = null;
  }
};


