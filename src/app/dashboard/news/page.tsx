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
  Clock,
  ExternalLink,
  Filter,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  time: string
  category: string
  sentiment: "positive" | "neutral" | "negative"
  url: string
  imageUrl?: string
}

const newsData: NewsItem[] = [
  {
    id: "1",
    title: "Bank Negara Malaysia maintains OPR at 3.00% amid global economic uncertainties",
    summary:
      "The central bank decided to keep the overnight policy rate unchanged, citing balanced growth prospects and manageable inflation expectations.",
    source: "The Edge Markets",
    time: "2 hours ago",
    category: "Economy",
    sentiment: "neutral",
    url: "#",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "Top Glove reports strong Q2 earnings, exceeds analyst expectations by 15%",
    summary:
      "The world's largest glove manufacturer posted revenue of RM1.2 billion, driven by sustained demand from healthcare sector.",
    source: "The Star",
    time: "4 hours ago",
    category: "Earnings",
    sentiment: "positive",
    url: "#",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "Petronas faces challenges amid global oil price volatility and supply chain disruptions",
    summary:
      "The national oil company is implementing cost optimization measures while maintaining production targets for 2024.",
    source: "New Straits Times",
    time: "6 hours ago",
    category: "Energy",
    sentiment: "negative",
    url: "#",
  },
  {
    id: "4",
    title: "Malaysia's tech sector shows resilience despite global slowdown, AI adoption accelerates",
    summary:
      "Local technology companies are investing heavily in artificial intelligence and digital transformation initiatives.",
    source: "Bernama",
    time: "8 hours ago",
    category: "Technology",
    sentiment: "positive",
    url: "#",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    title: "KLCI reaches new monthly high as foreign investors return to Malaysian equities",
    summary:
      "The benchmark index gained 0.78% to close at 1,542.53 points, with banking and plantation stocks leading the rally.",
    source: "The Edge Markets",
    time: "10 hours ago",
    category: "Markets",
    sentiment: "positive",
    url: "#",
  },
  {
    id: "6",
    title: "Genting Malaysia announces RM2 billion expansion plan for Resorts World Genting",
    summary:
      "The integrated resort operator plans to add new attractions and upgrade existing facilities over the next three years.",
    source: "The Star",
    time: "12 hours ago",
    category: "Corporate",
    sentiment: "positive",
    url: "#",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "7",
    title: "Ringgit strengthens against USD as commodity prices recover",
    summary:
      "The Malaysian currency gained 0.5% against the US dollar, supported by higher palm oil and crude oil prices.",
    source: "Reuters",
    time: "14 hours ago",
    category: "Currency",
    sentiment: "positive",
    url: "#",
  },
  {
    id: "8",
    title: "Maybank raises dividend payout ratio to 60% following strong financial performance",
    summary:
      "Malaysia's largest bank by assets announced an increase in dividend payout ratio from 55% to 60% for FY2024.",
    source: "The Edge Markets",
    time: "1 day ago",
    category: "Banking",
    sentiment: "positive",
    url: "#",
  },
]

export default function NewsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSentiment, setSelectedSentiment] = useState("All")
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
    { name: "Market Data", href: "/dashboard/market", icon: LineChart, current: false },
    { name: "Watchlist", href: "/dashboard/watchlist", icon: BarChart3, current: false },
    { name: "News & Insights", href: "/dashboard/news", icon: FileText, current: true },
    { name: "Document Analysis", href: "/dashboard/documents", icon: BookOpen, current: false },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: MessageSquare, current: false },
  ]

  const userNavigation = [
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const categories = [
    "All",
    "Economy",
    "Earnings",
    "Energy",
    "Technology",
    "Markets",
    "Corporate",
    "Currency",
    "Banking",
  ]
  const sentiments = ["All", "positive", "neutral", "negative"]

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

  const filteredNews = newsData.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.source.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || news.category === selectedCategory
    const matchesSentiment = selectedSentiment === "All" || news.sentiment === selectedSentiment
    return matchesSearch && matchesCategory && matchesSentiment
  })

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200"
      case "negative":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
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
            <h1 className="text-lg font-semibold">News & Insights</h1>
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
          {/* Filters */}
          <div className="rounded-lg border bg-background shadow-sm mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search news..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-muted pl-8 h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedSentiment}
                    onChange={(e) => setSelectedSentiment(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {sentiments.map((sentiment) => (
                      <option key={sentiment} value={sentiment}>
                        {sentiment === "All"
                          ? "All Sentiments"
                          : sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {filteredNews.length} of {newsData.length} articles
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* News Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                className="rounded-lg border bg-background shadow-sm hover:shadow-md transition-shadow"
              >
                {news.imageUrl && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={news.imageUrl || "/placeholder.svg"}
                      alt={news.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors text-foreground">
                      {news.category}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getSentimentColor(
                        news.sentiment,
                      )}`}
                    >
                      {news.sentiment}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary cursor-pointer">{news.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{news.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {news.time}
                    </div>
                    <div className="text-xs text-muted-foreground">{news.source}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <button className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
                      Read more
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No news found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
