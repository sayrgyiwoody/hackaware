import { useState, useEffect } from "react";
import { getToken } from "@/lib/authService";
import { MessageType } from "@/app/chat/types";


export const useConversationMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async (id: string) => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = getToken();
      const res = await fetch(`${API_URL}/conversations/get/history/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
        const data: MessageType[] = await res.json();
      setMessages(data.conversation);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages when conversationId changes
  useEffect(() => {
    if (conversationId !== null) {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  return {
    messages,
    setMessages,
    loading,
    error,
    refetch: () => conversationId && fetchMessages(conversationId),
  };
};
