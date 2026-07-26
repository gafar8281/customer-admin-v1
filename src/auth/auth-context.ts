import { createContext } from "react"

export interface AuthUser {
  email: string
}

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
