"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

type View = "user" | "creator";

type ViewContextType = {
    view: View,
    setView: Dispatch<SetStateAction<View>>
}

export const ViewContext = createContext<ViewContextType | null>(null);

export default function ViewContextProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {
    const [view, setView] = useState<View>("user");

    return (
        <ViewContext.Provider value={{
            view,
            setView
        }}>
            {children}
        </ViewContext.Provider>
    )
}

export function useViewContext() {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error("useViewContext must be used within a ViewContextProvider.");
    } else {
        return context;
    }
}
