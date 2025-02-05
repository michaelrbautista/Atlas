import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import MobileSidebar from "@/components/sidebar/mobile/MobileSidebar";
import Sidebar from "@/components/sidebar/Sidebar";
import Head from "next/head";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
          <meta
              name="apple-itunes-app"
              content="app-id=6484401731"
          />
      </Head>
      <div className="flex">
          <Sidebar></Sidebar>
          <div className="flex flex-col w-full items-start sm:items-center">
            <MobileSidebar></MobileSidebar>
            {children}
          </div>
      </div>
    </>
  );
}
