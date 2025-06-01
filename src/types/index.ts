
import type { AnalyzeCandlestickChartOutput } from '@/ai/flows/analyze-candlestick-chart';
import type { PredictMarketMovementOutput } from '@/ai/flows/predict-market-movement';
import type { AnalyzeMarketDataInput as AMDI, AnalyzeMarketDataOutput as AMDO } from '@/ai/flows/analyze-market-data-flow';


export interface UploadedImageAnalysis {
  id: string;
  imageName: string;
  imageUrl: string; // data URI or URL if stored
  analysisResult?: AnalysisOutput; // Corrected: This was referencing AnalyzeCandlestickChartOutput directly
  predictionResult?: PredictionOutput;
  timestamp: Date;
  flaggedStatus?: 'successful' | 'unsuccessful' | null;
}

export interface AlertConfig {
  id: string;
  name: string;
  asset: string; // e.g. BTC/USD
  conditionType: 'price_target' | 'confidence_change' | 'pattern_detected';
  value: string | number; // e.g. target price, confidence threshold, pattern name
  notificationMethod: 'email' | 'sms' | 'in-app'; // For UI display, actual notification not implemented
  isActive: boolean;
}

// Refined types based on actual AI flow outputs
export type PredictionOutput = PredictMarketMovementOutput['prediction'];
export type AnalysisOutput = AnalyzeCandlestickChartOutput;

export interface HistoricalPrediction {
  id: string;
  imagePreviewUrl: string; // A small preview or placeholder
  date: string;
  asset?: string; // Optional: if user can specify
  prediction: PredictionOutput;
  analysis?: AnalysisOutput; // This will now include ICT elements
  manualFlag?: 'successful' | 'unsuccessful';
}

// Types for the new analyzeMarketDataFlow
export type AnalyzeMarketDataInput = AMDI;
export type AnalyzeMarketDataOutput = AMDO;
