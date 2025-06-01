
'use server';

import { z } from 'zod';
import { predictMarketMovement } from '@/ai/flows/predict-market-movement';
import { analyzeCandlestickChart } from '@/ai/flows/analyze-candlestick-chart';
import type { PredictionOutput, AnalysisOutput, AlphaVantageGlobalQuote } from '@/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const formSchema = z.object({
  chartImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ALLOWED_FILE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png, .webp, and .gif formats are supported.'
    ),
});

export interface AnalysisResult {
  prediction?: PredictionOutput;
  analysis?: AnalysisOutput;
  error?: string;
  imagePreviewUrl?: string;
}

async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function handleImageAnalysisAction(
  prevState: AnalysisResult | undefined,
  formData: FormData
): Promise<AnalysisResult> {
  const validatedFields = formSchema.safeParse({
    chartImage: formData.get('chartImage'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.chartImage?.join(', ') || "Invalid input.",
    };
  }

  const { chartImage } = validatedFields.data;

  try {
    const chartDataUri = await fileToDataUri(chartImage);
    
    const [predictionResult, analysisResult] = await Promise.all([
      predictMarketMovement({ candlestickChartDataUri: chartDataUri }),
      analyzeCandlestickChart({ chartDataUri: chartDataUri })
    ]);

    return {
      prediction: predictionResult.prediction,
      analysis: analysisResult,
      imagePreviewUrl: chartDataUri,
    };
  } catch (error) {
    console.error('AI analysis failed:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred during AI analysis.',
    };
  }
}

export interface FetchMarketDataResult {
  data?: AlphaVantageGlobalQuote;
  error?: string;
}

export async function fetchMarketDataFromAV(symbol: string): Promise<FetchMarketDataResult> {
  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  if (!apiKey) {
    return { error: 'API key for Alpha Vantage is not configured.' };
  }

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { error: `Alpha Vantage API request failed: ${response.statusText}` };
    }
    const data = await response.json();
    
    if (data['Error Message']) {
      return { error: `Alpha Vantage API error: ${data['Error Message']}` };
    }
    if (data['Note']) {
        console.warn('Alpha Vantage API Note:', data['Note']);
        // Potentially return this note to the user if it indicates a rate limit issue often
    }
    
    const globalQuote = data['Global Quote'];
    if (!globalQuote || Object.keys(globalQuote).length === 0) {
        return { error: 'No data returned for the symbol, or symbol not found.' };
    }

    return {
      data: {
        symbol: globalQuote['01. symbol'],
        open: parseFloat(globalQuote['02. open']),
        high: parseFloat(globalQuote['03. high']),
        low: parseFloat(globalQuote['04. low']),
        price: parseFloat(globalQuote['05. price']),
        volume: parseInt(globalQuote['06. volume'], 10),
        latestTradingDay: globalQuote['07. latest trading day'],
        previousClose: parseFloat(globalQuote['08. previous close']),
        change: parseFloat(globalQuote['09. change']),
        changePercent: globalQuote['10. change percent'],
      },
    };
  } catch (error) {
    console.error('Failed to fetch market data from Alpha Vantage:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred while fetching market data.' };
  }
}
