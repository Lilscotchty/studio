
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2, Activity, Brain, Clock, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeMarketData, type AnalyzeMarketDataInput, type AnalyzeMarketDataOutput } from "@/ai/flows/analyze-market-data-flow";
import { fetchMarketDataFromAV, type FetchMarketDataResult } from "@/lib/actions"; 
import { Alert, AlertDescription as ShadcnAlertDescription, AlertTitle as ShadcnAlertTitle } from "@/components/ui/alert";
import type { TradingSession, AlphaVantageGlobalQuote } from "@/types"; 

const marketDataSchema = z.object({
  symbolToFetch: z.string().optional(), 
  assetSymbol: z.string().min(1, "Asset symbol is required (e.g., NASDAQ:AAPL, BTC/USD)").max(30, "Symbol too long.").default("NASDAQ:AAPL"), // Increased max length
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

  const [isFetchingData, setIsFetchingData] = useState(false);
  const [fetchDataError, setFetchDataError] = useState<string | null>(null);


  const form = useForm<z.infer<typeof marketDataSchema>>({
    resolver: zodResolver(marketDataSchema),
    defaultValues: {
      symbolToFetch: "AAPL", 
      assetSymbol: "NASDAQ:AAPL",
      currentPrice: 0,
      recentHigh: 0,
      recentLow: 0,
      marketTrendDescription: "Currently in a short-term uptrend, approaching recent highs after a small pullback.",
      keyLevelsDescription: "Potential resistance at recent highs. Bullish order block visible around prior lows.",
      activeTradingSession: "None/Overlap",
    },
  });

  const handleFetchData = async () => {
    const symbol = form.getValues("symbolToFetch");
    if (!symbol) {
      setFetchDataError("Please enter a symbol to fetch.");
      return;
    }
    setIsFetchingData(true);
    setFetchDataError(null);
    try {
      const result: FetchMarketDataResult = await fetchMarketDataFromAV(symbol);
      if (result.error) {
        setFetchDataError(result.error);
        toast({
          title: "Fetch Failed",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.data) {
        const fetchedData = result.data;
        form.setValue("assetSymbol", fetchedData.symbol); // Use symbol from API response (e.g. "EUR/USD")
        form.setValue("currentPrice", fetchedData.price);
        form.setValue("recentHigh", fetchedData.high);
        form.setValue("recentLow", fetchedData.low);
        toast({
          title: "Data Fetched",
          description: `Successfully fetched quote for ${fetchedData.symbol} (${result.assetType}).`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during fetch.";
      setFetchDataError(errorMessage);
      toast({
        title: "Fetch Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsFetchingData(false);
    }
  };


  const onSubmitAnalysis = async (values: z.infer<typeof marketDataSchema>) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    try {
      const { symbolToFetch, ...analysisInputData } = values;
      const inputForAI: AnalyzeMarketDataInput = { ...analysisInputData };
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
          <CardDescription>
            Observe the TradingView chart. You can optionally fetch a quote by entering a symbol below (e.g., AAPL for stocks, EURUSD or EUR/USD for Forex, BTCUSD or BTC/USD for Crypto). Then, manually refine data and add your observations for AI-powered conceptual ICT analysis.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitAnalysis)}>
            <CardContent className="space-y-6 pt-4">

              <div className="border p-4 rounded-md space-y-4 bg-muted/30">
                <FormField
                  control={form.control}
                  name="symbolToFetch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Search className="h-4 w-4" /> Symbol for Quote Fetch</FormLabel>
                      <div className="flex gap-2 items-center">
                        <FormControl>
                          <Input {...field} placeholder="e.g., AAPL, EURUSD, BTC/USD" />
                        </FormControl>
                        <Button type="button" onClick={handleFetchData} disabled={isFetchingData} variant="outline" className="shrink-0">
                          {isFetchingData ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Fetching...
                            </>
                          ) : (
                            "Fetch Quote"
                          )}
                        </Button>
                      </div>
                      <FormDescription>
                        Enter a Stock (e.g. AAPL), Forex (e.g. EURUSD or EUR/USD), or Crypto (e.g. BTCUSD or BTC/USD) symbol to pre-fill price data from Alpha Vantage.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fetchDataError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <ShadcnAlertTitle>Data Fetch Error</ShadcnAlertTitle>
                    <ShadcnAlertDescription>
                      {fetchDataError}
                      <br />
                      Ensure the symbol format is correct for the asset type. Alpha Vantage API key must be configured and within rate limits. For complex assets or if issues persist, please enter data manually.
                    </ShadcnAlertDescription>
                  </Alert>
                )}
              </div>


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
                    <FormLabel>Asset Symbol for Analysis (e.g., NASDAQ:AAPL, BTC/USD, EUR/USD)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter asset symbol observed in chart" />
                    </FormControl>
                    <FormDescription>This symbol provides context for the AI. It can be auto-filled by "Fetch Quote" or entered manually.</FormDescription>
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

