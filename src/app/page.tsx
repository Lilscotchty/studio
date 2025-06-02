
import { MarketIndexCard, type MarketIndexProps } from "@/components/dashboard/market-index-card";
// Removed ImageUploadForm import
import { Globe, Activity, BarChartHorizontalBig } from "lucide-react";


const usMarketData: MarketIndexProps[] = [
  {
    id: "dow",
    iconType: "us",
    name: "Dow Jones Futures",
    value: "39,050.50",
    change: "+0.25%",
    changeType: "positive",
    dataAiHint: "market index chart"
  },
  {
    id: "sp500",
    iconType: "us",
    name: "S&P 500 Futures",
    value: "5,350.75",
    change: "-0.10%",
    changeType: "negative",
    dataAiHint: "stock ticker graph"
  },
  {
    id: "nasdaq",
    iconType: "us",
    name: "NASDAQ Futures",
    value: "18,700.25",
    change: "+0.05%",
    changeType: "positive",
    dataAiHint: "tech stocks chart"
  },
];

const europeanMarketData: MarketIndexProps[] = [
  {
    id: "ftse100",
    iconType: "uk",
    name: "FTSE 100",
    value: "8,230.00",
    change: "+0.15%",
    changeType: "positive",
    dataAiHint: "uk market graph"
  },
  {
    id: "dax",
    iconType: "eu",
    name: "DAX",
    value: "18,500.50",
    change: "-0.05%",
    changeType: "negative",
    dataAiHint: "german stocks chart"
  },
  {
    id: "cac40",
    iconType: "eu",
    name: "CAC 40",
    value: "7,980.20",
    change: "+0.30%",
    changeType: "positive",
    dataAiHint: "french market index"
  },
];

const asianMarketData: MarketIndexProps[] = [
  {
    id: "nikkei",
    iconType: "jp",
    name: "Nikkei 225",
    value: "38,500.00",
    change: "+0.50%",
    changeType: "positive",
    dataAiHint: "japan stocks chart"
  },
  {
    id: "hangseng",
    iconType: "hk",
    name: "Hang Seng",
    value: "18,050.75",
    change: "-0.20%",
    changeType: "negative",
    dataAiHint: "hong kong market"
  },
  {
    id: "csi300",
    iconType: "cn",
    name: "CSI 300",
    value: "3,570.60",
    change: "+0.10%",
    changeType: "positive",
    dataAiHint: "china stock market"
  },
];


export default function DashboardPage() {
  return (
    <div className="container mx-auto py-2 md:py-8">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight sm:text-5xl">
          Market <span className="text-accent">Overview</span>
        </h1>
        <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          Get a snapshot of global market indices.
        </p>
      </header>
      
      <main className="space-y-10 md:space-y-16">
        {/* Removed Chart Analysis Tool section */}

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center"><Activity className="mr-2 h-6 w-6 text-primary"/>US Markets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {usMarketData.map((data) => <MarketIndexCard key={data.id} {...data} />)}
          </div>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center"><Globe className="mr-2 h-6 w-6 text-primary"/>European Markets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {europeanMarketData.map((data) => <MarketIndexCard key={data.id} {...data} />)}
          </div>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center"><BarChartHorizontalBig className="mr-2 h-6 w-6 text-primary"/>Asian Markets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {asianMarketData.map((data) => <MarketIndexCard key={data.id} {...data} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
