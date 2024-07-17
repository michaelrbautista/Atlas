import MobileSidebarItem from "./MobileSidebarItem";

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

const MobileSidebarRoutes = () => {
    const routes = guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <MobileSidebarItem key={route.label} label={route.label} href={route.href}></MobileSidebarItem>
            ))}
        </div>
    );
}
 
export default MobileSidebarRoutes;