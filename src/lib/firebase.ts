import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { initializeFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

if (!firebaseConfig.projectId) {
  throw new Error(
    "Missing VITE_FIREBASE_PROJECT_ID — check your .env file against .env.example"
  )
}

const app = initializeApp(firebaseConfig)

// initialised before Firestore so Firestore picks up the auth credentials provider
export const auth = getAuth(app)

// note field on Debt is optional; addDoc throws on undefined values without this
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true })

// Resolves once persistence has restored (or ruled out) a session from a previous visit.
// Without it, currentUser is null on a hard refresh even when a session does exist.
const authReady = new Promise<void>((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, () => {
    unsubscribe()
    resolve()
  })
})

let pending: Promise<unknown> | null = null

/**
 * Guarantees an anonymous Firebase Auth session before any Firestore access —
 * the security rules require `request.auth != null`. Safe to call repeatedly and
 * concurrently; re-checks currentUser each time so a login after signOut re-signs in.
 */
export async function ensureAnonymousAuth(): Promise<void> {
  await authReady
  if (auth.currentUser) return
  // cleared in finally so a failed attempt can be retried on the next call
  pending ??= signInAnonymously(auth).finally(() => {
    pending = null
  })
  await pending
}
