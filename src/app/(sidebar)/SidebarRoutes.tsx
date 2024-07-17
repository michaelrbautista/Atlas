import Link from "next/link";
import SidebarItem from "./SidebarItem";

const guestRoutes = [
    {
        label: "Home",
        href: "/"
    },
    {
        label: "Saved Programs",
        href: "/savedPrograms"
    }
]

const SidebarRoutes = () => {
    const routes = guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem key={route.label} label={route.label} href={route.href}></SidebarItem>
            ))}
        </div>
    );
}
 
export default SidebarRoutes;