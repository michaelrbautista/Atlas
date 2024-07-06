import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atlas",
  description: "Unlock your athleticism.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "relative h-full font-sans antialiased overscroll-none", 
        inter.className
        )}>
          <main className='relative flex flex-col min-h-screen bg-systemGray6'>
            <div>
              {children}
            </div>
          </main>
      </body>
    </html>
  );
}
