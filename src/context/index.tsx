"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { Tables } from '../../database.types';
import { createClient } from '@/utils/supabase/client';

type UserContextType = {
    user: Tables<"users"> | null,
    team: Tables<"teams"> | null,
    login: (userId: string) => void,
    logout: () => void
}

export const UserContext = createContext<UserContextType>({
    user: null,
    team: null,
    login: () => {},
    logout: () => {}
});

export default function UserContextProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {
    const [user, setUser] = useState<Tables<"users"> | null>(null);
    const [team, setTeam] = useState<Tables<"teams"> | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log("No user is logged in.")
                return
            }

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select()
                .eq("id", user.id)
                .single()

            if (userError && !userData) {
                console.log("Couldn't get logged in user.")
                return
            }

            setUser(userData);

            if (!userData.team_id) {
                console.log("Couldn't get logged in user.")
                return
            }

            const { data: teamData, error: teamError } = await supabase
                .from("teams")
                .select()
                .eq("id", userData.team_id)
                .single()

            if (teamError && !teamData) {
                console.log("Couldn't get logged in user's team.")
                return
            }

            setTeam(teamData);
        }

        checkAuth();
    }, []);

    const login = async (userId: string) => {
        const supabase = createClient();

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select()
            .eq("id", userId)
            .single()

        if (userError && !userData) {
            console.log("Couldn't get logged in user.")
            return
        }

        setUser(userData);

        if (!userData.team_id) {
            console.log("Couldn't get logged in user.")
            return
        }

        const { data: teamData, error: teamError } = await supabase
            .from("teams")
            .select()
            .eq("id", userData.team_id)
            .single()

        if (teamError && !teamData) {
            console.log("Couldn't get logged in user's team.")
            return
        }

        setTeam(teamData);
    }

    const logout = () => {
        setUser(null);
        setTeam(null);
    }

    return (
        <UserContext.Provider value={{
            user,
            team,
            login,
            logout
        }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserContextProvider.");
    } else {
        return context;
    }
}
