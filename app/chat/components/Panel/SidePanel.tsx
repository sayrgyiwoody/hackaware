"use client";
import { useEffect, useState } from "react";
import { SidePanelFooter } from "./SidePanelFooter";
import { useAuth } from "@/context/AuthContext";
import { ChatConversation } from "@/hooks/use-chat-history";
import { ChatHistorySkeleton, SidePanelFooterSkeleton } from "../ChatSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  MessageSquare,
  Plus,
  Settings,
  User,
  LogOut,
  HelpCircle,
  CreditCard,
  Crown,
  Send,
  Menu,
  Trash2,
  Edit3,
  Share,
  Download,
  MoreVertical,
  MoreHorizontal,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { getToken } from "@/lib/authService";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function SidePanel({
  chatHistory,
  setChatHistory,
  selectedChatId,
  selectChat,
  newChat,
  isFetching = true,
}: {
  chatHistory: ChatConversation[];
  setChatHistory: (history: ChatConversation[]) => void;
  selectedChatId: string | null;
  selectChat: (id: string) => void;
  newChat: () => void;
  isFetching: boolean;
}) {
  const auth = useAuth();

  // if (!auth.user) {
  //   return null;
  // }

  const { setOpenMobile } = useSidebar();

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    setOpenMobile(false);
  };

  const handleNewChat = () => {
    newChat();
    setOpenMobile(false);
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [openRenameDialogId, setOpenRenameDialogId] = useState<string | null>(
    null
  );
  const [renameValues, setRenameValues] = useState<Record<string, string>>({});

  const renameChat = async (chatId: string, newTitle: string) => {
    console.log("conversation_id,new title", chatId, newTitle);
    try {
      const token = getToken();
      console.log("rename request");
      const response = await fetch(
        `${API_URL}/conversations/put/${chatId}?title=${encodeURIComponent(
          newTitle
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conversation_id: chatId, newTitle }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update conversation");
      }

      const data = await response.json();
      setRenameValues((prev) => ({
        ...prev,
        [chatId]: data.title,
      }));
      // Update chat history with new title
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: data.title } : chat
        )
      );
    } catch (error: any) {
      console.error("Error rename chat:", error?.message || error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">HackAware</span>
          <Badge variant="secondary" className="ml-auto">
            <Crown className="w-3 h-3 mr-1" />
            Plus
          </Badge>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <SidebarMenu>
            {!auth.user ? (
              // If no user → show skeleton only
              <ChatHistorySkeleton />
            ) : isFetching ? (
              // If fetching → show skeleton
              <ChatHistorySkeleton />
            ) : chatHistory.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No chat history to show.
              </p>
            ) : (
              chatHistory.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    onClick={() => handleSelectChat(chat.id)}
                    isActive={selectedChatId === chat.id}
                    className="w-full justify-between group"
                  >
                    <span className="flex-1 truncate">
                      {chat.title.length > 22
                        ? `${chat.title.slice(0, 22)}...`
                        : chat.title}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span
                          className="inline-flex justify-center items-center md:opacity-0 md:group-hover:opacity-100 h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()} // prevent row click
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        {/* Rename Dialog */}
                        <Dialog
                          open={openRenameDialogId === chat.id}
                          onOpenChange={(isOpen) =>
                            setOpenRenameDialogId(isOpen ? chat.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                          </DialogTrigger>

                          <DialogContent
                            aria-labelledby={`dialog-title-${chat.id}`}
                            aria-describedby={undefined}
                          >
                            <DialogHeader>
                              <VisuallyHidden>
                                <DialogTitle id={`dialog-title-${chat.id}`}>
                                  Rename Chat
                                </DialogTitle>
                                <DialogDescription
                                  id={`dialog-description-${chat.id}`}
                                >
                                  Give this conversation a new name.
                                </DialogDescription>
                              </VisuallyHidden>
                            </DialogHeader>

                            <div className="py-4">
                              <Label htmlFor={`chat-name-${chat.id}`}>
                                Chat Name
                              </Label>
                              <Input
                                id={`chat-name-${chat.id}`}
                                value={renameValues[chat.id] ?? chat.title}
                                onChange={(e) =>
                                  setRenameValues((prev) => ({
                                    ...prev,
                                    [chat.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    renameChat(
                                      chat.id,
                                      renameValues[chat.id] ?? chat.title
                                    );
                                    setOpenRenameDialogId(null);
                                  }
                                }}
                                className="mt-2"
                              />
                            </div>

                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setOpenRenameDialogId(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  renameChat(
                                    chat.id,
                                    renameValues[chat.id] ?? chat.title
                                  );
                                  setOpenRenameDialogId(null);
                                }}
                                onSelect={(e) => e.preventDefault()}
                              >
                                Save
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Share Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent
                            aria-labelledby={`dialog-title-${chat.id}`}
                            aria-describedby={undefined}
                          >
                            <DialogHeader>
                              <VisuallyHidden>
                                <DialogTitle id={`dialog-title-${chat.id}`}>
                                  Share Chat
                                </DialogTitle>
                                <DialogDescription
                                  id={`dialog-description-${chat.id}`}
                                >
                                  Share this conversation with others via a
                                  public link.
                                </DialogDescription>
                              </VisuallyHidden>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                              <div className="flex items-center space-x-2">
                                <Switch id="share-mode" />
                                <Label htmlFor="share-mode">
                                  Make conversation public
                                </Label>
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

                        {/* Export */}
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Delete */}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>

      {/* Footer with User Dropdown */}
      {isFetching ? (
        <SidePanelFooterSkeleton />
      ) : (
        <SidebarFooter className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-full flex justify-start gap-3 h-12 cursor-pointer items-center">
                <Avatar className="w-8 h-8">
                  {/* <AvatarImage src="/diverse-user-avatars.png" /> */}
                  <AvatarFallback>
                    {auth.user?.username[0] || "JD"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-sm font-medium truncate">
                    {auth.user?.username || "John Doe"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {auth.user?.email || "john@example.com"}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-64">
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => e.stopPropagation()}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent
                  aria-labelledby="profile-settings-title"
                  aria-describedby={undefined}
                >
                  <DialogHeader>
                    <VisuallyHidden>
                      <DialogTitle id="profile-settings-title">
                        Profile Settings
                      </DialogTitle>
                      <DialogDescription id="profile-settings-description">
                        Manage your account information and preferences.
                      </DialogDescription>
                    </VisuallyHidden>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="/diverse-user-avatars.png" />
                        <AvatarFallback>
                          {auth.user?.username[0] || "JD"}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={auth.user?.username}
                        defaultValue="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={auth.user?.email}
                        defaultValue="john@example.com"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => e.stopPropagation()}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent
                  aria-labelledby="settings-dialog-title"
                  aria-describedby={undefined}
                  className="max-w-2xl"
                >
                  <DialogHeader>
                    <VisuallyHidden>
                      <DialogTitle id="settings-dialog-title">
                        Settings
                      </DialogTitle>
                      <DialogDescription id="settings-dialog-description">
                        Customize your HackAware experience.
                      </DialogDescription>
                    </VisuallyHidden>
                  </DialogHeader>
                  <div className="py-4 space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Appearance</h4>
                      <div className="flex items-center justify-between opacity-60">
                        <div className="space-y-1">
                          <Label className="flex items-center gap-2">
                            Dark Mode
                            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Dark mode is currently the only available theme.
                          </p>
                        </div>
                        <Switch checked={true} disabled />{" "}
                        {/* Always on, disabled */}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Notifications</h4>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive updates via email
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Privacy</h4>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Data Collection</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow data collection for improvements
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Reset to Default</Button>
                    <Button>Save Settings</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => e.stopPropagation()}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent
                  aria-labelledby="billing-dialog-title"
                  aria-describedby={undefined}
                >
                  <DialogHeader>
                    <VisuallyHidden>
                      <DialogTitle id="billing-dialog-title">
                        Billing & Subscription
                      </DialogTitle>
                      <DialogDescription id="billing-dialog-description">
                        Manage your subscription and billing information.
                      </DialogDescription>
                    </VisuallyHidden>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">HackAware Plus</span>
                        <Badge>Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        $20/month • Next billing: Jan 15, 2024
                      </p>
                      <Button variant="outline" size="sm">
                        Manage Subscription
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="p-3 border rounded-lg flex items-center gap-3">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm">•••• •••• •••• 4242</span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Download Invoice</Button>
                    <Button>Update Payment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenuSeparator />

              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => e.stopPropagation()}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent
                  aria-labelledby="help-support-title"
                  aria-describedby={undefined}
                >
                  <DialogHeader>
                    <VisuallyHidden>
                      <DialogTitle id="help-support-title">
                        Help & Support
                      </DialogTitle>
                      <DialogDescription id="help-support-description">
                        Get help with HackAware or contact our support team.
                      </DialogDescription>
                    </VisuallyHidden>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 bg-transparent"
                      >
                        <HelpCircle className="w-6 h-6" />
                        <span className="text-sm">FAQ</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 bg-transparent"
                      >
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-sm">Contact Support</span>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedback">Send Feedback</Label>
                      <Textarea
                        id="feedback"
                        placeholder="Tell us about your experience..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Send Feedback</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={auth.logout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
