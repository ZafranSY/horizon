"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  FileText,
  Home,
  LineChart,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  TrendingUp,
  User,
  X,
  Camera,
  Edit,
  Save,
  Loader2,
  Mail,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { user, loading, error } = useAuth()

  const [profileData, setProfileData] = useState({
    name: "Demo User",
    email: "demo@example.com",
    phone: "+60 12-345 6789",
    location: "Kuala Lumpur, Malaysia",
    joinDate: "January 2024",
    bio: "Retail investor interested in Malaysian equities and technology stocks. Learning about financial markets through Horizon AI.",
    investmentExperience: "Beginner",
    riskTolerance: "Moderate",
    investmentGoals: "Long-term growth",
    preferredSectors: ["Technology", "Healthcare", "Finance"],
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.displayName || "User",
        email: user.email || "user@example.com",
      }))
    }
  }, [user])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, current: false },
    { name: "Market Data", href: "/dashboard/market", icon: LineChart, current: false },
    { name: "Watchlist", href: "/dashboard/watchlist", icon: BarChart3, current: false },
    { name: "News & Insights", href: "/dashboard/news", icon: FileText, current: false },
    { name: "Document Analysis", href: "/dashboard/documents", icon: BookOpen, current: false },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: MessageSquare, current: false },
  ]

  const userNavigation = [
    { name: "Profile", href: "/dashboard/profile", icon: User, current: true },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, current: false },
  ]

  const handleSignOut = async () => {
    try {
      if (typeof window !== "undefined") {
        const { auth } = await import("@/lib/firebase")
        const { signOut } = await import("firebase/auth")

        if (auth) {
          await signOut(auth)
        }
      }
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      router.push("/")
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const currentUser = user || { email: "demo@example.com", displayName: "Demo User" }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "shadow-lg" : ""}`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Horizon AI</span>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-accent">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1 p-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                item.current
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t p-2">
          <div className="flex flex-col gap-1">
            {userNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  item.current
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-red-500 hover:bg-red-50 hover:text-red-600 w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? (isMobile ? "ml-0" : "ml-64") : "ml-0"
        }`}
      >
        {/* Top navigation */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-accent">
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="flex flex-1 items-center gap-4">
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>
          <div className="flex items-center gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <div className="text-sm font-medium">{currentUser?.email}</div>
                <div className="text-xs text-muted-foreground">{error ? "Demo Mode" : "Retail Investor"}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {currentUser?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                      {profileData.name.charAt(0).toUpperCase()}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="text-2xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary mb-2"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold mb-2">{profileData.name}</h2>
                    )}
                    <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {profileData.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {profileData.joinDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            className="bg-transparent border-b border-input focus:outline-none focus:border-primary"
                          />
                        ) : (
                          profileData.location
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Investment Experience</label>
                    {isEditing ? (
                      <select
                        value={profileData.investmentExperience}
                        onChange={(e) => handleInputChange("investmentExperience", e.target.value)}
                        className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    ) : (
                      <div className="mt-1">{profileData.investmentExperience}</div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Risk Tolerance</label>
                    {isEditing ? (
                      <select
                        value={profileData.riskTolerance}
                        onChange={(e) => handleInputChange("riskTolerance", e.target.value)}
                        className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="Conservative">Conservative</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Aggressive">Aggressive</option>
                      </select>
                    ) : (
                      <div className="mt-1">{profileData.riskTolerance}</div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Investment Goals</label>
                    {isEditing ? (
                      <select
                        value={profileData.investmentGoals}
                        onChange={(e) => handleInputChange("investmentGoals", e.target.value)}
                        className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="Short-term gains">Short-term gains</option>
                        <option value="Long-term growth">Long-term growth</option>
                        <option value="Income generation">Income generation</option>
                        <option value="Capital preservation">Capital preservation</option>
                      </select>
                    ) : (
                      <div className="mt-1">{profileData.investmentGoals}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Tell us about yourself and your investment interests..."
                  />
                ) : (
                  <p className="text-muted-foreground">{profileData.bio}</p>
                )}
              </div>
            </div>

            {/* Preferred Sectors */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Preferred Investment Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.preferredSectors.map((sector) => (
                    <span
                      key={sector}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
