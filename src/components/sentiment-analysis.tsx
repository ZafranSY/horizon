"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Chart from "chart.js/auto"

export function SentimentAnalysis() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")

      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Positive", "Neutral", "Negative"],
            datasets: [
              {
                data: [45, 35, 20],
                backgroundColor: ["rgba(34, 197, 94, 0.7)", "rgba(59, 130, 246, 0.7)", "rgba(239, 68, 68, 0.7)"],
                borderColor: ["rgba(34, 197, 94, 1)", "rgba(59, 130, 246, 1)", "rgba(239, 68, 68, 1)"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
            cutout: "60%",
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Market Sentiment</CardTitle>
          <CardDescription>Social media sentiment analysis</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Details
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] flex items-center justify-center">
          <canvas ref={chartRef} />
        </div>
        <div className="mt-4 text-sm text-center text-gray-500">
          Based on analysis of 5,000+ social media posts in the last 24 hours
        </div>
      </CardContent>
    </Card>
  )
}
