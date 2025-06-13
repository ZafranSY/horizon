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
  Search,
  Settings,
  TrendingUp,
  User,
  X,
  ArrowUpRight,
  Info,
  TrendingDown,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function Dashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { user, loading, error } = useAuth()

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
    { name: "Dashboard", href: "/dashboard", icon: Home, current: true },
    { name: "Market Data", href: "/dashboard/market", icon: LineChart, current: false },
    { name: "Watchlist", href: "/dashboard/watchlist", icon: BarChart3, current: false },
    { name: "News & Insights", href: "/dashboard/news", icon: FileText, current: false },
    { name: "Document Analysis", href: "/dashboard/documents", icon: BookOpen, current: false },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: MessageSquare, current: false },
  ]

  const userNavigation = [
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
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
      // Fallback: redirect anyway
      router.push("/")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    console.warn("Auth error, using demo mode:", error)
  }

  // Use demo user if no authenticated user or if there's an error
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
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-foreground hover:bg-accent hover:text-accent-foreground"
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
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search stocks, news, documents..."
                className="w-full bg-muted pl-8 h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
              <TrendingUp className="mr-2 h-4 w-4" />
              Market Summary
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
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <Info className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    Running in demo mode. Firebase authentication is not fully configured.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors text-foreground">
                Last updated: 14 Jun 2024, 1:15 AM
              </span>
              <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Market Update</h3>
                <div className="mt-2 text-sm text-blue-700">
                  Bursa Malaysia closed higher today, with the KLCI gaining 0.78% to close at 1,542.53 points.
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium">KLCI</h3>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">1,542.53</div>
              <div className="flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                +0.78%
              </div>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium">USD/MYR</h3>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">4.6850</div>
              <div className="flex items-center text-sm text-red-500">
                <TrendingDown className="mr-1 h-4 w-4" />
                -0.12%
              </div>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Crude Oil</h3>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">$82.45</div>
              <div className="flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                +1.23%
              </div>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Market Sentiment</h3>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">Bullish</div>
              <div className="flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                Improving
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="flex flex-row items-center justify-between p-6 pb-2">
                <div>
                  <h3 className="text-lg font-semibold">Market Overview</h3>
                  <p className="text-sm text-muted-foreground">KLCI performance over time</p>
                </div>
                <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Details
                </button>
              </div>
              <div className="p-6">
                <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Chart visualization would go here</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-background shadow-sm">
              <div className="flex flex-row items-center justify-between p-6 pb-2">
                <div>
                  <h3 className="text-lg font-semibold">Top Movers</h3>
                  <p className="text-sm text-muted-foreground">Best and worst performing stocks today</p>
                </div>
                <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View All
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Gainers</h4>
                  <div className="space-y-2">
                    {[
                      { symbol: "TOPG", name: "Top Glove", price: 1.25, change: 5.04 },
                      { symbol: "MAYT", name: "Maybank", price: 9.15, change: 2.46 },
                      { symbol: "TNBR", name: "Tenaga", price: 10.86, change: 1.88 },
                    ].map((stock) => (
                      <div
                        key={stock.symbol}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                      >
                        <div>
                          <div className="font-medium">{stock.name}</div>
                          <div className="text-xs text-muted-foreground">{stock.symbol}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">RM {stock.price.toFixed(2)}</div>
                          <div className="flex items-center text-xs text-green-500">
                            <TrendingUp className="mr-1 h-3 w-3" />+{stock.change.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="flex flex-row items-center justify-between p-6 pb-2">
                <div>
                  <h3 className="text-lg font-semibold">News Highlights</h3>
                  <p className="text-sm text-muted-foreground">Latest market news and updates</p>
                </div>
                <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View All
                </button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  {
                    title: "Bank Negara Malaysia maintains OPR at 3.00%",
                    source: "The Edge Markets",
                    time: "2 hours ago",
                    category: "Economy",
                  },
                  {
                    title: "Top Glove reports strong Q2 earnings",
                    source: "The Star",
                    time: "4 hours ago",
                    category: "Earnings",
                  },
                  {
                    title: "Malaysia's tech sector shows resilience",
                    source: "Bernama",
                    time: "8 hours ago",
                    category: "Technology",
                  },
                ].map((item, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors text-foreground">
                        {item.category}
                      </span>
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                    </div>
                    <h4 className="font-medium mb-1 hover:text-primary cursor-pointer">{item.title}</h4>
                    <div className="text-xs text-muted-foreground">{item.source}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-background shadow-sm">
              <div className="flex flex-row items-center justify-between p-6 pb-2">
                <div>
                  <h3 className="text-lg font-semibold">Market Sentiment</h3>
                  <p className="text-sm text-muted-foreground">Social media sentiment analysis</p>
                </div>
                <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Details
                </button>
              </div>
              <div className="p-6">
                <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Sentiment chart would go here</p>
                </div>
                <div className="mt-4 text-sm text-center text-muted-foreground">
                  Based on analysis of 5,000+ social media posts in the last 24 hours
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
