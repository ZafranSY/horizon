// src/components/StockChart.tsx

import React, { useMemo, useCallback, useState } from 'react';
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
  TooltipItem,
  Scale,
  CoreScaleOptions,
  Tick
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Import your centralized types
import {
  StockDataPoint,
  HistoricalStockData,
  StockChartProps, // Using the updated StockChartProps
  InteractionMode,
} from '@/lib/types'; // Adjust path if '@/lib/types' is not configured as an alias

// Register necessary Chart.js components
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

// StockChart component now receives data as a prop
const StockChart: React.FC<StockChartProps> = ({ historicalData }) => {
  // Use state to manage chart type, data type, time range (if needed internally for display logic)
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [dataType, setDataType] = useState<keyof StockDataPoint>('close');
  const [showVolume, setShowVolume] = useState(true);

  // Derive ticker and time range from the received historicalData
  const currentTicker = historicalData.symbol;
  // You might need to infer timeRange from historicalData.metadata.timeRange if you want to display it,
  // but the selection controls are assumed to be in page.tsx or a higher component now.
  const displayTimeRange = `${historicalData.metadata.timeRange.start} to ${historicalData.metadata.timeRange.end}`;


  // Helper function to calculate Simple Moving Average (SMA)
  const calculateSMA = useCallback((data: StockDataPoint[], window: number): (number | null)[] => {
    if (!data || data.length < window) return Array(data.length).fill(null);
    const sma: (number | null)[] = [];
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

  // Memoized SMA calculations based on the received historicalData
  const sma20 = useMemo(() => calculateSMA(historicalData.data, 20), [historicalData.data, calculateSMA]);
  const sma50 = useMemo(() => calculateSMA(historicalData.data, 50), [historicalData.data, calculateSMA]);

  // Helper function to generate datasets for Chart.js
  const createChartDatasets = useCallback((data: StockDataPoint[], currentChartType: 'line' | 'bar', currentDataType: keyof StockDataPoint, showVolume: boolean, sma20Data: (number | null)[], sma50Data: (number | null)[]) => {
    const mainDatasetColor = '#3B82F6'; // Tailwind blue-500
    const volumeDatasetColor = '#9CA3AF'; // Tailwind gray-400
    const sma20Color = '#EF4444'; // Tailwind red-500
    const sma50Color = '#EAB308'; // Tailwind yellow-500

    const datasets: ChartDataset<'line' | 'bar', (number | null)[]>[] = [
      {
        type: currentChartType,
        label: `${currentTicker} ${currentDataType.charAt(0).toUpperCase() + currentDataType.slice(1)} Price`,
        data: data.map(d => d[currentDataType] as number),
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
        data: data.map(d => d.volume),
        backgroundColor: volumeDatasetColor,
        borderColor: volumeDatasetColor,
        borderWidth: 1,
        yAxisID: 'volume',
      });
    }

    if (currentChartType === 'line') {
      datasets.push(
        {
          type: 'line',
          label: 'SMA 20',
          data: sma20Data,
          borderColor: sma20Color,
          backgroundColor: sma20Color,
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
          tension: 0.1,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'SMA 50',
          data: sma50Data,
          borderColor: sma50Color,
          backgroundColor: sma50Color,
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
          tension: 0.1,
          yAxisID: 'y',
        }
      );
    }

    return datasets;
  }, [currentTicker]);

  // Memoized data for the Line chart specifically
  const lineChartData: ChartData<'line', (number | null)[], string> = useMemo(() => {
    const labels = historicalData.data.map(d => d.date) || [];
    const datasets = createChartDatasets(historicalData.data, 'line', dataType, showVolume, sma20, sma50);
    return { labels, datasets: datasets as ChartDataset<'line', (number | null)[]>[] };
  }, [historicalData, dataType, showVolume, createChartDatasets, sma20, sma50]);

  // Memoized data for the Bar chart specifically
  const barChartData: ChartData<'bar', (number | null)[], string> = useMemo(() => {
    const labels = historicalData.data.map(d => d.date) || [];
    const datasets = createChartDatasets(historicalData.data, 'bar', dataType, showVolume, sma20, sma50);
    return { labels, datasets: datasets as ChartDataset<'bar', (number | null)[]>[] };
  }, [historicalData, dataType, showVolume, createChartDatasets, sma20, sma50]);

  // Memoized chart options for both chart types
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
        text: `${currentTicker} Stock Chart - ${displayTimeRange}`,
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
            if (context.dataset.yAxisID === 'volume') {
              return `${label}: ${(context.raw as number)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
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
          // Unit should ideally be derived from the actual date range of `historicalData`
          // For now, we'll use a reasonable default or adjust based on data density.
          // This part might need further refinement based on the exact density of data provided by backend for different time ranges.
          unit: 'day', // Default unit, adjust dynamically if needed
          tooltipFormat: 'MMM d, yyyy', // Default tooltip format
          displayFormats: {
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
          callback: function(this: Scale<CoreScaleOptions>, value: string | number, index: number, ticks: Tick[]) {
            return (value as number).toLocaleString();
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }), [currentTicker, displayTimeRange, chartType, showVolume, dataType]); // Dependencies for useMemo

  if (!historicalData || historicalData.data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No stock data provided to display.</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full font-inter">
      <h3 className="text-xl font-bold mb-3 text-gray-800">Stock Chart: {currentTicker}</h3>

      {/* Chart controls for type and volume */}
      <div className="flex flex-wrap gap-4 mb-4 justify-center items-center text-sm">
        <label className="flex items-center space-x-1 cursor-pointer text-gray-700">
          <input
            type="radio"
            name="chartType"
            value="line"
            checked={chartType === 'line'}
            onChange={() => setChartType('line')}
            className="form-radio text-blue-600 h-3.5 w-3.5 accent-blue-600"
          />
          <span>Line Chart</span>
        </label>
        <label className="flex items-center space-x-1 cursor-pointer text-gray-700">
          <input
            type="radio"
            name="chartType"
            value="bar"
            checked={chartType === 'bar'}
            onChange={() => setChartType('bar')}
            className="form-radio text-blue-600 h-3.5 w-3.5 accent-blue-600"
          />
          <span>Bar Chart</span>
        </label>
        <label className="flex items-center space-x-1 cursor-pointer text-gray-700">
          <input
            type="checkbox"
            checked={showVolume}
            onChange={() => setShowVolume(!showVolume)}
            className="form-checkbox text-blue-600 h-3.5 w-3.5 rounded accent-blue-600"
          />
          <span>Show Volume</span>
        </label>
      </div>

      {/* Chart Canvas */}
      <div className="relative h-72 md:h-96 w-full mb-4 border border-gray-200 rounded">
        {chartType === 'line' ? (
          <Line data={lineChartData} options={chartOptions as ChartOptions<'line'>} />
        ) : (
          <Bar data={barChartData} options={chartOptions as ChartOptions<'bar'>} />
        )}
      </div>

      {/* Stock Metadata Display */}
      {historicalData.metadata && (
        <div className="mt-4 text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Current Price:</strong> ${historicalData.metadata.priceRange.current?.toFixed(2)}</p>
            <p><strong>Change:</strong> <span className={historicalData.metadata.priceRange.changePercent > 0 ? 'text-green-600' : 'text-red-600'}>${historicalData.metadata.priceRange.change?.toFixed(2)}</span></p>
            <p><strong>Change %:</strong> <span className={historicalData.metadata.priceRange.changePercent > 0 ? 'text-green-600' : 'text-red-600'}>{historicalData.metadata.priceRange.changePercent?.toFixed(2)}%</span></p>
          </div>
          <div>
            <p><strong>Avg Volume:</strong> {historicalData.metadata.volumeRange.average?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p><strong>Date Range:</strong> {historicalData.metadata.timeRange.start} to {historicalData.metadata.timeRange.end}</p>
            <p><strong>Total Data Points:</strong> {historicalData.metadata.totalDataPoints}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;
