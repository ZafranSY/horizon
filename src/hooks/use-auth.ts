"use client"

import { useState, useEffect } from "react"
import type { User } from "firebase/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const initAuth = async () => {
      try {
        if (typeof window === "undefined") {
          setLoading(false)
          return
        }

        // Dynamic import to ensure client-side only
        const { auth } = await import("@/lib/firebase")
        const { onAuthStateChanged } = await import("firebase/auth")

        if (!auth) {
          console.warn("Firebase auth not initialized")
          setLoading(false)
          return
        }

        unsubscribe = onAuthStateChanged(
          auth,
          (currentUser) => {
            setUser(currentUser)
            setLoading(false)
            setError(null)
          },
          (error) => {
            console.error("Auth state change error:", error)
            setError(error.message)
            setLoading(false)
          },
        )
      } catch (error: any) {
        console.error("Auth initialization error:", error)
        setError(error.message)
        setLoading(false)
      }
    }

    initAuth()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return { user, loading, error }
}
