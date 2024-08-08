"use client";

import { createClient } from "@/utils/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";
import { Tables } from "../../database.types";

type UserContext = {
    id: string,
    username: string,
    fullName: string,
    detailsSubmitted: boolean
}

const defaultUser: UserContext = {
    id: "",
    username: "",
    fullName: "",
    detailsSubmitted: false
}

const AuthContext = createContext<UserContext>(defaultUser);

export function AppWrapper({ children } : {
    children: React.ReactNode;
}) {
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [detailsSubmitted, setdetailsSubmitted] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();

            const { data: { user }} = await supabase.auth.getUser();

            if (user !== null) {
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select()
                    .eq("id", user.id)
                    .single()

                if (userError) {
                    return;
                }

                if (userData) {
                    setId(userData.id)
                    setUsername(userData.username)
                    setFullName(userData.full_name)
                    setdetailsSubmitted(userData.details_submitted)
                }
            }
        }

        getUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            id: id,
            username: username,
            fullName: fullName,
            detailsSubmitted: detailsSubmitted
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AuthContext);
}