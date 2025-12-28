"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { AuthContext } from "@/context/AuthContext"
import { AuthUser, User } from "@/types/auth"


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (storedUser && token) {
            setUser({
                ...JSON.parse(storedUser),
                token,
            })
        }

        setIsLoading(false)
    }, [])

    const login = useCallback((userData: User, token?: string) => {
        const authUser = { ...userData, token: token || "" }

        setUser(authUser);

        localStorage.setItem("user", JSON.stringify(userData));
        if (token) {
            localStorage.setItem("token", token);
        }else{
            localStorage.removeItem("token");
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }, [])

    const { token, ...userInfo } = user || { token: "" };

    const value = useMemo(
        () => ({
            user: userInfo ? userInfo as User : null,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
        }),
        [user, isLoading, login, logout]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
