import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  ChartData,
  ChartDataset,
  TooltipItem, // Already imported
  Scale, // Import Scale for callback context typing
  CoreScaleOptions, // Import CoreScaleOptions for callback context typing
  Tick // Import Tick for the third callback parameter
} from 'chart.js';
import {
  StockDataPoint,
  HistoricalStockData,
  ApiResponse,
  StockChartProps,
  InteractionMode,
} from '@/lib/types';

import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Define the backend API base URL
const API_BASE_URL = 'http://localhost:3000/api/charts';

const StockChart: React.FC<StockChartProps> = ({ initialTicker = 'AAPL' }) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [dataType, setDataType] = useState<keyof StockDataPoint>('close');
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'>('1M');
  const [showVolume, setShowVolume] = useState(true);
  const [stockData, setStockData] = useState<HistoricalStockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTicker, setCurrentTicker] = useState(initialTicker);
  const [inputValue, setInputValue] = useState(initialTicker);

  const getTimespanAndDates = useCallback((range: string) => {
    const today = new Date();
    let fromDate = '';
    let toDate = today.toISOString().split('T')[0];

    switch (range) {
      case '1D':
        fromDate = today.toISOString().split('T')[0];
        return { timespan: 'minute', fromDate, toDate };
      case '1W':
        today.setDate(today.getDate() - 7);
        fromDate = today.toISOString().split('T')[0];
        return { timespan: 'day', fromDate, toDate };
      case '1M':
        today.setMonth(today.getMonth() - 1);
        fromDate = today.toISOString().split('T')[0];
        return { timespan: 'day', fromDate, toDate };
      case '3M':
        today.setMonth(today.getMonth() - 3);
        fromDate = today.toISOString().split('T')[0];
        return { timespan: 'day', fromDate, toDate };
      case '1Y':
        today.setFullYear(today.getFullYear() - 1);
        fromDate = today.toISOString().split('T')[0];
        return { timespan: 'week', fromDate, toDate };
      case '5Y':
        today.setFullYear(today.getFullYear() - 5);
        fromDate = today.toISOString().split('T')[0];
        return { timespan: 'month', fromDate, toDate };
      default:
        today.setFullYear(today.getFullYear() - 5);
        fromDate = today.toISOString().split('T')[0];
        return { timespan: 'month', fromDate, toDate };
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!currentTicker) return;

    setLoading(true);
    setError(null);
    try {
      const { timespan, fromDate, toDate } = getTimespanAndDates(timeRange);
      const response = await axios.get<ApiResponse<HistoricalStockData>>(
        `${API_BASE_URL}/stock/${currentTicker}`,
        {
          params: {
            timespan,
            from: fromDate,
            to: toDate,
            limit: 100
          },
        }
      );

      if (response.data.success) {
        setStockData(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch stock data');
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('An error occurred while fetching stock data.');
    } finally {
      setLoading(false);
    }
  }, [currentTicker, timeRange, getTimespanAndDates]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== '' && inputValue.trim().toUpperCase() !== currentTicker) {
      setCurrentTicker(inputValue.trim().toUpperCase());
    }
  };

  // Helper function to create datasets
  const createDatasets = useCallback((data: StockDataPoint[], currentChartType: 'line' | 'bar', currentDataType: keyof StockDataPoint, showVolume: boolean) => {
    const mainDatasetColor = '#3B82F6'; // Tailwind blue-500
    const volumeDatasetColor = '#9CA3AF'; // Tailwind gray-400

    const datasets: ChartDataset<'line' | 'bar', (number | null)[]>[] = [
      {
        type: currentChartType,
        label: `${currentTicker} ${currentDataType.charAt(0).toUpperCase() + currentDataType.slice(1)} Price`,
        data: data.map(d => d[currentDataType] as number) || [],
        borderColor: mainDatasetColor,
        backgroundColor: mainDatasetColor,
        borderWidth: 1.5,
        fill: false,
        tension: 0.1,
        pointRadius: 1,
        pointHoverRadius: 4,
        yAxisID: 'y'
      },
    ];

    if (showVolume) {
      datasets.push({
        type: 'bar',
        label: 'Volume',
        data: data.map(d => d.volume) || [],
        backgroundColor: volumeDatasetColor,
        borderColor: volumeDatasetColor,
        borderWidth: 1,
        yAxisID: 'volume',
      });
    }
    return datasets;
  }, [currentTicker]);

  // Calculate moving averages
  const calculateSMA = useCallback((data: StockDataPoint[], window: number) => {
    if (!data || data.length < window) return [];
    const sma = [];
    for (let i = 0; i < data.length; i++) {
      if (i < window - 1) {
        sma.push(null);
      } else {
        const sum = data.slice(i - window + 1, i + 1).reduce((acc, current) => acc + current.close, 0);
        sma.push(sum / window);
      }
    }
    return sma;
  }, []);

  const sma20 = useMemo(() => stockData ? calculateSMA(stockData.data, 20) : [], [stockData, calculateSMA]);
  const sma50 = useMemo(() => stockData ? calculateSMA(stockData.data, 50) : [], [stockData, calculateSMA]);


  // Prepare data for the LINE chart specifically
  const lineChartData: ChartData<'line', (number | null)[], string> = useMemo(() => {
    const labels = stockData?.data.map(d => d.date) || [];
    const datasets = createDatasets(stockData?.data || [], 'line', dataType, showVolume);

    // Add SMA datasets only if chartType is 'line' (they are line type anyway)
    if (chartType === 'line') {
      datasets.push(
        {
          type: 'line',
          label: 'SMA 20',
          data: sma20,
          borderColor: '#EF4444', // Red-500
          backgroundColor: '#EF4444',
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
          tension: 0.1,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'SMA 50',
          data: sma50,
          borderColor: '#EAB308', // Yellow-500
          backgroundColor: '#EAB308',
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
          tension: 0.1,
          yAxisID: 'y',
        }
      );
    }

    return { labels, datasets: datasets as ChartDataset<'line', (number | null)[]>[] };
  }, [stockData, dataType, showVolume, chartType, createDatasets, sma20, sma50]);


  // Prepare data for the BAR chart specifically
  const barChartData: ChartData<'bar', (number | null)[], string> = useMemo(() => {
    const labels = stockData?.data.map(d => d.date) || [];
    const datasets = createDatasets(stockData?.data || [], 'bar', dataType, showVolume);
    return { labels, datasets: datasets as ChartDataset<'bar', (number | null)[]>[] };
  }, [stockData, dataType, showVolume, createDatasets]);


  const chartOptions: ChartOptions<'line' | 'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as InteractionMode,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `${currentTicker} Stock Chart - ${timeRange}`,
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333',
      },
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#555',
        },
      },
      tooltip: {
        mode: 'index' as InteractionMode,
        intersect: false,
        callbacks: {
          title: function(context: TooltipItem<'line' | 'bar'>[]) {
            return context[0]?.label;
          },
          label: function(context: TooltipItem<'line' | 'bar'>) {
            const label = context.dataset.label || '';
            // Safely check for context.raw being a number before calling toLocaleString
            if (context.dataset.yAxisID === 'volume') {
              return `${label}: ${(context.raw as number)?.toLocaleString()}`;
            }
            return `${label}: $${(context.raw as number)?.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeRange === '1D' ? 'hour' : (timeRange === '1W' ? 'day' : (timeRange === '1M' || timeRange === '3M' ? 'week' : (timeRange === '1Y' ? 'month' : 'year'))),
          tooltipFormat: timeRange === '1D' ? 'MMM d, HH:mm' : 'MMM d, yyyy', // Ensure consistent tooltip format
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy',
            year: 'yyyy',
          },
        },
        title: {
          display: true,
          text: 'Date',
          color: '#555',
        },
        ticks: {
          color: '#777',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Price ($)',
          color: '#555',
        },
        ticks: {
          color: '#777',
          // FIX: Updated signature to match Chart.js definition
          callback: function(this: Scale<CoreScaleOptions>, value: string | number, index: number, ticks: Tick[]) {
            return `$${(value as number).toFixed(2)}`;
          },
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
      volume: {
        type: 'linear',
        display: showVolume,
        position: 'right' as const,
        title: {
          display: showVolume,
          text: 'Volume',
          color: '#555',
        },
        ticks: {
          color: '#777',
          // FIX: Updated signature to match Chart.js definition
          callback: function(this: Scale<CoreScaleOptions>, value: string | number, index: number, ticks: Tick[]) {
            return (value as number).toLocaleString();
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }), [currentTicker, timeRange, chartType, showVolume, dataType, stockData]);


  if (loading) {
    return <div className="p-4 text-center">Loading chart data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!stockData || stockData.data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available for {currentTicker} in the selected time range.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Stock Chart: {currentTicker}</h2>

      <form onSubmit={handleTickerSubmit} className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          placeholder="Enter Stock Ticker (e.g., AAPL)"
          className="p-2 border border-gray-300 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          View Stock
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {['1D', '1W', '1M', '3M', '1Y', '5Y', 'all'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range as typeof timeRange)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === range
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4 justify-center">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="chartType"
            value="line"
            checked={chartType === 'line'}
            onChange={() => setChartType('line')}
            className="form-radio text-blue-600"
          />
          <span>Line Chart</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="chartType"
            value="bar"
            checked={chartType === 'bar'}
            onChange={() => setChartType('bar')}
            className="form-radio text-blue-600"
          />
          <span>Bar Chart</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showVolume}
            onChange={() => setShowVolume(!showVolume)}
            className="form-checkbox text-blue-600"
          />
          <span>Show Volume</span>
        </label>
      </div>

      <div className="relative h-96">
        {chartType === 'line' ? (
          <Line data={lineChartData} options={chartOptions as ChartOptions<'line'>} />
        ) : (
          <Bar data={barChartData} options={chartOptions as ChartOptions<'bar'>} />
        )}
      </div>

      {stockData && stockData.metadata && (
        <div className="mt-6 text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Price Overview</h3>
            <p><strong>Current Price:</strong> ${stockData.metadata.priceRange.current?.toFixed(2)}</p>
            <p><strong>Change:</strong> ${stockData.metadata.priceRange.change?.toFixed(2)}</p>
            <p><strong>Change Percent:</strong> {stockData.metadata.priceRange.changePercent?.toFixed(2)}%</p>
            <p><strong>Min Price ({timeRange}):</strong> ${stockData.metadata.priceRange.min?.toFixed(2)}</p>
            <p><strong>Max Price ({timeRange}):</strong> ${stockData.metadata.priceRange.max?.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Volume Overview</h3>
            <p><strong>Min Volume:</strong> {stockData.metadata.volumeRange.min?.toLocaleString()}</p>
            <p><strong>Max Volume:</strong> {stockData.metadata.volumeRange.max?.toLocaleString()}</p>
            <p><strong>Avg Volume:</strong> {stockData.metadata.volumeRange.average?.toLocaleString()}</p>
            <p><strong>Data Points:</strong> {stockData.metadata.totalDataPoints}</p>
            <p><strong>Date Range:</strong> {stockData.metadata.timeRange.start} to {stockData.metadata.timeRange.end}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;