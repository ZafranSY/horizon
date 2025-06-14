// src/lib/types.ts

export interface StockDataPoint {
    timestamp: number;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    price: number;
  }
  
  export interface PriceRange {
    min: number;
    max: number;
    current: number;
    change: number;
    changePercent: number;
  }
  
  export interface VolumeRange {
    min: number;
    max: number;
    average: number;
  }
  
  export interface TimeRange {
    start: string;
    end: string;
  }
  
  export interface StockMetadata {
    totalDataPoints: number;
    priceRange: PriceRange;
    volumeRange: VolumeRange;
    timeRange: TimeRange;
  }
  
  export interface HistoricalStockData {
    symbol: string;
    data: StockDataPoint[];
    metadata: StockMetadata;
  }
  
  export interface ApiResponse<T> {
      success: boolean;
      data: T;
      error?: string;
  }
  
  export interface StockChartProps {
    initialTicker?: string;
  }
  
  export type InteractionMode = 'index' | 'dataset' | 'point' | 'nearest' | 'x' | 'y';