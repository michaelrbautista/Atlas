import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google"
import Navbar from "@/components/(sidebar)/(mobile)/page";
import Sidebar from "@/components/(sidebar)/page";
import ViewContextProvider from "@/context";

const fontSans = FontSans({
  subsets: ["latin"], 
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Atlas",
  description: "Unlock your athleticism.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewContextProvider>
      <div className="h-full flex">
          <Sidebar></Sidebar>
          <div className="flex flex-col w-full items-center sm:pl-72">
            <Navbar></Navbar>
            {children}
          </div>
      </div>
    </ViewContextProvider>
  );
}
