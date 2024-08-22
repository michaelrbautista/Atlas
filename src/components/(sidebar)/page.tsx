import Logo from "@/components/(misc)/Logo";
import SidebarRoutes from "./SidebarRoutes";
import LoginButton from "../(auth)/LoginButton";
import CreateAccountButton from "../(auth)/CreateAccountButton";
import { createClient } from "@/utils/supabase/server";
import UserInfo from "../(auth)/UserInfo";
import UserDropdown from "./UserDropdown";
import CreateTeamSidebarButton from "./CreateTeamSidebarButton";

const Sidebar = async () => {
    // Get user ifo
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    let currentUser = null

    if (user !== null) {
        currentUser = await supabase
            .from("users")
            .select()
            .eq("id", user.id)
            .single()
    }
    
    return (
        <div className="fixed hidden sm:flex flex-col text-white bg-background border-r-[1px] h-full min-w-72 pb-5">
            <Logo></Logo>
            <div className="flex flex-col justify-between h-full">
                <SidebarRoutes signedIn={user != null}></SidebarRoutes>
                {(currentUser?.data) ? (
                    <div className="w-full flex flex-col px-5 gap-5">
                        {(!currentUser.data.team_id &&
                            <CreateTeamSidebarButton></CreateTeamSidebarButton>
                        )}
                        <div className="flex flex-row justify-between items-center">
                            <UserInfo fullName={currentUser.data.full_name} username={currentUser.data.username}></UserInfo>
                            <UserDropdown teamId={currentUser.data.team_id != null}></UserDropdown>
                        </div>
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