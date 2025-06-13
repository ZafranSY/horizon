import Link from "next/link"
import { ArrowRight, BarChart3, BookOpen, LineChart, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Horizon AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Intelligent Financial Market Insights for Malaysian Investors
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Horizon AI aggregates data from news outlets, Bursa Malaysia, social media, and economic indicators to
                  provide actionable intelligence for retail investors and finance students.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/demo">
                    <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                      View Demo
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Market Dashboard</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">KLCI</span>
                          <div className="flex items-center gap-1 text-green-500">
                            <TrendingUp className="h-4 w-4" />
                            <span>1,542.53 (+0.78%)</span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full w-[65%]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Top Sectors</span>
                          <span className="text-sm text-muted-foreground">24h Change</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Technology</span>
                            <span className="text-green-500">+1.2%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Healthcare</span>
                            <span className="text-green-500">+0.8%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Finance</span>
                            <span className="text-red-500">-0.3%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -z-10 top-6 left-6 w-full h-full rounded-lg bg-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Horizon AI empowers you with the tools and insights needed to make informed investment decisions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Market Intelligence</h3>
                <p className="text-center text-muted-foreground">
                  Real-time data aggregation from news, Bursa Malaysia, social media, and economic indicators.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Sentiment Analysis</h3>
                <p className="text-center text-muted-foreground">
                  Analyze social media sentiment for specific stocks or sectors to gauge public opinion.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Document Analysis</h3>
                <p className="text-center text-muted-foreground">
                  Upload financial documents and interact with them using AI-powered Q&A functionality.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold">Horizon AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Horizon AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
