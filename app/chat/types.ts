export type MessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
  datetime: Date;
  icon?: string;
  status?: "normal" | "warning" | "danger" | "success" | "info";
  scanResults?: any;
  isScanning?: boolean;
  scanProgress?: number;
  threatAlert?: any;
  interactiveDemo?: any;
  quiz?: any;
  codeExample?: any;
  securityTip?: any;
  type?: any;
};
