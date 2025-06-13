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
  TrendingDown,
  Loader2,
  Filter,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
  sector: string
}

const marketData: MarketData[] = [
  {
    symbol: "MAYB",
    name: "Maybank",
    price: 9.15,
    change: 0.22,
    changePercent: 2.46,
    volume: "8.2M",
    marketCap: "RM 85.2B",
    sector: "Finance",
  },
  {
    symbol: "TNBR",
    name: "Tenaga Nasional",
    price: 10.86,
    change: 0.2,
    changePercent: 1.88,
    volume: "5.7M",
    marketCap: "RM 62.4B",
    sector: "Utilities",
  },
  {
    symbol: "PCHEM",
    name: "Petronas Chemicals",
    price: 6.75,
    change: -0.07,
    changePercent: -1.03,
    volume: "4.8M",
    marketCap: "RM 45.8B",
    sector: "Energy",
  },
  {
    symbol: "TOPG",
    name: "Top Glove",
    price: 1.25,
    change: 0.06,
    changePercent: 5.04,
    volume: "12.5M",
    marketCap: "RM 10.2B",
    sector: "Healthcare",
  },
  {
    symbol: "AXIA",
    name: "Axiata",
    price: 2.38,
    change: -0.04,
    changePercent: -1.65,
    volume: "9.1M",
    marketCap: "RM 17.8B",
    sector: "Telecommunications",
  },
  {
    symbol: "GENT",
    name: "Genting",
    price: 4.52,
    change: -0.1,
    changePercent: -2.16,
    volume: "6.3M",
    marketCap: "RM 21.5B",
    sector: "Consumer",
  },
  {
    symbol: "CIMB",
    name: "CIMB Group",
    price: 5.89,
    change: 0.15,
    changePercent: 2.61,
    volume: "7.4M",
    marketCap: "RM 55.7B",
    sector: "Finance",
  },
  {
    symbol: "HLFG",
    name: "Hong Leong Financial",
    price: 18.24,
    change: 0.36,
    changePercent: 2.01,
    volume: "2.1M",
    marketCap: "RM 39.2B",
    sector: "Finance",
  },
]

export default function MarketPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
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
    { name: "Dashboard", href: "/dashboard", icon: Home, current: false },
    { name: "Market Data", href: "/dashboard/market", icon: LineChart, current: true },
    { name: "Watchlist", href: "/dashboard/watchlist", icon: BarChart3, current: false },
    { name: "News & Insights", href: "/dashboard/news", icon: FileText, current: false },
    { name: "Document Analysis", href: "/dashboard/documents", icon: BookOpen, current: false },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: MessageSquare, current: false },
  ]

  const userNavigation = [
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const sectors = [
    "All",
    "Finance",
    "Technology",
    "Healthcare",
    "Energy",
    "Telecommunications",
    "Utilities",
    "Consumer",
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

  const filteredData = marketData
    .filter((stock) => {
      const matchesSearch =
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSector = selectedSector === "All" || stock.sector === selectedSector
      return matchesSearch && matchesSector
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof MarketData]
      let bValue: any = b[sortBy as keyof MarketData]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

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
            <h1 className="text-lg font-semibold">Market Data</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
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
          {/* Market Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium">KLCI</h3>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">1,542.53</div>
              <div className="flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                +0.78% (+12.03)
              </div>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Volume</h3>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">2.1B</div>
              <div className="flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                +15.2%
              </div>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Market Cap</h3>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">RM 1.8T</div>
              <div className="flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                +0.65%
              </div>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Active Stocks</h3>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">847</div>
              <div className="flex items-center text-sm text-muted-foreground">Trading today</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="rounded-lg border bg-background shadow-sm mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search stocks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-muted pl-8 h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="changePercent">Change %</option>
                    <option value="volume">Volume</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="h-10 px-3 rounded-md border border-input bg-background hover:bg-accent transition-colors"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Market Data Table */}
          <div className="rounded-lg border bg-background shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Stock Prices</h3>
                <span className="text-sm text-muted-foreground">
                  Showing {filteredData.length} of {marketData.length} stocks
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Symbol</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Name</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Price (RM)</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Change</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Volume</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Market Cap</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Sector</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((stock) => (
                      <tr key={stock.symbol} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{stock.symbol}</td>
                        <td className="py-3 px-2">{stock.name}</td>
                        <td className="py-3 px-2 text-right font-medium">{stock.price.toFixed(2)}</td>
                        <td className="py-3 px-2 text-right">
                          <div
                            className={`flex items-center justify-end ${
                              stock.change >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {stock.change >= 0 ? (
                              <TrendingUp className="mr-1 h-4 w-4" />
                            ) : (
                              <TrendingDown className="mr-1 h-4 w-4" />
                            )}
                            {stock.change >= 0 ? "+" : ""}
                            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right">{stock.volume}</td>
                        <td className="py-3 px-2">{stock.marketCap}</td>
                        <td className="py-3 px-2">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors text-foreground">
                            {stock.sector}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                            Add to Watchlist
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
