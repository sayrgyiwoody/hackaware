import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, HelpCircle, Sparkles, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function SidePanelFooter() {
  const auth = useAuth();

  if (!auth.user) {
    return null; // or handle unauthenticated state
  }
  return (
    <div className="p-4 border-t border-gray-800">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2 py-2 text-gray-200 hover:bg-gray-800"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback>{auth.user?.username[0] || 'W'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left text-xs">
              <span className="font-medium">{auth.user?.username|| 'Woody'}</span>
              <span className="text-gray-400">Free</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-900 text-gray-200 border border-gray-800">
          <DropdownMenuLabel className="text-xs text-gray-400">
            waiyanwoody@gmail.com
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Sparkles className="mr-2 h-4 w-4" /> Upgrade plan
          </DropdownMenuItem>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" /> Customize HackAware
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" /> Help
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={auth.logout}>
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
