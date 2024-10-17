import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import MobileSidebar from "@/components/sidebar/mobile/MobileSidebar";
import Sidebar from "@/components/sidebar/Sidebar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex flex-col w-full items-start sm:items-center">
          <MobileSidebar></MobileSidebar>
          {children}
        </div>
    </div>
  );
}
