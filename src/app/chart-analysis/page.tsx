
import { ImageUploadForm } from "@/components/dashboard/image-upload-form";
import { CandlestickChart } from "lucide-react";

export default function ChartAnalysisPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl flex items-center justify-center">
          <CandlestickChart className="mr-3 h-10 w-10 text-accent"/>
          Chart Analysis <span className="text-accent">Tool</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Upload your candlestick chart images to receive AI-powered technical analysis, pattern recognition, and potential ICT insights.
        </p>
      </header>

      <main>
        <ImageUploadForm />
      </main>
    </div>
  );
}
