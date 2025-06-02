
import { ImageUploadForm } from "@/components/dashboard/image-upload-form";
import { CandlestickChart, TrendingUp } from "lucide-react";
import { TradingViewMarketOverview } from "@/components/dashboard/tradingview-market-overview";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-2 md:py-8">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight sm:text-5xl">
          Market <span className="text-accent">Overview</span>
        </h1>
        <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          Global market insights powered by TradingView and AI chart analysis.
        </p>
      </header>
      
      <main className="space-y-10 md:space-y-16">
        <section id="chart-analysis-tool">
          <header className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold flex items-center justify-center">
              <CandlestickChart className="mr-3 h-8 w-8 text-primary"/>
              Chart Analysis <span className="text-accent">Tool</span>
            </h2>
            <p className="mt-2 text-md md:text-lg text-muted-foreground max-w-lg mx-auto">
              Upload your candlestick chart images to receive AI-powered insights.
            </p>
          </header>
          <ImageUploadForm />
        </section>

        <section id="global-market-data">
           <header className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold flex items-center justify-center">
                <TrendingUp className="mr-3 h-8 w-8 text-primary"/>
                Global <span className="text-accent">Markets</span>
            </h2>
            <p className="mt-2 text-md md:text-lg text-muted-foreground max-w-lg mx-auto">
                Live market data from TradingView.
            </p>
          </header>
          <TradingViewMarketOverview />
        </section>
      </main>
    </div>
  );
}
