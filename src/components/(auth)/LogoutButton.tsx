"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { logout } from "./actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

const LogoutButton = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function clientLogout() {
        setIsLoggingOut(true);

        logout();
    }

    if (isLoggingOut) {
        return (
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
        )
    } else {
        return (
            <form className="w-full" action={clientLogout}>
                <button className="w-full h-full px-2 py-1.5 text-start">Logout</button>
            </form>
        )
    }
}
 
export default LogoutButton;