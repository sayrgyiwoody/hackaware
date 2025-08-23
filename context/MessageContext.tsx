// context/MessageContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

const MessageContext = createContext<any>(null);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessage = () => useContext(MessageContext);
