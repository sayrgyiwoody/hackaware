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
import { LogOut, Settings, HelpCircle, Sparkles, User, CreditCard, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SidePanelFooterSkeleton } from "../ChatSkeleton";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SidePanelFooter() {
  const auth = useAuth();

  return (
    <div className="p-4 border-t border-gray-800">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-3 h-12">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>{auth.user?.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-medium truncate">{auth.user?.username}</span>
              <span className="text-xs text-muted-foreground">
                {auth.user?.email}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <User className="w-4 h-4 mr-2" />
                My Profile
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Profile Settings</DialogTitle>
                <DialogDescription>
                  Manage your account information and preferences.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/diverse-user-avatars.png" />
                    <AvatarFallback>{auth.user?.username[0]}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={auth.user?.username} defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={auth.user?.email} defaultValue="john@example.com" />
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>
                  Customize your HackAware experience.
                </DialogDescription>
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
      <Switch checked={true} disabled /> {/* Always on, disabled */}
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Billing & Subscription</DialogTitle>
                <DialogDescription>
                  Manage your subscription and billing information.
                </DialogDescription>
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Help & Support</DialogTitle>
                <DialogDescription>
                  Get help with HackAware or contact our support team.
                </DialogDescription>
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
          <DropdownMenuItem className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
