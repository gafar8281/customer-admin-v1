import { useCallback, useState, type ReactNode } from "react"

import { AuthContext, type AuthUser } from "@/auth/auth-context"
import { MOCK_CREDENTIALS } from "@/auth/credentials"

const AUTH_STORAGE_KEY = "cas.auth"

function readStoredUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser)

  const signIn = useCallback(async (email: string, password: string) => {
    const isValid =
      email.trim().toLowerCase() === MOCK_CREDENTIALS.email.toLowerCase() &&
      password === MOCK_CREDENTIALS.password

    if (!isValid) {
      return "Invalid email or password."
    }

    const nextUser: AuthUser = { email: MOCK_CREDENTIALS.email }
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return null
  }, [])

  const signOut = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading: false, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
