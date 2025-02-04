"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Tables } from '../../database.types';
import { createClient } from '@/utils/supabase/client';
import { getSubscriptionIds } from '@/server-actions/auth';

type UserContextType = {
    user: Tables<"users"> | null,
    subscriptions: string[],
    isLoading: boolean,
    login: (userId: string) => void,
    logout: () => void
}

export const UserContext = createContext<UserContextType>({
    user: null,
    subscriptions: [],
    isLoading: true,
    login: () => {},
    logout: () => {}
});

export default function UserContextProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<Tables<"users"> | null>(null);
    const [subscriptions, setSubscriptions] = useState<string[]>([]);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log("No user is logged in.");
                setIsLoading(false);
                return
            }

            // Fetch current user
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

            // Get subscriptions
            const { data: subscriptionsData, error: subscriptionsError } = await getSubscriptionIds(user.id);

            if (subscriptionsError && !subscriptionsData) {
                console.log("Couldn't get subscriptions.");
                setIsLoading(false);
                return
            }

            setSubscriptions(subscriptionsData!.map(a => a.id));

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

    const valueObject = useMemo(() => ({
        user: user,
        subscriptions: subscriptions,
        isLoading: isLoading,
        login: login,
        logout: logout
    }), [isLoading, user]);

    return (
        <UserContext.Provider value={valueObject}>
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
