// src/components/StockChart.tsx
"use client"; // This makes it a Client Component

import React, { useRef, useEffect } from "react";
import {
  Chart as ChartJS, // Import ChartJS directly
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Still keep this import here!

// Register Chart.js components once globally (ensure these are only registered once across your app)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjustedClose: number;
  volume: number;
}

interface StockChartProps {
  data: StockDataPoint[];
  title?: string;
  ticker?: string; // Pass ticker for a more accurate title
}

const StockChart: React.FC<StockChartProps> = ({ data, title, ticker }) => {
  const chartRef = useRef<HTMLCanvasElement>(null); // Ref to the canvas element
  const chartInstanceRef = useRef<ChartJS | null>(null); // Ref to store the Chart.js instance

  useEffect(() => {
    if (!chartRef.current) {
      return; // Canvas element not ready
    }

    if (!data || data.length === 0) {
      // If no data, destroy any existing chart and show message
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    const chartData = {
      labels: data.map(item => new Date(item.date)), // Use Date objects for time scale
      datasets: [
        {
          label: 'Adjusted Close Price',
          data: data.map(item => item.adjustedClose),
          borderColor: 'hsl(var(--primary))',
          backgroundColor: 'hsl(var(--primary) / 0.1)',
          tension: 0.1,
          fill: true,
          pointRadius: 2,
          hoverRadius: 5,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: title || `${ticker || 'Stock'} Price History`, // Use passed ticker or default title
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
        }
      },
      scales: {
        x: {
          type: 'time' as const,
          time: {
            unit: 'day' as const, // Default unit, adjust based on data density
            tooltipFormat: 'MMM dd, YYYY', // Format for tooltips
            displayFormats: {
              day: 'MMM dd',
              month: 'MMM YYYY',
              year: 'YYYY',
            },
          },
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Price',
          },
        },
      },
    };

    // If a chart instance already exists, update its data
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data = chartData;
      chartInstanceRef.current.options = options;
      chartInstanceRef.current.update();
    } else {
      // Create a new chart instance if one doesn't exist
      chartInstanceRef.current = new ChartJS(chartRef.current, {
        type: 'line', // You can change type to 'bar', etc.
        data: chartData,
        options: options,
      });
    }

    // Cleanup function: destroy chart instance on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, title, ticker]); // Re-run effect if data, title, or ticker changes

  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground">No stock data available to display.</div>;
  }

  return (
    <div className="bg-background border rounded-lg p-4">
      <div className="h-64">
        <canvas ref={chartRef}></canvas> {/* The canvas element */}
      </div>
    </div>
  );
};

export default StockChart;