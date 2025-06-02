
"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2, Activity, Brain, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeMarketData, type AnalyzeMarketDataInput, type AnalyzeMarketDataOutput } from "@/ai/flows/analyze-market-data-flow";
import { Alert, AlertDescription as ShadcnAlertDescription, AlertTitle as ShadcnAlertTitle } from "@/components/ui/alert";
import type { TradingSession } from "@/types";

const marketDataSchema = z.object({
  assetSymbol: z.string().min(1, "Asset symbol is required (e.g., NASDAQ:AAPL, BTC/USD)").max(20, "Symbol too long.").default("NASDAQ:AAPL"),
  currentPrice: z.number({invalid_type_error: "Current price must be a number."}).positive("Current price must be positive"),
  recentHigh: z.number({invalid_type_error: "Recent high must be a number."}).positive("Recent high must be positive"),
  recentLow: z.number({invalid_type_error: "Recent low must be a number."}).positive("Recent low must be positive"),
  marketTrendDescription: z.string().min(10, "Trend description is too short.").max(300, "Trend description is too long."),
  keyLevelsDescription: z.string().max(300, "Key levels description is too long.").optional(),
  activeTradingSession: z.enum([
    "None/Overlap",
    "Asia",
    "London Open",
    "London Close",
    "New York AM",
    "New York PM"
  ]).optional(),
});

const tradingSessions: NonNullable<TradingSession>[] = [
  "None/Overlap",
  "Asia",
  "London Open",
  "London Close",
  "New York AM",
  "New York PM"
];

export function LiveMarketDataDisplay() {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<AnalyzeMarketDataOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof marketDataSchema>>({
    resolver: zodResolver(marketDataSchema),
    defaultValues: {
      assetSymbol: "NASDAQ:AAPL", // Default to widget's symbol, user should confirm/edit
      currentPrice: 0,
      recentHigh: 0,
      recentLow: 0,
      marketTrendDescription: "Currently in a short-term uptrend, approaching recent highs after a small pullback.",
      keyLevelsDescription: "Potential resistance at recent highs. Bullish order block visible around prior lows.",
      activeTradingSession: "None/Overlap",
    },
  });

  const onSubmitAnalysis = async (values: z.infer<typeof marketDataSchema>) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    try {
      const inputForAI: AnalyzeMarketDataInput = { ...values };
      if (values.activeTradingSession === "None/Overlap") {
        inputForAI.activeTradingSession = undefined;
      }
      const result = await analyzeMarketData(inputForAI);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Conceptual market analysis has been generated.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setAnalysisError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2"><Activity className="text-accent" />Market Data & Observations</CardTitle>
          <CardDescription>Observe the TradingView chart above, then manually fill in the data and your observations below for the AI to provide a conceptual ICT analysis.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitAnalysis)}>
            <CardContent className="space-y-6 pt-4">
               <FormField
                control={form.control}
                name="activeTradingSession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Clock className="h-4 w-4"/>Perceived Trading Session</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "None/Overlap"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select current session (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tradingSessions.map(session => (
                          <SelectItem key={session} value={session}>{session}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Helps contextualize session-specific patterns like Silver Bullet.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assetSymbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Symbol (e.g., NASDAQ:AAPL, BTC/USD)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter asset symbol observed in chart" />
                    </FormControl>
                    <FormDescription>Enter the symbol you are analyzing from the chart above. This provides context for the AI.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="currentPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="recentHigh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recent Significant High</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recentLow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recent Significant Low</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="marketTrendDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Market Trend Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'Strong uptrend after breaking resistance, now consolidating.'" {...field} rows={3} />
                    </FormControl>
                    <FormDescription>Describe the trend you observe in the chart.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keyLevelsDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Key Levels Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'Approaching daily order block at 50000. FVG present between 48000-48200.'" {...field} rows={3} />
                    </FormControl>
                     <FormDescription>Describe any important S/R, OBs, FVGs you see.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isAnalyzing} className="w-full bg-primary hover:bg-primary/90">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Get Conceptual Analysis
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {analysisError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <ShadcnAlertTitle>Analysis Error</ShadcnAlertTitle>
          <ShadcnAlertDescription>{analysisError}</ShadcnAlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Conceptual Market Analysis Result</CardTitle>
            <CardDescription>Based on the provided data, descriptions, and selected session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Potential Bias</Label>
              <p className="text-lg font-semibold">{analysisResult.potentialBias} (Confidence: {analysisResult.confidence})</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Key Observations</Label>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                {analysisResult.keyObservations.map((obs, index) => (
                  <li key={index} className="text-sm">{obs}</li>
                ))}
              </ul>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Suggested Focus</Label>
              <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md whitespace-pre-wrap">{analysisResult.suggestedFocus}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

