import { createClient } from "@/utils/supabase/server";
import MobileSidebarItem from "./MobileSidebarItem";

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
        href: "/home"
    },
    {
        label: "My Programs",
        href: "/creator/programs"
    }
]

const MobileSidebarRoutes = async () => {
    let route = [];

    const supabase = createClient();

    const { data: { user }} = await supabase.auth.getUser();

    if (user !== null) {
        let currentUser = await supabase
            .from("users")
            .select()
            .eq("id", user.id)
            .single()

        if (currentUser?.data?.payments_enabled) {
            route = creatorRoutes
        } else {
            route = userRoutes
        }
    } else {
        route = anonRoutes
    }

    return (
        <div className="flex flex-col w-full">
            {route.map((route) => (
                <MobileSidebarItem key={route.label} label={route.label} href={route.href}></MobileSidebarItem>
            ))}
        </div>
    );
}
 
export default MobileSidebarRoutes;