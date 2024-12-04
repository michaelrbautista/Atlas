import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google"
import { Toaster } from "@/components/ui/toaster";
import UserContextProvider from "@/context";

const fontSans = FontSans({
  subsets: ["latin"], 
  variable: "--font-sans",
  preload: false
});

export const metadata: Metadata = {
  title: "Atlas"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={cn(
        "bg-systemBackground h-full font-sans antialiased overscroll-none", 
        fontSans.variable
        )}>
          <UserContextProvider>
            <Toaster />
            {children}
          </UserContextProvider>
      </body>
    </html>
  );
}
