
import type { AnalyzeCandlestickChartOutput } from '@/ai/flows/analyze-candlestick-chart';
import type { PredictMarketMovementOutput } from '@/ai/flows/predict-market-movement';
// Correctly import the schema objects themselves, or the inferred types if schemas aren't exported
import type { AnalyzeMarketDataInputSchema, AnalyzeMarketDataOutputSchema } from '@/ai/flows/analyze-market-data-flow';
import type { z } from 'zod';


export interface UploadedImageAnalysis {
  id: string;
  imageName: string;
  imageUrl: string; 
  analysisResult?: AnalysisOutput;
  predictionResult?: PredictionOutput;
  timestamp: Date;
  flaggedStatus?: 'successful' | 'unsuccessful' | null;
}

export interface AlertConfig {
  id: string;
  name: string;
  asset: string; 
  conditionType: 'price_target' | 'confidence_change' | 'pattern_detected';
  value: string | number; 
  notificationMethod: 'email' | 'sms' | 'in-app'; 
  isActive: boolean;
}

export type PredictionOutput = PredictMarketMovementOutput['prediction'];
export type AnalysisOutput = AnalyzeCandlestickChartOutput;

export interface HistoricalPrediction {
  id: string;
  imagePreviewUrl: string; 
  date: string;
  asset?: string; 
  prediction: PredictionOutput;
  analysis?: AnalysisOutput; 
  manualFlag?: 'successful' | 'unsuccessful';
}

// Use z.infer to get the types from the schemas
export type AnalyzeMarketDataInput = z.infer<typeof AnalyzeMarketDataInputSchema>;
export type AnalyzeMarketDataOutput = z.infer<typeof AnalyzeMarketDataOutputSchema>;


// For the quote service (Alpha Vantage or other) Global Quote
export interface AlphaVantageGlobalQuote { // Keeping name generic as it's a structure, not tied to AV
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
  change: number;
  changePercent: string;
}

// Ensure TradingSession is derived correctly
export type TradingSession = AnalyzeMarketDataInput['activeTradingSession'];

```