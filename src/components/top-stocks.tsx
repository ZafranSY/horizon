import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  volume: string
}

const topGainers: Stock[] = [
  { symbol: "TOPG", name: "Top Glove", price: 1.25, change: 5.04, volume: "12.5M" },
  { symbol: "MAYT", name: "Maybank", price: 9.15, change: 2.46, volume: "8.2M" },
  { symbol: "TNBR", name: "Tenaga", price: 10.86, change: 1.88, volume: "5.7M" },
]

const topLosers: Stock[] = [
  { symbol: "GENT", name: "Genting", price: 4.52, change: -2.16, volume: "6.3M" },
  { symbol: "AXIA", name: "Axiata", price: 2.38, change: -1.65, volume: "9.1M" },
  { symbol: "PCHEM", name: "Petronas Chemicals", price: 6.75, change: -1.03, volume: "4.8M" },
]

export function TopStocks() {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Movers</CardTitle>
          <CardDescription>Best and worst performing stocks today</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Top Gainers</h3>
            <div className="space-y-2">
              {topGainers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium text-xs">
                      {stock.symbol}
                    </div>
                    <div>
                      <div className="font-medium">{stock.name}</div>
                      <div className="text-xs text-gray-500">Vol: {stock.volume}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">RM {stock.price.toFixed(2)}</div>
                    <div className="flex items-center text-xs text-green-500">
                      <TrendingUp className="mr-1 h-3 w-3" />+{stock.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Top Losers</h3>
            <div className="space-y-2">
              {topLosers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium text-xs">
                      {stock.symbol}
                    </div>
                    <div>
                      <div className="font-medium">{stock.name}</div>
                      <div className="text-xs text-gray-500">Vol: {stock.volume}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">RM {stock.price.toFixed(2)}</div>
                    <div className="flex items-center text-xs text-red-500">
                      <TrendingDown className="mr-1 h-3 w-3" />
                      {stock.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
