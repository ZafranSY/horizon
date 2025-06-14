// src/app/dashboard/assistant/page.tsx
"use client" // This directive marks the component as a Client Component

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic' // Import dynamic for client-side rendering of charts
import axios from 'axios'; // Import axios for backend API calls

// Import Lucide React icons
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
  ImageIcon,
  Download,
  Upload,
  FileImage,
} from "lucide-react"

// Import custom hooks and types from your lib directory
import { useAuth } from "@/hooks/use-auth" // Assuming this hook handles Firebase auth
import {
  Message, // Updated Message interface
  HistoricalStockData, // Using the full HistoricalStockData interface
  EconomicDataPoint,
  AnalysisResponseData, // Renamed from AnalysisResponse to be clearer it's the data part
  OCRResponse
} from '@/lib/types'; // Import your centralized types (double-check this path if you moved files)

// Dynamically import your chart components
// ssr: false is CRUCIAL here to prevent server-side rendering errors for browser-dependent modules like Chart.js
const StockChart = dynamic(() => import('@/components/StockChart'), { ssr: false });
const EconomicChart = dynamic(() => import('@/components/EconomicChart'), { ssr: false });

// Define backend API URLs - NOW BOTH POINT TO THE SAME CONSOLIDATED BACKEND ON PORT 3001
const BACKEND_BASE_URL = 'http://localhost:3001'; // CORRECTED: This is the base URL for your backend

// Specific endpoints derived from the consolidated base URL
const AI_ANALYZE_URL = `${BACKEND_BASE_URL}/analyze`;
const OCR_URL = `${BACKEND_BASE_URL}/ocr`;
// Stock chart data is now under /api/charts on the same consolidated backend
const CHART_DATA_URL_BASE = `${BACKEND_BASE_URL}/api/charts`;


