"use client";

import SidebarItem from "./SidebarItem";

const SidebarRoutes = ({
    routes
}: {
    routes: {
        label: string,
        href: string
    }[]
}) => {
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem key={route.label} label={route.label} href={route.href}></SidebarItem>
            ))}
        </div>
    );
}
 
export default SidebarRoutes;