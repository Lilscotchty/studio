
import { LiveMarketDataDisplay } from "@/components/live-analysis/live-market-data-display";

export default function LiveAnalysisPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">
          Live Market <span className="text-accent">Analysis (Prototype)</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Simulate live market data and get AI-powered ICT conceptual analysis. This is a prototype to demonstrate potential functionality.
        </p>
      </header>

      <main>
        <LiveMarketDataDisplay />
      </main>
    </div>
  );
}
