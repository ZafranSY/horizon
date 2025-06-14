// src/lib/types.ts

// Defines the structure for a single data point in stock history
export interface StockDataPoint {
    timestamp: number; // Unix timestamp for charting
    date: string;      // Date string (e.g., "YYYY-MM-DD")
    open: number;      // Opening price
    high: number;      // High price for the period
    low: number;       // Low price for the period
    close: number;     // Closing price
    volume: number;    // Trading volume
    price: number;     // Alias for 'close' price, often used for line charts
  }
  
  // Defines the range of prices within the dataset
  export interface PriceRange {
    min: number;
    max: number;
    current: number;
    change: number;
    changePercent: number;
  }
  
  // Defines the range and average of trading volume
  export interface VolumeRange {
    min: number;
    max: number;
    average: number;
  }
  
  // Defines the start and end dates of the data range
  export interface TimeRange {
    start: string;
    end: string;
  }
  
  // Aggregated metadata about the stock data
  export interface StockMetadata {
    totalDataPoints: number;
    priceRange: PriceRange;
    volumeRange: VolumeRange;
    timeRange: TimeRange;
  }
  
  // The complete structure of historical stock data returned from the backend
  export interface HistoricalStockData {
    symbol: string;
    data: StockDataPoint[];
    metadata: StockMetadata;
  }
  
  // Defines a single data point for economic indicators
  export interface EconomicDataPoint {
    date: string;    // Date for the economic data point
    value: number;   // Value of the indicator
    indicator: string; // Name of the economic indicator (e.g., "Inflation Rate", "GDP Growth")
    country?: string; // Optional: Country associated with the indicator
    title?: string;   // Optional: A more descriptive title
    unit?: string;    // Optional: Unit of measurement (e.g., "%", "billion USD")
  }
  
  // Generic API response structure
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
  }
  
  // Props for the StockChart component (now purely for display)
  export interface StockChartProps {
    historicalData: HistoricalStockData; // Receives pre-fetched historical stock data
    // Removed initialTicker, as it's no longer responsible for fetching
  }
  
  // Props for the EconomicChart component
  export interface EconomicChartProps {
    economicData: EconomicDataPoint[]; // Receives pre-fetched economic data
    chartTitle?: string; // Optional title for the economic chart
  }
  
  // Specific types for Chart.js interaction mode to ensure type safety
  export type InteractionMode = 'index' | 'dataset' | 'point' | 'nearest' | 'x' | 'y';
  
  // Interface for the AI analysis response (from backend)
  // This mirrors the structure of the 'data' field in the AnalysisResponse you receive from your backend API
  export interface AnalysisResponseData {
    summary: string;
    imageUrl?: string;
    audioUrl?: string;
    // Note: Your backend might return raw `HistoricalStockData` and `EconomicDataPoint[]`
    // We'll update the Message interface in page.tsx to reflect this directly.
    historicalStockData?: HistoricalStockData; // Expecting the full HistoricalStockData object
    historicalEconomicData?: EconomicDataPoint[]; // Expecting an array of EconomicDataPoint
    error?: string;
  }
  
  // Interface for OCR response
  export interface OCRResponse {
    extractedText: string;
    error?: string;
  }
  
  // Interface for chat messages
  export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    imageUrl?: string;
    audioUrl?: string;
    historicalStockData?: HistoricalStockData; // Use the full interface
    historicalEconomicData?: EconomicDataPoint[]; // Use the specific interface
    timestamp: Date;
  }
  