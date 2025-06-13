import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NewsItem {
  id: string
  title: string
  source: string
  time: string
  category: string
  sentiment: "positive" | "neutral" | "negative"
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Bank Negara Malaysia maintains OPR at 3.00%",
    source: "The Edge Markets",
    time: "2 hours ago",
    category: "Economy",
    sentiment: "neutral",
  },
  {
    id: "2",
    title: "Top Glove reports strong Q2 earnings, exceeds analyst expectations",
    source: "The Star",
    time: "4 hours ago",
    category: "Earnings",
    sentiment: "positive",
  },
  {
    id: "3",
    title: "Petronas faces challenges amid global oil price volatility",
    source: "New Straits Times",
    time: "6 hours ago",
    category: "Energy",
    sentiment: "negative",
  },
  {
    id: "4",
    title: "Malaysia's tech sector shows resilience despite global slowdown",
    source: "Bernama",
    time: "8 hours ago",
    category: "Technology",
    sentiment: "positive",
  },
]

export function NewsHighlights() {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>News Highlights</CardTitle>
          <CardDescription>Latest market news and updates</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((item) => (
            <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <Badge
                  variant={
                    item.sentiment === "positive"
                      ? "success"
                      : item.sentiment === "negative"
                        ? "destructive"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {item.category}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="mr-1 h-3 w-3" />
                  {item.time}
                </div>
              </div>
              <h3 className="font-medium mb-1 hover:text-primary cursor-pointer">{item.title}</h3>
              <div className="text-xs text-gray-500">{item.source}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
