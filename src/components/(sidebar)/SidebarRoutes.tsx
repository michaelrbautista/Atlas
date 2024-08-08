import { createClient } from "@/utils/supabase/server";
import SidebarItem from "./SidebarItem";

const anonRoutes = [
    {
        label: "Home",
        href: "/home"
    },
    {
        label: "Search",
        href: "/search"
    }
]

const userRoutes = [
    {
        label: "Home",
        href: "/home"
    },
    {
        label: "Search",
        href: "/search"
    },
    {
        label: "Programs",
        href: "/programs"
    }
]

const creatorRoutes = [
    {
        label: "Home",
        href: "/home"
    },
    {
        label: "My Programs",
        href: "/myPrograms"
    }
]

const SidebarRoutes = async () => {
    let route = [];

    const supabase = createClient();

    const { data: { user }} = await supabase.auth.getUser();

    if (user !== null) {
        let currentUser = await supabase
            .from("users")
            .select()
            .eq("id", user!.id)
            .single()

        if (currentUser !== null && currentUser.data !== null && currentUser.data.details_submitted) {
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
                <SidebarItem key={route.label} label={route.label} href={route.href}></SidebarItem>
            ))}
        </div>
    );
}
 
export default SidebarRoutes;