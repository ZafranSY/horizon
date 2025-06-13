// lib/api-service.ts

interface AnalysisResponse {
    summary: string
    imageUrl?: string
    audioUrl?: string
    error?: string
    details?: string
  }
  
  interface ApiError {
    error: string
    details?: string
    status?: number
  }
  
  class BackendApiService {
    private baseUrl: string
    private timeout: number
  
    constructor(baseUrl: string = 'http://localhost:3001', timeout: number = 30000) {
      this.baseUrl = baseUrl
      this.timeout = timeout
    }
  
    async analyzeQuery(query: string): Promise<AnalysisResponse> {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)
  
      try {
        const response = await fetch(`${this.baseUrl}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        })
  
        clearTimeout(timeoutId)
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new ApiError(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`,
            errorData.details,
            response.status
          )
        }
  
        const data: AnalysisResponse = await response.json()
  
        if (data.error) {
          throw new ApiError(data.error, data.details)
        }
  
        return data
      } catch (error) {
        clearTimeout(timeoutId)
  
        if (error instanceof ApiError) {
          throw error
        }
  
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new ApiError(
            'Cannot connect to Horizon backend server',
            'Make sure the backend server is running on http://localhost:3001. You can start it with: cd backend && npm start'
          )
        }
  
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new ApiError(
            'Request timeout',
            'The analysis took too long to complete. Please try a simpler query or check your connection.'
          )
        }
  
        throw new ApiError(
          'Unexpected error occurred',
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    }
  
    async checkHealth(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
      try {
        const response = await fetch(`${this.baseUrl}/`, {
          method: 'GET',
          timeout: 5000,
        })
  
        if (response.ok) {
          const data = await response.json()
          return {
            status: 'healthy',
            message: data.message || 'Backend is running'
          }
        } else {
          return {
            status: 'unhealthy',
            message: `Backend returned ${response.status}`
          }
        }
      } catch (error) {
        return {
          status: 'unhealthy',
          message: 'Cannot connect to backend server'
        }
      }
    }
  
    // Utility method to suggest example queries based on backend capabilities
    getExampleQueries(): string[] {
      return [
        // News queries
        "Latest news about Tenaga Nasional",
        "What's happening with Malaysian banking sector?",
        "Show me news about semiconductor companies",
        
        // Stock queries
        "Get AAPL stock price and analysis",
        "How is Tesla (TSLA) performing today?",
        "Show me Microsoft stock data",
        
        // Bursa Malaysia queries
        "Bursa announcements for TNB",
        "Latest Petronas company updates",
        "Show me Genting announcements",
        
        // Economic data queries
        "What's the current Malaysian inflation rate?",
        "Show me Malaysia's GDP growth",
        "Current Bank Negara interest rate",
        
        // Social sentiment queries
        "Social sentiment for Tesla stock",
        "What are people saying about Malaysian banks?",
        "Sentiment analysis for tech stocks",
        
        // Combined analysis queries
        "Analyze TNB stock with latest news and Bursa announcements",
        "Give me a complete analysis of Apple including news and social sentiment",
        "Show me Malaysian economic indicators and their impact on banking stocks"
      ]
    }
  
    // Utility method to categorize queries for better UX
    categorizeQuery(query: string): 'news' | 'stock' | 'bursa' | 'economic' | 'sentiment' | 'general' {
      const lowerQuery = query.toLowerCase()
      
      if (lowerQuery.includes('news') || lowerQuery.includes('article')) {
        return 'news'
      }
      
      if (lowerQuery.includes('stock') || lowerQuery.includes('price') || /\b[A-Z]{1,5}\b/.test(query)) {
        return 'stock'
      }
      
      if (lowerQuery.includes('bursa') || lowerQuery.includes('announcement') || lowerQuery.includes('tnb') || lowerQuery.includes('petronas')) {
        return 'bursa'
      }
      
      if (lowerQuery.includes('inflation') || lowerQuery.includes('gdp') || lowerQuery.includes('interest rate') || lowerQuery.includes('economic')) {
        return 'economic'
      }
      
      if (lowerQuery.includes('sentiment') || lowerQuery.includes('social') || lowerQuery.includes('opinion')) {
        return 'sentiment'
      }
      
      return 'general'
    }
  
    // Format error messages for better user experience
    formatError(error: ApiError): { title: string; message: string; suggestions: string[] } {
      const suggestions: string[] = []
  
      if (error.error.includes('connect')) {
        suggestions.push('Make sure the backend server is running: cd backend && npm start')
        suggestions.push('Check if port 3001 is available')
        suggestions.push('Verify your .env file has all required API keys')
      }
  
      if (error.error.includes('timeout')) {
        suggestions.push('Try a simpler query')
        suggestions.push('Check your internet connection')
        suggestions.push('The backend might be processing heavy requests')
      }
  
      if (error.error.includes('API key')) {
        suggestions.push('Check your .env file for missing API keys')
        suggestions.push('Verify API keys are valid and have sufficient quota')
      }
  
      return {
        title: error.error,
        message: error.details || 'An unexpected error occurred',
        suggestions
      }
    }
  }
  
  // Create a singleton instance
  export const backendApi = new BackendApiService()
  
  // Export types for use in components
  export type { AnalysisResponse, ApiError }
  
  // Custom error class
  class ApiError extends Error {
    constructor(
      message: string,
      public details?: string,
      public status?: number
    ) {
      super(message)
      this.name = 'ApiError'
    }
  }