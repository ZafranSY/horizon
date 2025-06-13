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
  Bell,
  Shield,
  Palette,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function SettingsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { user, loading, error } = useAuth()

  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    marketAlerts: true,
    newsUpdates: true,
    priceAlerts: true,
    weeklyReports: false,

    // Privacy Settings
    profileVisibility: "private",
    dataSharing: false,
    analyticsTracking: true,
    marketingEmails: false,

    // Display Settings
    theme: "light",
    language: "en",
    currency: "MYR",
    timezone: "Asia/Kuala_Lumpur",
    dateFormat: "DD/MM/YYYY",

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true,

    // Trading Settings
    defaultWatchlist: "My Stocks",
    autoRefresh: true,
    refreshInterval: "30",
    showAdvancedCharts: false,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, current: false },
    { name: "Market Data", href: "/dashboard/market", icon: LineChart, current: false },
    { name: "Watchlist", href: "/dashboard/watchlist", icon: BarChart3, current: false },
    { name: "News & Insights", href: "/dashboard/news", icon: FileText, current: false },
    { name: "Document Analysis", href: "/dashboard/documents", icon: BookOpen, current: false },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: MessageSquare, current: false },
  ]

  const userNavigation = [
    { name: "Profile", href: "/dashboard/profile", icon: User, current: false },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, current: true },
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

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handlePasswordChange = (key: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match")
      return
    }
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setIsSaving(false)
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
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveSettings}
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
            {/* Notification Settings */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Notification Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Push Notifications</label>
                      <p className="text-xs text-muted-foreground">Receive push notifications on your device</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange("pushNotifications", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Market Alerts</label>
                      <p className="text-xs text-muted-foreground">Get notified about significant market movements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.marketAlerts}
                        onChange={(e) => handleSettingChange("marketAlerts", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Price Alerts</label>
                      <p className="text-xs text-muted-foreground">Notifications for watchlist price changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.priceAlerts}
                        onChange={(e) => handleSettingChange("priceAlerts", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Privacy & Security</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Profile Visibility</label>
                      <p className="text-xs text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Two-Factor Authentication</label>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange("twoFactorAuth", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Login Alerts</label>
                      <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.loginAlerts}
                        onChange={(e) => handleSettingChange("loginAlerts", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Display Settings</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Theme</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange("theme", e.target.value)}
                      className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange("language", e.target.value)}
                      className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="en">English</option>
                      <option value="ms">Bahasa Malaysia</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange("currency", e.target.value)}
                      className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="MYR">Malaysian Ringgit (MYR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="SGD">Singapore Dollar (SGD)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange("dateFormat", e.target.value)}
                      className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Change Password</h3>
                </div>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={
                      isSaving ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
