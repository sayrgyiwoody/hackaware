"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Edit, Trash, Download, MessageSquare, Menu, Edit3, Share, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ChatHistoryItemProps {
  chat: any; // ideally use your ChatConversation type
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

export function ChatHistoryItem({
  chat,
  index,
  isSelected,
  onSelect,
  onRename,
  onDelete,
  onExport,
}: ChatHistoryItemProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title || "");

  const handleRename = () => {
    onRename(chat.id, newTitle);
    setIsRenameOpen(false);
  };

  return (
    <SidebarMenuItem key={chat.id}>
      <SidebarMenuButton
        onClick={() => onSelect(chat.id)}
        isActive={isSelected}
        className="w-full justify-between group"
      >
        <span className="truncate">{chat.title}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
            >
              <Menu className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename Chat</DialogTitle>
                  <DialogDescription>
                    Give this conversation a new name.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="chat-name">Chat Name</Label>
                  <Input
                    id="chat-name"
                    defaultValue={chat.title}
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Chat</DialogTitle>
                  <DialogDescription>
                    Share this conversation with others via a public link.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="share-mode" />
                    <Label htmlFor="share-mode">Make conversation public</Label>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm">
                      https://chat.openai.com/share/abc123...
                    </code>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Copy Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
