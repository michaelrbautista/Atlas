import MobileSidebarItem from "./MobileSidebarItem";

const MobileSidebarRoutes = async ({
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
                <MobileSidebarItem key={route.label} label={route.label} href={route.href}></MobileSidebarItem>
            ))}
        </div>
    );
}
 
export default MobileSidebarRoutes;