
import type { AnalyzeCandlestickChartOutput } from '@/ai/flows/analyze-candlestick-chart';
import type { PredictMarketMovementOutput } from '@/ai/flows/predict-market-movement';
import type { AnalyzeMarketDataInput as AMDI, AnalyzeMarketDataOutput as AMDO } from '@/ai/flows/analyze-market-data-flow';


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
export type AnalysisOutput = AnalyzeCandlestickChartOutput; // This now includes ICT elements

export interface HistoricalPrediction {
  id: string;
  imagePreviewUrl: string; 
  date: string;
  asset?: string; 
  prediction: PredictionOutput;
  analysis?: AnalysisOutput; 
  manualFlag?: 'successful' | 'unsuccessful';
}

export type AnalyzeMarketDataInput = AMDI;
export type AnalyzeMarketDataOutput = AMDO;

// For Alpha Vantage Global Quote
export interface AlphaVantageGlobalQuote {
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
