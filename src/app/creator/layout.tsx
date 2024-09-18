import type { Metadata } from "next";
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
        <Sidebar userRole="creator"></Sidebar>
        <div className="flex flex-col w-full items-start sm:items-center">
          <MobileSidebar userRole="creator"></MobileSidebar>
          {children}
        </div>
    </div>
  );
}
