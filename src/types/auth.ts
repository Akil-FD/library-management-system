import { UserRole } from "./enums/auth.enum"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User, token?: string) => void
  logout: () => void
}
