// components/layout/WelcomeMessage.tsx
import { Shield } from "lucide-react";

export default function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10 text-gray-300">
      <Shield className="w-12 h-12 text-cyan-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Welcome to HackAware! 🛡️</h1>
      <p className="mb-4 text-gray-400">
        I'm your AI web security assistant.
      </p>

      
    </div>
  );
}
