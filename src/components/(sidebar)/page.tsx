import Logo from "@/components/(misc)/logo";
import SidebarRoutes from "./SidebarRoutes";
import LoginButton from "../(auth)/LoginButton";
import CreateAccountButton from "../(auth)/CreateAccountButton";
import { createClient } from "@/utils/supabase/server";
import UserInfo from "../(auth)/UserInfo";
import UserDropdown from "./dropdown";

const Sidebar = async () => {
    const supabase = createClient();

    const { data: { user }} = await supabase.auth.getUser();

    let isCreator = false
    let currentUser = null

    if (user !== null) {
        currentUser = await supabase
            .from("users")
            .select()
            .eq("id", user!.id)
            .single()

        if (currentUser !== null && currentUser.data !== null) {
            isCreator = currentUser.data.details_submitted
        }
    }
    
    return (
        <div className="fixed hidden sm:flex flex-col text-white bg-background border-r-[1px] h-full min-w-72 pb-5">
            <Logo></Logo>
            <div className="flex flex-col justify-between h-full">
                <SidebarRoutes></SidebarRoutes>
                {(currentUser !== null && currentUser.data !== null) ? (
                    <div className="px-5 flex flex-row justify-between items-center">
                        <UserInfo fullName={currentUser.data.full_name} username={currentUser.data.username}></UserInfo>
                        <UserDropdown></UserDropdown>
                    </div>
                ) : (
                    <div className="px-5 flex flex-col gap-5">
                        <LoginButton></LoginButton>
                        <CreateAccountButton></CreateAccountButton>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default Sidebar;