"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { Tables } from '../../database.types';
import { createClient } from '@/utils/supabase/client';

type UserContextType = {
    user: Tables<"users"> | null,
    isLoading: boolean,
    login: (userId: string) => void,
    logout: () => void
}

export const UserContext = createContext<UserContextType>({
    user: null,
    isLoading: true,
    login: () => {},
    logout: () => {}
});

export default function UserContextProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<Tables<"users"> | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log("No user is logged in.");
                setIsLoading(false);
                return
            }

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select()
                .eq("id", user.id)
                .single()

            if (userError && !userData) {
                console.log("Couldn't get logged in user.");
                setIsLoading(false);
                return
            }

            setUser(userData);

            if (!userData.payments_enabled) {
                setIsLoading(false);
                return
            }

            setIsLoading(false);
        }

        checkAuth();
    }, []);

    const login = async (userId: string) => {
        setIsLoading(true);

        const supabase = createClient();

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select()
            .eq("id", userId)
            .single()

        if (userError && !userData) {
            console.log("Couldn't get logged in user.");
            setIsLoading(false);
            return
        }

        setUser(userData);

        setIsLoading(false);
    }

    const logout = () => {
        setUser(null);
    }

    return (
        <UserContext.Provider value={{
            user,
            isLoading,
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
