"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext({
    authUserId: null
});

export function AppWrapper({ children } : {
    children: React.ReactNode;
}) {
    const [state, setState] = useState({
        authUserId: null
    });

    return (
    <AppContext.Provider value={state}>
        {children}
    </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}