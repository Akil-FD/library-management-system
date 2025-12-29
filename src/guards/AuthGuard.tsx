
"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { APP_ROUTES } from "@/constants/app"
import { PageLoader } from "@/components/common/loader"

const AUTH_ROUTES: string[] = [APP_ROUTES.LOGIN]

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    const pathname = usePathname()
    const router = useRouter()

    const isAuthRoute = AUTH_ROUTES.includes(pathname)

    useEffect(() => {
        if (isLoading) return

        if (!isAuthenticated && !isAuthRoute) {
            router.replace(APP_ROUTES.LOGIN)
        }

        if (isAuthenticated && isAuthRoute) {
            router.replace(APP_ROUTES.DASHBOARD_BOOKS)
        }
    }, [isAuthenticated, isLoading, isAuthRoute, router])

    if (isLoading) {
        return <PageLoader />
    }

    if (isAuthenticated && isAuthRoute) {
        return <PageLoader />
    }

    if (!isAuthenticated && !isAuthRoute) {
        return <PageLoader />
    }
    
    return <>{children}</>
}
