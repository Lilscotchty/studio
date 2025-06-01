
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, CandlestickChart, BarChart2, Lightbulb } from "lucide-react";
import type { PredictionOutput, AnalysisOutput } from "@/types";

interface PredictionResultsProps {
  prediction: PredictionOutput;
  analysis: AnalysisOutput;
  imagePreviewUrl?: string;
}

const MarketDirectionIcon = ({ direction }: { direction: PredictionOutput['marketDirection'] }) => {
  switch (direction) {
    case 'UP':
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    case 'DOWN':
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    case 'NEUTRAL':
      return <Minus className="h-5 w-5 text-yellow-500" />;
    default:
      return null;
  }
};

export function PredictionResults({ prediction, analysis, imagePreviewUrl }: PredictionResultsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {imagePreviewUrl && (
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <CandlestickChart className="text-accent" /> Analyzed Chart
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-6 bg-muted/20 rounded-b-lg">
            <Image
              src={imagePreviewUrl}
              alt="Analyzed candlestick chart"
              width={600}
              height={400}
              className="rounded-md object-contain max-h-[400px]"
              data-ai-hint="chart graph"
            />
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
             <BarChart2 className="text-accent"/> Market Prediction
          </CardTitle>
          <CardDescription>AI-generated insights based on the chart analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Market Direction</Label>
            <div className="flex items-center gap-2 mt-1">
              <MarketDirectionIcon direction={prediction.marketDirection} />
              <Badge variant={
                prediction.marketDirection === 'UP' ? 'default' : 
                prediction.marketDirection === 'DOWN' ? 'destructive' : 'secondary'
              } className={
                prediction.marketDirection === 'UP' ? 'bg-green-600 hover:bg-green-700' :
                prediction.marketDirection === 'DOWN' ? 'bg-red-600 hover:bg-red-700' :
                'bg-yellow-500 hover:bg-yellow-600'
              }>
                {prediction.marketDirection}
              </Badge>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Price Target</Label>
            <p className="text-lg font-semibold text-foreground">{prediction.priceTarget.toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Stop-Loss Level</Label>
            <p className="text-lg font-semibold text-foreground">{prediction.stopLossLevel.toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Confidence Level ({Math.round(prediction.confidenceLevel * 100)}%)</Label>
            <Progress value={prediction.confidenceLevel * 100} className="w-full mt-1 [&>div]:bg-accent" />
          </div>
           <div>
            <Label className="text-sm font-medium">Rationale</Label>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{prediction.rationale}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Lightbulb className="text-accent"/> Chart Analysis
          </CardTitle>
          <CardDescription>Key findings from the candlestick chart image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Identified Trend</Label>
            <p className="text-lg font-semibold text-foreground">{analysis.trend}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Detected Patterns</Label>
            {analysis.patterns.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {analysis.patterns.map((pattern, index) => (
                  <Badge key={index} variant="secondary">{pattern}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">No specific patterns identified.</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Analysis Summary</Label>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{analysis.summary}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Label component if not globally available or for specific styling
const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={`block text-sm font-medium text-muted-foreground ${className}`} {...props} />
);

