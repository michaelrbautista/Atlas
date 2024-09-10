"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
    label: string
    href: string
}

const SidebarItem = ({
    label,
    href
}: SidebarItemProps ) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = 
        (pathname === "/" && href === "/") ||
        (pathname === href) || 
        (pathname?.startsWith(`${href}/`));

    const onClick = () => {
        router.push(href);
    }

    return (
        <button onClick={onClick} type="button" className={cn(
            "text-secondaryText text-left font-bold text-sm px-5 py-2 w-full hover:bg-systemGray4",
            isActive && "text-primaryText bg-systemGray4"
        )}>{label}</button>
    );
}
 
export default SidebarItem;