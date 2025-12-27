"use client"

import { AuthContextType, } from "@/types/auth"
import { createContext, useContext } from "react"

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => useContext(AuthContext)
