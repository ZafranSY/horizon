"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, TrendingDown, TrendingUp, X, Bell } from "lucide-react"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  sector: string
}

const watchlistStocks: Stock[] = [
  {
    symbol: "MAYB",
    name: "Maybank",
    price: 9.15,
    change: 0.22,
    changePercent: 2.46,
    volume: "8.2M",
    sector: "Finance",
  },
  {
    symbol: "TNBR",
    name: "Tenaga Nasional",
    price: 10.86,
    change: 0.2,
    changePercent: 1.88,
    volume: "5.7M",
    sector: "Utilities",
  },
  {
    symbol: "PCHEM",
    name: "Petronas Chemicals",
    price: 6.75,
    change: -0.07,
    changePercent: -1.03,
    volume: "4.8M",
    sector: "Energy",
  },
  {
    symbol: "TOPG",
    name: "Top Glove",
    price: 1.25,
    change: 0.06,
    changePercent: 5.04,
    volume: "12.5M",
    sector: "Healthcare",
  },
  {
    symbol: "AXIA",
    name: "Axiata",
    price: 2.38,
    change: -0.04,
    changePercent: -1.65,
    volume: "9.1M",
    sector: "Telecommunications",
  },
]

const sectors = [
  { name: "Finance", stocks: 3 },
  { name: "Technology", stocks: 2 },
  { name: "Healthcare", stocks: 1 },
]

export default function WatchlistPage() {
  const [stocks, setStocks] = useState<Stock[]>(watchlistStocks)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStock, setNewStock] = useState({
    symbol: "",
    name: "",
    sector: "",
  })

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddStock = () => {
    // In a real app, you would validate and fetch stock data from an API
    const mockNewStock: Stock = {
      ...newStock,
      price: 5.67,
      change: 0.12,
      changePercent: 2.16,
      volume: "3.4M",
    }

    setStocks([...stocks, mockNewStock])
    setIsAddDialogOpen(false)
    setNewStock({ symbol: "", name: "", sector: "" })
  }

  const handleRemoveStock = (symbol: string) => {
    setStocks(stocks.filter((stock) => stock.symbol !== symbol))
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Watchlist</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add to Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Stock to Watchlist</DialogTitle>
              <DialogDescription>Enter the details of the stock you want to add to your watchlist.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="symbol" className="text-right">
                  Symbol
                </Label>
                <Input
                  id="symbol"
                  placeholder="e.g., MAYB"
                  className="col-span-3"
                  value={newStock.symbol}
                  onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Maybank"
                  className="col-span-3"
                  value={newStock.name}
                  onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sector" className="text-right">
                  Sector
                </Label>
                <Select value={newStock.sector} onValueChange={(value) => setNewStock({ ...newStock, sector: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Consumer">Consumer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStock}>Add Stock</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="stocks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="stocks">
          <Card>
            <CardHeader>
              <CardTitle>Watched Stocks</CardTitle>
              <CardDescription>Track the performance of your favorite stocks</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search stocks..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-gray-50 dark:bg-gray-800">
                  <div className="col-span-3">Symbol / Name</div>
                  <div className="col-span-2 text-right">Price (RM)</div>
                  <div className="col-span-2 text-right">Change</div>
                  <div className="col-span-2">Volume</div>
                  <div className="col-span-2">Sector</div>
                  <div className="col-span-1"></div>
                </div>
                {filteredStocks.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No stocks found matching your search.</div>
                ) : (
                  filteredStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="grid grid-cols-12 gap-2 p-4 border-b last:border-0 items-center hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="col-span-3">
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-gray-500">{stock.name}</div>
                      </div>
                      <div className="col-span-2 text-right font-medium">{stock.price.toFixed(2)}</div>
                      <div className="col-span-2 text-right">
                        <div
                          className={`flex items-center justify-end ${
                            stock.change >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {stock.change >= 0 ? (
                            <TrendingUp className="mr-1 h-4 w-4" />
                          ) : (
                            <TrendingDown className="mr-1 h-4 w-4" />
                          )}
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                      <div className="col-span-2">{stock.volume}</div>
                      <div className="col-span-2">
                        <Badge variant="outline">{stock.sector}</Badge>
                      </div>
                      <div className="col-span-1 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveStock(stock.symbol)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors">
          <Card>
            <CardHeader>
              <CardTitle>Watched Sectors</CardTitle>
              <CardDescription>Track the performance of different market sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-gray-50 dark:bg-gray-800">
                  <div className="col-span-4">Sector</div>
                  <div className="col-span-3">Stocks</div>
                  <div className="col-span-3">Performance (1W)</div>
                  <div className="col-span-2"></div>
                </div>
                {sectors.map((sector) => (
                  <div
                    key={sector.name}
                    className="grid grid-cols-12 gap-2 p-4 border-b last:border-0 items-center hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="col-span-4">
                      <div className="font-medium">{sector.name}</div>
                    </div>
                    <div className="col-span-3">{sector.stocks} stocks</div>
                    <div className="col-span-3">
                      <div className="flex items-center text-green-500">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        +2.3%
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Price Alerts</CardTitle>
              <CardDescription>Set up alerts for price movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No alerts set</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create price alerts to get notified about significant price movements
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
