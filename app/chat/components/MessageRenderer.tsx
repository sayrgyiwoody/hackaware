import { ChatMessage } from "@/app/chat/components/ChatWindow/ChatMessage";
import { ScanResults } from "@/components/scan-results";
import { Progress } from "@radix-ui/react-progress";
import { MessageType } from "../types";
import { ScanResult } from "./ChatWindow/ScanResult";
import ProgressBar from "./ChatWindow/ProgressBar";


export default function MessageRenderer({ message, isRendering }: { message: MessageType; isRendering: boolean }) {
  
  console.log(message);
  
  return (
    <div>
      {message.type !== "analyze" &&
        <ChatMessage message={message} isRendering={isRendering} />
      }

      {message.isScanning && (
        <ProgressBar message={message} />
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
