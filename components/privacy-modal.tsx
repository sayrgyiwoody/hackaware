"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, Server } from "lucide-react"

export function PrivacyModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-cyan-500 hover:text-cyan-400">
          How CyGuard protects your privacy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-500" />
            How CyGuard Protects Your Privacy
          </DialogTitle>
          <DialogDescription>Our commitment to keeping your data secure and private</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-3">
            <div className="bg-cyan-500/20 p-2 rounded-full h-fit">
              <Lock className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h4 className="font-medium mb-1">End-to-End Encryption</h4>
              <p className="text-sm text-gray-400">
                All your conversations with CyGuard are encrypted from end to end, ensuring no one can access your
                sensitive information.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-cyan-500/20 p-2 rounded-full h-fit">
              <Eye className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h4 className="font-medium mb-1">No Data Selling</h4>
              <p className="text-sm text-gray-400">
                We never sell your data to third parties. Your information is used solely to improve your security and
                experience.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-cyan-500/20 p-2 rounded-full h-fit">
              <Server className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Minimal Data Storage</h4>
              <p className="text-sm text-gray-400">
                We only store what's necessary to provide our service, and you can request deletion of your data at any
                time.
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setOpen(false)}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  )
}
