"use client";

import SidebarItem from "./SidebarItem";
import { useViewContext } from "@/context";

const anonRoutes = [
    {
        label: "Home",
        href: "/home"
    }
]

const userRoutes = [
    {
        label: "Home",
        href: "/home"
    },
    {
        label: "Programs",
        href: "/programs"
    }
]

const creatorRoutes = [
    {
        label: "My Team",
        href: "/creator/team"
    },
    {
        label: "My Programs",
        href: "/creator/programs"
    }
]

const SidebarRoutes = ({
    signedIn
}: {
    signedIn: boolean
}) => {
    let route = [];

    const context = useViewContext();

    if (signedIn) {
        if (context.view == "user") {
            route = userRoutes
        } else {
            route = creatorRoutes
        }
    } else {
        route = anonRoutes
    }

    return (
        <div className="flex flex-col w-full">
            {route.map((route) => (
                <SidebarItem key={route.label} label={route.label} href={route.href}></SidebarItem>
            ))}
        </div>
    );
}
 
export default SidebarRoutes;