// src/components/EconomicChart.tsx
"use client";

import React, { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
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

// Register Chart.js components once globally
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

interface EconomicDataPoint {
  date: string;
  value: number;
  indicator: string;
  country?: string;
  title?: string;
  unit?: string;
}

interface EconomicChartProps {
  data: EconomicDataPoint[];
  title?: string;
}

const EconomicChart: React.FC<EconomicChartProps> = ({ data, title }) => {
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

    const chartTitle = title || `${data[0]?.title || data[0]?.indicator || 'Economic'} Data for ${data[0]?.country || ''}`;
    
    const chartData = {
      labels: data.map(item => new Date(item.date)),
      datasets: [
        {
          label: `${data[0]?.indicator || 'Value'} (${data[0]?.unit || ''})`,
          data: data.map(item => item.value),
          borderColor: 'hsl(var(--destructive))',
          backgroundColor: 'hsl(var(--destructive) / 0.1)',
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
          text: chartTitle,
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
            unit: 'month' as const,
            tooltipFormat: 'MMM DD, YYYY', // More readable format
            displayFormats: {
              month: 'MMM YYYY',
              quarter: 'qqq YYYY',
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
            text: data[0]?.unit || 'Value',
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
  }, [data, title]); // Re-run effect if data or title changes

  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground">No economic data available to display.</div>;
  }

  return (
    <div className="bg-background border rounded-lg p-4">
      <div className="h-64">
        <canvas ref={chartRef}></canvas> {/* The canvas element */}
      </div>
    </div>
  );
};

export default EconomicChart;