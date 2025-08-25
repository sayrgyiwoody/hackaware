import { ChatMessage } from "@/app/chat/components/ChatWindow/ChatMessage";
import { ScanResults } from "@/components/scan-results";
import { Progress } from "@radix-ui/react-progress";
import { MessageType } from "../types";
import { ScanResult } from "./ChatWindow/ScanResult";


export default function MessageRenderer({ message, isRendering }: { message: MessageType; isRendering: boolean }) {
  
  console.log(message);
  
  return (
    <div>
      {message.type !== "analyze" &&
        <ChatMessage message={message} isRendering={isRendering} />
      }

      {message.isScanning && (
        <div className="ml-11 mt-2">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-w-[80%]">
            <div className="flex justify-between text-sm mb-2">
              <span>🔍 Deep security analysis in progress...</span>
              <span>{message.scanProgress}%</span>
            </div>
            <Progress
              value={message.scanProgress || 0}
              className="h-2 bg-gray-700 mb-3"
            >
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
            </Progress>
            <div className="text-xs text-gray-400 space-y-1">
              {(message.scanProgress || 0) > 15 && (
                <div>✓ Analyzing HTTP security headers</div>
              )}
              {(message.scanProgress || 0) > 30 && (
                <div>✓ Detecting third-party trackers</div>
              )}
              {(message.scanProgress || 0) > 45 && (
                <div>✓ Scanning JavaScript libraries for vulnerabilities</div>
              )}
              {(message.scanProgress || 0) > 60 && (
                <div>✓ Checking SSL/TLS configuration</div>
              )}
              {(message.scanProgress || 0) > 75 && (
                <div>✓ Analyzing privacy policies and consent mechanisms</div>
              )}
              {(message.scanProgress || 0) > 90 && (
                <div>✓ Generating security recommendations</div>
              )}
            </div>
          </div>
        </div>
      )}

      {message.scanResults && (
        <div className="ml-11 mt-2">
          {/* <ScanResults results={message.scanResults} /> */}
          <ScanResult data={message.scanResults} />
        </div>
      )}

      
    </div>
  );
}
