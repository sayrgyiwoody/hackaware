import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { MessageProvider } from "@/context/MessageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HackAware - AI-powered Scan, Secure, and Learn Chatbot",
  description:
    "AI-powered assistant to scan websites, detect privacy and security risks, and educate users",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <MessageProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
        </MessageProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