export default function AssistantPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { user, loading, error: authError } = useAuth() // Renamed 'error' to 'authError' to avoid conflict
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your Horizon AI financial assistant. I can help you with Malaysian and US financial markets, including real-time news, stock data, Bursa announcements, and economic indicators. You can also upload images for OCR text extraction. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false) // For AI response generation
  const [isOCRLoading, setIsOCRLoading] = useState(false) // For OCR processing
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement }>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to the bottom of the chat window on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Effect to handle mobile responsiveness and sidebar state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false) // Close sidebar on mobile by default
      }
    }

    checkMobile() // Initial check
    window.addEventListener("resize", checkMobile) // Add resize listener
    return () => window.removeEventListener("resize", checkMobile) // Cleanup
  }, [])

  // Navigation links for the sidebar
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, current: false },
    { name: "Market Data", href: "/dashboard/market", icon: LineChart, current: false },
    { name: "Watchlist", href: "/dashboard/watchlist", icon: BarChart3, current: false },
    { name: "News & Insights", href: "/dashboard/news", icon: FileText, current: false },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: MessageSquare, current: true },
  ]

  // User profile and settings links
  const userNavigation = [
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      if (typeof window !== "undefined") {
        const { auth } = await import("@/lib/firebase") // Dynamic import for Firebase auth
        const { signOut } = await import("firebase/auth")

        if (auth) {
          await signOut(auth)
        }
      }
      router.push("/") // Redirect to home after sign out
    } catch (error) {
      console.error("Error signing out:", error)
      router.push("/")
    }
  }

  // Handle user submitting a chat query to the AI backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return // Prevent empty or duplicate submissions

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage]) // Add user message to chat
    const currentInput = input
    setInput("") // Clear input field
    setIsLoading(true) // Set loading state for AI response

    try {
      // API call to your backend's AI analysis endpoint
      const response = await fetch(AI_ANALYZE_URL, { // Use the consolidated AI_ANALYZE_URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: currentInput }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Parse the response data, expecting AnalysisResponseData structure
      const data: AnalysisResponseData = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Create assistant message with AI's summary and any attached data
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.summary,
        imageUrl: data.imageUrl,
        audioUrl: data.audioUrl,
        historicalStockData: data.historicalStockData, // Pass the full HistoricalStockData object
        historicalEconomicData: data.historicalEconomicData, // Pass the array of EconomicDataPoint
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage]) // Add assistant message to chat

      // If an audio URL is provided, prepare it for playback
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl)
        setAudioElements(prev => ({
          ...prev,
          [assistantMessage.id]: audio
        }))
      }

    } catch (error) {
      console.error("Error generating response:", error)

      // Display an error message in the chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the backend AI server is running on ${BACKEND_BASE_URL} and try again.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false) // Reset AI loading state
    }
  }

  // Handle image file upload for OCR
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsOCRLoading(true) // Set OCR loading state

    try {
      const formData = new FormData()
      formData.append('image', file)

      // API call to your backend's OCR endpoint
      const response = await fetch(OCR_URL, { // Use the consolidated OCR_URL
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`OCR failed: ${response.status}`)
      }

      const data: OCRResponse = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Add user message indicating image upload
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Uploaded image for OCR analysis: ${file.name}`,
        timestamp: new Date(),
      }

      // Add assistant message with extracted text and a follow-up question
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've extracted the following text from your image:\n\n"${data.extractedText}"\n\nWould you like me to analyze this content for financial insights?`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setInput(data.extractedText) // Pre-fill input with extracted text for easy follow-up

    } catch (error) {
      console.error("Error processing OCR:", error)

      // Display OCR error message in chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I couldn't extract text from the image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsOCRLoading(false) // Reset OCR loading state
      if (fileInputRef.current) {
        fileInputRef.current.value = '' // Clear the file input
      }
    }
  }

  // Handle resetting the conversation
  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your Horizon AI financial assistant. I can help you with Malaysian and US financial markets, including real-time news, stock data, Bursa announcements, and economic indicators. You can also upload images for OCR text extraction. What would you like to know?",
        timestamp: new Date(),
      },
    ])
    setAudioElements({}) // Clear any playing audio
  }

  // Play/pause audio for a given message
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

  // Download image attachment
  const downloadImage = (imageUrl: string, messageId: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `horizon-ai-analysis-${messageId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Download audio attachment
  const downloadAudio = (audioUrl: string, messageId: string) => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `horizon-ai-audio-${messageId}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Show loading spinner for authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  const currentUser = user || { email: "demo@example.com", displayName: "Demo User" }

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "shadow-lg" : ""}`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Horizon AI</span>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-600" />
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
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left"
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
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="flex flex-1 items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Connected to Horizon Backend ({BACKEND_BASE_URL.split('//')[1]})</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
            >
              <RefreshCw className="mr-2 h-4 w-4 text-gray-700" />
              New Conversation
            </button>
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-800">{currentUser?.email}</div>
                <div className="text-xs text-gray-500">{authError ? "Demo Mode" : "Retail Investor"}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
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
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>

                      {/* Charts and Media attachments for assistant messages */}
                      {message.role === "assistant" && (message.historicalStockData || message.historicalEconomicData || message.imageUrl || message.audioUrl) && (
                        <div className="flex flex-col gap-3 w-full">
                          {/* Stock Chart: Pass the historicalData prop */}
                          {message.historicalStockData && message.historicalStockData.data && message.historicalStockData.data.length > 0 && (
                            <StockChart historicalData={message.historicalStockData} />
                          )}

                          {/* Economic Chart: Pass the economicData prop */}
                          {message.historicalEconomicData && message.historicalEconomicData.length > 0 && (
                            // You might want to dynamically set chartTitle based on the economic data
                            <EconomicChart economicData={message.historicalEconomicData} chartTitle={message.historicalEconomicData[0]?.indicator || 'Economic Data'} />
                          )}

                          {/* Generated Image */}
                          {message.imageUrl && (
                            <div className="bg-white border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                  <ImageIcon className="h-3 w-3" />
                                  Generated Infographic
                                </span>
                                <button
                                  onClick={() => downloadImage(message.imageUrl!, message.id)}
                                  className="p-1 rounded hover:bg-gray-100"
                                  title="Download image"
                                >
                                  <Download className="h-3 w-3 text-gray-600" />
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
                            <div className="bg-white border rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                  <Volume2 className="h-3 w-3" />
                                  Audio Summary
                                </span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => playAudio(message.id)}
                                    className="p-1 rounded hover:bg-gray-100"
                                    title="Play/Pause audio"
                                  >
                                    <Volume2 className="h-3 w-3 text-gray-600" />
                                  </button>
                                  <button
                                    onClick={() => downloadAudio(message.audioUrl!, message.id)}
                                    className="p-1 rounded hover:bg-gray-100"
                                    title="Download audio"
                                  >
                                    <Download className="h-3 w-3 text-gray-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator for AI response */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-700" />
                      <span className="text-sm text-gray-600">Analyzing markets and generating insights...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* OCR Loading indicator */}
              {isOCRLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-700" />
                      <span className="text-sm text-gray-600">Extracting text from image...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input form */}
          <div className="border-t p-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about stocks, news, Bursa announcements, economic data..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading || isOCRLoading}
                  className="flex-1 h-12 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-gray-900"
                />

                {/* Hidden file input for OCR */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* OCR Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isOCRLoading}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload image for OCR"
                >
                  {isOCRLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileImage className="h-5 w-5" />}
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || isOCRLoading || !input.trim()}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={isLoading || isOCRLoading}
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-full transition-colors disabled:opacity-50 text-gray-700"
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
