"use client";

import { logout } from "../../server-actions/auth";
import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

const LogoutButton = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { toast } = useToast();

    const clientLogout = useCallback(async () => {
        setIsLoggingOut(true);

        const error = await logout();

        if (error) {
            toast({
                title: "An error occurred.",
                description: error.message
            })
            return
        }
    }, []);

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