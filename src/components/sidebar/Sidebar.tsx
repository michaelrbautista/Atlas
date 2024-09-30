import Logo from "@/components/misc/Logo";
import SidebarRoutes from "./SidebarRoutes";
import SignInButton from "../auth/SignInButton";
import CreateAccountButton from "../auth/CreateAccountButton";
import { createClient } from "@/utils/supabase/server";
import UserInfo from "../auth/UserInfo";
import UserDropdown from "./UserDropdown";
import CreateTeamSidebarButton from "./CreateTeamSidebarButton";
import { updateStripePaymentsEnabled } from "@/server-actions/creator";

export type UserRole = "user" | "creator";

const anonRoutes = [
    {
        label: "Home",
        href:"/home"
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
    },
    {
        label: "My Exercises",
        href: "/creator/exercises"
    }
]

let url: string;
if (process.env.NODE_ENV === "production") {
    url = process.env.PROD_URL as string
} else {
    url = process.env.TEST_URL as string
}

const Sidebar = async ({
    userRole
}: {
    userRole: UserRole
}) => {
    // Get user ifo
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    let currentUser = null
    let routes = anonRoutes;

    if (user) {
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select()
            .eq("id", user.id)
            .single()

        if (userData && !userError) {
            currentUser = userData

            if (userData.stripe_account_id) {
                fetch(`${url}/api/get-stripe-account`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ stripeAccountId: userData.stripe_account_id })
                })
                .then((res) => res.json())
                .then((data) => {
                    // Check if payments are enabled/disabled from stripe, updating db accordingly
                    const stripeResponse = data.charges_enabled && data.details_submitted && data.payouts_enabled;

                    if (stripeResponse != userData.payments_enabled && userData.stripe_account_id) {
                        updateStripePaymentsEnabled(userData.stripe_account_id, stripeResponse);
                    }
                });
            }
        }

        if (userRole == "creator") {
            routes = creatorRoutes
        } else {
            routes = userRoutes
        }
    }
    
    return (
        <aside className="sticky left-0 top-0 z-50 h-screen w-64 shrink-0 hidden md:flex flex-col text-white bg-background border-r-[1px] pb-5">
            <Logo></Logo>
            <div className="flex flex-col justify-between h-full">
                <SidebarRoutes routes={routes}></SidebarRoutes>
                {(currentUser) ? (
                    <div className="w-full flex flex-col px-5 gap-5">
                        {(!currentUser.team_id &&
                            <CreateTeamSidebarButton></CreateTeamSidebarButton>
                        )}
                        <div className="flex flex-row justify-between items-center">
                            <UserInfo fullName={currentUser.full_name} username={currentUser.username}></UserInfo>
                            <UserDropdown teamId={currentUser.team_id != null} userRole={userRole}></UserDropdown>
                        </div>
                    </div>
                ) : (
                    <div className="px-5 flex flex-col gap-5">
                        <SignInButton fromLandingPage={false}></SignInButton>
                        <CreateAccountButton fromLandingPage={false}></CreateAccountButton>
                    </div>
                )}
            </div>
        </aside>
    );
}
 
export default Sidebar;