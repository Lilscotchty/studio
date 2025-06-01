
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PerformanceHistoryTable } from "@/components/performance/performance-history-table";
import type { HistoricalPrediction } from "@/types";
import { useToast } from "@/hooks/use-toast";

const IS_BROWSER = typeof window !== 'undefined';

// This is a mock. In a real app, this would come from a global state/context or API
// after a successful analysis on the dashboard page.
const MOCK_NEW_PREDICTIONS_KEY = 'marketVisionNewPredictions';

export default function PerformancePage() {
  const [predictions, setPredictions] = useState<HistoricalPrediction[]>(() => {
    if (!IS_BROWSER) return [];
    const savedPredictions = localStorage.getItem("marketVisionPerformance");
    return savedPredictions ? JSON.parse(savedPredictions) : [];
  });
  const { toast } = useToast();

  const addNewPredictionsFromStorage = useCallback(() => {
    if (!IS_BROWSER) return;
    const newPredictionsString = localStorage.getItem(MOCK_NEW_PREDICTIONS_KEY);
    if (newPredictionsString) {
      try {
        const newPredictionEntries: HistoricalPrediction[] = JSON.parse(newPredictionsString);
        if (Array.isArray(newPredictionEntries) && newPredictionEntries.length > 0) {
          setPredictions(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const trulyNew = newPredictionEntries.filter(np => !existingIds.has(np.id));
            if (trulyNew.length > 0) {
              return [...trulyNew, ...prev];
            }
            return prev;
          });
          localStorage.removeItem(MOCK_NEW_PREDICTIONS_KEY); // Clear after processing
        }
      } catch (error) {
        console.error("Error processing new predictions from storage:", error);
        localStorage.removeItem(MOCK_NEW_PREDICTIONS_KEY); // Clear if parsing fails
      }
    }
  }, []);


  useEffect(() => {
    addNewPredictionsFromStorage(); // Check on initial load

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === MOCK_NEW_PREDICTIONS_KEY) {
        addNewPredictionsFromStorage();
      }
    };
    if (IS_BROWSER) {
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [addNewPredictionsFromStorage]);


  useEffect(() => {
    if (IS_BROWSER) {
       localStorage.setItem("marketVisionPerformance", JSON.stringify(predictions));
    }
  }, [predictions]);

  const handleFlagTrade = (predictionId: string, flag: 'successful' | 'unsuccessful') => {
    setPredictions((prevPredictions) =>
      prevPredictions.map((pred) =>
        pred.id === predictionId ? { ...pred, manualFlag: flag } : pred
      )
    );
    toast({
      title: "Trade Flagged",
      description: `Prediction marked as ${flag}.`,
    });
  };
  
  // Example: How a new prediction might be added (this logic should be on the dashboard page)
  // This is just to illustrate how this page might receive data.
  // useEffect(() => {
  //   if (IS_BROWSER && !localStorage.getItem("marketVisionPerformance_seeded")) {
  //     const examplePrediction: HistoricalPrediction = {
  //       id: "1",
  //       imagePreviewUrl: "https://placehold.co/120x80.png",
  //       date: new Date().toISOString(),
  //       asset: "BTC/USD",
  //       prediction: {
  //         priceTarget: 50000,
  //         stopLossLevel: 45000,
  //         confidenceLevel: 0.75,
  //         marketDirection: "UP",
  //         rationale: "Bullish pattern observed."
  //       },
  //       analysis: {
  //         trend: "Uptrend",
  //         patterns: ["Bullish Engulfing"],
  //         summary: "Strong bullish indicators."
  //       }
  //     };
  //     localStorage.setItem(MOCK_NEW_PREDICTIONS_KEY, JSON.stringify([examplePrediction]));
  //     localStorage.setItem("marketVisionPerformance_seeded", "true");
  //     addNewPredictionsFromStorage(); // Manually trigger for demo
  //   }
  // }, [addNewPredictionsFromStorage]);


  return (
    <div className="container mx-auto py-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">
          Performance <span className="text-accent">Metrics</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Track the history of predictions and evaluate their performance over time.
        </p>
      </header>

      <section>
        <PerformanceHistoryTable predictions={predictions} onFlagTrade={handleFlagTrade} />
      </section>
    </div>
  );
}

// To be called from DashboardPage after successful analysis:
// export const addPredictionToHistory = (predictionData: Omit<HistoricalPrediction, 'id' | 'date' | 'manualFlag'>) => {
//   if (!IS_BROWSER) return;
//   const newEntry: HistoricalPrediction = {
//     ...predictionData,
//     id: Date.now().toString(),
//     date: new Date().toISOString(),
//   };
//   const existing = localStorage.getItem(MOCK_NEW_PREDICTIONS_KEY);
//   const entries = existing ? JSON.parse(existing) : [];
//   entries.push(newEntry);
//   localStorage.setItem(MOCK_NEW_PREDICTIONS_KEY, JSON.stringify(entries));
//   // The 'storage' event will notify the PerformancePage
// };
// This communication mechanism is basic. For robust solution, use context or a state manager.
