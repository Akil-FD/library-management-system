"use client"
import { APP_ROUTES } from "@/constants/app"
import { useAuth } from "@/hooks/useAuth"
import { redirect } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) redirect(APP_ROUTES.LOGIN)
  return children
}
