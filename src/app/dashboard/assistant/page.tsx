"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
  ArrowUp,
  Bot,
  Loader2,
  RefreshCw,
  Volume2,
  Image as ImageIcon,
  Download,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  imageUrl?: string
  audioUrl?: string
  timestamp: Date
}

interface AnalysisResponse {
  summary: string
  imageUrl?: string
  audioUrl?: string
  error?: string
}

export default function AssistantPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { user, loading, error } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your Horizon AI financial assistant. I can help you with Malaysian and US financial markets, including real-time news, stock data, Bursa announcements, and economic indicators. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [audioElements, setAudioElements] = useState<{[key: string]: HTMLAudioElement}>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
    { name: "AI Assistant", href: "/dashboard/assistant", icon: MessageSquare, current: true },
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
      router.push("/")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      // Call your backend API
      const response = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: currentInput }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: AnalysisResponse = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.summary,
        imageUrl: data.imageUrl,
        audioUrl: data.audioUrl,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Preload audio if available
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl)
        setAudioElements(prev => ({
          ...prev,
          [assistantMessage.id]: audio
        }))
      }

    } catch (error) {
      console.error("Error generating response:", error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the backend server is running on http://localhost:3001 and try again.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your Horizon AI financial assistant. I can help you with Malaysian and US financial markets, including real-time news, stock data, Bursa announcements, and economic indicators. What would you like to know?",
        timestamp: new Date(),
      },
    ])
    setAudioElements({})
  }

  const playAudio = (messageId: string) => {
    const audio = audioElements[messageId]
    if (audio) {
      if (audio.paused) {
        audio.play()
      } else {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }

  const downloadImage = (imageUrl: string, messageId: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `horizon-ai-analysis-${messageId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAudio = (audioUrl: string, messageId: string) => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `horizon-ai-audio-${messageId}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
            <h1 className="text-lg font-semibold">AI Assistant</h1>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Connected to Horizon Backend
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              New Conversation
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

        {/* Chat content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === "assistant"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                      
                      {/* Media attachments for assistant messages */}
                      {message.role === "assistant" && (message.imageUrl || message.audioUrl) && (
                        <div className="flex flex-col gap-3">
                          {/* Generated Image */}
                          {message.imageUrl && (
                            <div className="bg-background border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                  <ImageIcon className="h-3 w-3" />
                                  Generated Infographic
                                </span>
                                <button
                                  onClick={() => downloadImage(message.imageUrl!, message.id)}
                                  className="p-1 rounded hover:bg-accent"
                                  title="Download image"
                                >
                                  <Download className="h-3 w-3" />
                                </button>
                              </div>
                              <img
                                src={message.imageUrl}
                                alt="Generated financial infographic"
                                className="w-full max-w-md rounded border"
                              />
                            </div>
                          )}
                          
                          {/* Generated Audio */}
                          {message.audioUrl && (
                            <div className="bg-background border rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                  <Volume2 className="h-3 w-3" />
                                  Audio Summary
                                </span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => playAudio(message.id)}
                                    className="p-1 rounded hover:bg-accent"
                                    title="Play/Pause audio"
                                  >
                                    <Volume2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => downloadAudio(message.audioUrl!, message.id)}
                                    className="p-1 rounded hover:bg-accent"
                                    title="Download audio"
                                  >
                                    <Download className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Analyzing markets and generating insights...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input form */}
          <div className="border-t p-4 bg-background">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about stocks, news, Bursa announcements, economic data..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 h-12 rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                </button>
              </form>
              
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "Latest TNB news",
                  "AAPL stock price",
                  "Malaysian inflation rate",
                  "Bursa announcements for PETRONAS",
                  "Social sentiment for tech stocks"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    disabled={isLoading}
                    className="px-3 py-1 text-xs bg-muted hover:bg-accent rounded-full transition-colors disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}