import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MarketPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
        <p className="text-muted-foreground">
          Real-time market data and analysis
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              S&P 500
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,580.34</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              NASDAQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,239.88</div>
            <p className="text-xs text-muted-foreground">
              +1.8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dow Jones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36,245.50</div>
            <p className="text-xs text-muted-foreground">
              +0.9% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              VIX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.42</div>
            <p className="text-xs text-muted-foreground">
              -5.2% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Gainers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>AAPL</span>
                <span className="text-green-600">+3.2%</span>
              </div>
              <div className="flex justify-between">
                <span>MSFT</span>
                <span className="text-green-600">+2.8%</span>
              </div>
              <div className="flex justify-between">
                <span>GOOGL</span>
                <span className="text-green-600">+2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Losers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>TSLA</span>
                <span className="text-red-600">-2.4%</span>
              </div>
              <div className="flex justify-between">
                <span>NVDA</span>
                <span className="text-red-600">-1.8%</span>
              </div>
              <div className="flex justify-between">
                <span>META</span>
                <span className="text-red-600">-1.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}