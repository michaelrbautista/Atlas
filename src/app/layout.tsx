import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster";
import UserContextProvider from "@/context";

const inter = Inter({
  subsets: ["latin"], 
  variable: "--font-inter",
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
      <head>
        <meta
          name="apple-itunes-app"
          content="app-id=6484401731"
        />
      </head>
      <body className={cn(
        "bg-systemBackground h-full font-sans antialiased overscroll-none", 
        inter.variable
        )}>
          <UserContextProvider>
            <Toaster />
            {children}
          </UserContextProvider>
      </body>
    </html>
  );
}
