
import type { AnalyzeCandlestickChartOutput } from '@/ai/flows/analyze-candlestick-chart';
import type { PredictMarketMovementOutput } from '@/ai/flows/predict-market-movement';
// Import the TYPES directly from the flow file, not the schema objects
import type { 
  AnalyzeMarketDataInput as FlowAnalyzeMarketDataInput, 
  AnalyzeMarketDataOutput as FlowAnalyzeMarketDataOutput 
} from '@/ai/flows/analyze-market-data-flow';


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

// Use the imported types
export type AnalyzeMarketDataInput = FlowAnalyzeMarketDataInput;
export type AnalyzeMarketDataOutput = FlowAnalyzeMarketDataOutput;


// For the quote service (our data provider) Global Quote
export interface AlphaVantageGlobalQuote { // Keeping name generic as it's a structure
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

// Ensure TradingSession is derived correctly from the (now correctly imported) AnalyzeMarketDataInput type
export type TradingSession = AnalyzeMarketDataInput['activeTradingSession'];

