import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function ChatHeader({
  user,
}: {
  user: {
    username: string;
    email: string;
    expertise: string;
    learning_style: string;
    password: string;
  };
}) {
  return (
    <header className="border-b border-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-cyan-500 mr-2" />
            <span className="font-bold">HackAware </span>{" "}
            <span className="hidden lg:inline-block ms-1"> Security Chat</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-cyan-500 text-cyan-500">
            {user?.expertise || "Expertise not set"}
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Online
          </Badge>
        </div>
      </div>
    </header>
  );
}
