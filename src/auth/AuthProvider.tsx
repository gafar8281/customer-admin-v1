import { useCallback, useEffect, useState, type ReactNode } from "react"
import { signOut as firebaseSignOut } from "firebase/auth"
import { collection, getDocs, limit, query, where } from "firebase/firestore"

import { AuthContext, type AuthUser } from "@/auth/auth-context"
import { auth, db, ensureAnonymousAuth } from "@/lib/firebase"

const AUTH_STORAGE_KEY = "cas.auth"
const USERS_COLLECTION = "customer_user"

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
  // read once at mount; only the effect below consumes it
  const [storedSession] = useState(readStoredUser)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(storedSession !== null)

  // Restores the stored session on refresh. The anonymous sign-in has to land before
  // any page mounts, otherwise its Firestore subscriptions fire without an auth token
  // and the rules reject them.
  useEffect(() => {
    if (!storedSession) return

    let cancelled = false

    ensureAnonymousAuth()
      .then(() => {
        if (!cancelled) setUser(storedSession)
      })
      .catch(() => {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [storedSession])

  const signIn = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()

    let stored: { email?: unknown; password?: unknown } | undefined
    try {
      await ensureAnonymousAuth()
      const snapshot = await getDocs(
        query(
          collection(db, USERS_COLLECTION),
          where("email", "==", normalizedEmail),
          limit(1)
        )
      )
      stored = snapshot.docs[0]?.data()
    } catch {
      return "sign_in_failed"
    }

    if (!stored || stored.password !== password) {
      return "invalid_credentials"
    }

    const nextUser: AuthUser = { email: normalizedEmail }
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return null
  }, [])

  const signOut = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
    firebaseSignOut(auth).catch(() => {})
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
