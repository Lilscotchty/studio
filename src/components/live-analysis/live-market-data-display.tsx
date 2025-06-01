
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, CheckCircle, Loader2, Activity, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeMarketData, type AnalyzeMarketDataInput, type AnalyzeMarketDataOutput } from "@/ai/flows/analyze-market-data-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const marketDataSchema = z.object({
  assetSymbol: z.string().min(3, "Asset symbol is required (e.g., MOCK/USD)").default("MOCK/USD"),
  currentPrice: z.number().positive("Current price must be positive"),
  recentHigh: z.number().positive("Recent high must be positive"),
  recentLow: z.number().positive("Recent low must be positive"),
  marketTrendDescription: z.string().min(10, "Trend description is too short.").max(300, "Trend description is too long."),
  keyLevelsDescription: z.string().max(300, "Key levels description is too long.").optional(),
});

export function LiveMarketDataDisplay() {
  const { toast } = useToast();
  const [simulatedPrice, setSimulatedPrice] = useState(100.00);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeMarketDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof marketDataSchema>>({
    resolver: zodResolver(marketDataSchema),
    defaultValues: {
      assetSymbol: "MOCK/USD",
      currentPrice: simulatedPrice,
      recentHigh: 105.00,
      recentLow: 95.00,
      marketTrendDescription: "Currently in a short-term uptrend, approaching recent highs after a small pullback.",
      keyLevelsDescription: "Potential resistance at 105. Bullish order block visible around 96-97. Small FVG around 98.50-98.80.",
    },
  });

  useEffect(() => {
    form.setValue("currentPrice", parseFloat(simulatedPrice.toFixed(2)));
  }, [simulatedPrice, form]);

  const simulatePriceUpdate = useCallback(() => {
    setSimulatedPrice(prevPrice => {
      const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
      return Math.max(1, prevPrice + change); // Ensure price doesn't go below 1
    });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(simulatePriceUpdate, 3000); // Update every 3 seconds
    return () => clearInterval(intervalId);
  }, [simulatePriceUpdate]);

  const onSubmit = async (values: z.infer<typeof marketDataSchema>) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeMarketData(values);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Conceptual ICT analysis has been generated.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2"><Activity className="text-accent" />Simulated Market Data</CardTitle>
          <CardDescription>Current simulated price for {form.getValues("assetSymbol")}: <span className="font-bold text-lg text-accent">${simulatedPrice.toFixed(2)}</span></CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="assetSymbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Symbol</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="currentPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Price (auto-updates)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} readOnly className="bg-muted/50" />
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
                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                    <FormLabel>Market Trend Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'Strong uptrend after breaking resistance, now consolidating.'" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keyLevelsDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Levels Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'Approaching daily order block at 50000. FVG present between 48000-48200.'" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Market Data
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Conceptual ICT Analysis</CardTitle>
            <CardDescription>Based on the provided simulated data and descriptions.</CardDescription>
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
              <Label className="text-sm font-medium text-muted-foreground">Suggested Focus for ICT Trader</Label>
              <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{analysisResult.suggestedFocus}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper Label if not globally available
// const Label = ({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { children: React.ReactNode }) => (
//   <label className={`block text-sm font-medium text-foreground ${className}`} {...props}>
//     {children}
//   </label>
// );
