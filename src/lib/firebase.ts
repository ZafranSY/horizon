import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAQ_1YfEEuGdizNsilI6mZ_Me4vce53RlM",
  authDomain: "horizon-3e3c6.firebaseapp.com",
  projectId: "horizon-3e3c6",
  storageBucket: "horizon-3e3c6.firebasestorage.app",
  messagingSenderId: "852867135336",
  appId: "1:852867135336:web:30efa3f482f04aa0e888dd",
  measurementId: "G-DN96PTVZ8H",
}

// Initialize Firebase only on client side
let app: any = null
let auth: any = null
let db: any = null
let storage: any = null

if (typeof window !== "undefined") {
  // Initialize Firebase only if it hasn't been initialized already
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

  // Initialize Firebase services
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
}

// Initialize Analytics conditionally (only in browser)
export const initializeAnalytics = async () => {
  if (typeof window !== "undefined") {
    try {
      const { getAnalytics, isSupported } = await import("firebase/analytics")
      const analyticsSupported = await isSupported()
      if (analyticsSupported && app) {
        return getAnalytics(app)
      }
    } catch (error) {
      console.error("Analytics initialization error:", error)
    }
  }
  return null
}

export { auth, db, storage }
export default app
