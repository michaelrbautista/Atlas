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
        <head>
          <meta
            name="apple-itunes-app"
            content="app-id=6484401731"
          />
        </head>
        <Sidebar></Sidebar>
        <div className="flex flex-col w-full items-start sm:items-center">
          <MobileSidebar></MobileSidebar>
          {children}
        </div>
    </div>
  );
}
