
import { ImageUploadForm } from "@/components/dashboard/image-upload-form";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl lg:text-6xl">
          MarketVision <span className="text-accent">AI</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Leverage cutting-edge AI to analyze candlestick charts and predict market movements. Upload a chart image to get started.
        </p>
      </header>
      
      <main>
        <ImageUploadForm />
      </main>
    </div>
  );
}
