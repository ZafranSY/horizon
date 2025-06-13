import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: "Federal Reserve Holds Interest Rates Steady",
      summary: "The Federal Reserve announced today that it will maintain current interest rates at 5.25-5.50% following the latest FOMC meeting.",
      source: "Reuters",
      time: "2 hours ago",
      category: "Monetary Policy"
    },
    {
      id: 2,
      title: "Tech Stocks Rally on AI Optimism",
      summary: "Major technology companies saw significant gains today as investors remain bullish on artificial intelligence prospects.",
      source: "Bloomberg",
      time: "4 hours ago",
      category: "Technology"
    },
    {
      id: 3,
      title: "Oil Prices Surge Amid Middle East Tensions",
      summary: "Crude oil futures jumped 3% in early trading as geopolitical tensions in the Middle East continue to escalate.",
      source: "CNBC",
      time: "6 hours ago",
      category: "Commodities"
    },
    {
      id: 4,
      title: "Unemployment Rate Falls to 3.7%",
      summary: "The latest jobs report shows stronger than expected employment growth with unemployment dropping to 3.7%.",
      source: "Financial Times",
      time: "1 day ago",
      category: "Economics"
    },
    {
      id: 5,
      title: "Crypto Market Sees Mixed Results",
      summary: "Bitcoin holds steady above $42,000 while altcoins show varied performance in today's trading session.",
      source: "CoinDesk",
      time: "1 day ago",
      category: "Cryptocurrency"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market News</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest financial news and market insights
        </p>
      </div>

      <div className="grid gap-4">
        {newsItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{item.category}</Badge>
                <span className="text-sm text-muted-foreground">{item.time}</span>
              </div>
              <CardTitle className="text-xl leading-tight">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{item.summary}</p>
              <p className="text-sm font-medium text-blue-600">{item.source}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Bullish</div>
              <p className="text-sm text-muted-foreground">Overall Market</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">Neutral</div>
              <p className="text-sm text-muted-foreground">Tech Sector</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">Bearish</div>
              <p className="text-sm text-muted-foreground">Energy Sector</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}