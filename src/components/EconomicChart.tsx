// src/components/EconomicChart.tsx

import React, { useMemo } from 'react';
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
  ChartOptions,
  ChartData,
  TooltipItem,
  Scale,
  CoreScaleOptions,
  Tick
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Import your centralized types
import {
  EconomicDataPoint,
  EconomicChartProps, // Using the new EconomicChartProps
  InteractionMode,
} from '@/lib/types'; // Adjust path if '@/lib/types' is not configured as an alias

// Register necessary Chart.js components for this chart
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

// EconomicChart component now receives data as a prop
const EconomicChart: React.FC<EconomicChartProps> = ({ economicData, chartTitle = "Economic Indicator" }) => {

  const chartData: ChartData<'line', (number | null)[], string> = useMemo(() => {
    const labels = economicData.map(d => d.date) || [];
    const values = economicData.map(d => d.value) || [];

    return {
      labels,
      datasets: [
        {
          type: 'line',
          label: `${economicData[0]?.indicator || 'Value'} (${economicData[0]?.unit || ''})`,
          data: values,
          borderColor: '#10B981', // Tailwind green-500
          backgroundColor: 'rgba(16, 185, 129, 0.2)', // Light green fill
          borderWidth: 2,
          fill: true,
          tension: 0.2,
          pointRadius: 2,
          pointHoverRadius: 5,
          yAxisID: 'y-value',
        },
      ],
    };
  }, [economicData, chartTitle]); // Recompute if economicData changes

  const chartOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as InteractionMode,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: chartTitle,
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
          title: function(context: TooltipItem<'line'>[]) {
            return context[0]?.label;
          },
          label: function(context: TooltipItem<'line'>) {
            const label = context.dataset.label || '';
            return `${label}: ${context.raw as number}`; // Display raw value
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month', // Default unit, adjust based on your economic data frequency
          tooltipFormat: 'MMM yyyy',
          displayFormats: {
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
      'y-value': { // Use a specific ID for the value axis
        type: 'linear',
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: `${economicData[0]?.indicator || 'Value'} (${economicData[0]?.unit || ''})`,
          color: '#555',
        },
        ticks: {
          color: '#777',
          callback: function(this: Scale<CoreScaleOptions>, value: string | number, index: number, ticks: Tick[]) {
            return (value as number).toFixed(2) + (economicData[0]?.unit || '');
          },
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
    },
  }), [economicData, chartTitle]); // Recompute options if data or title changes

  if (!economicData || economicData.length === 0) {
    return <div className="p-4 text-center text-gray-500">No economic data provided to display.</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full font-inter mt-4">
      <h3 className="text-xl font-bold mb-3 text-gray-800">{chartTitle}</h3>
      <div className="relative h-72 md:h-96 w-full border border-gray-200 rounded">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default EconomicChart;
