import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "@/app/(sidebar)/Sidebar";
import { AppWrapper } from "@/context";
import Navbar from "./(navbar)/Navbar";

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
    <html lang="en" className="dark">
      <body className={cn(
        "bg-background min-h-screen font-sans antialiased overscroll-none", 
        inter.className
        )}>
          {children}
          {/* <AppWrapper>
            <div className="bg-systemGray6 flex flex-row min-h-screen w-full">
              <div className="hidden md:flex min-w-64">
                <Sidebar></Sidebar>
              </div>
              <div className="flex flex-col w-full">
                <div className="flex md:hidden w-full">
                  <Navbar></Navbar>
                </div>
                {children}
              </div>
            </div>
          </AppWrapper> */}
      </body>
    </html>
  );
}
