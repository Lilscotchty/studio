
'use server';

import { z } from 'zod';
import { predictMarketMovement } from '@/ai/flows/predict-market-movement';
import { analyzeCandlestickChart } from '@/ai/flows/analyze-candlestick-chart';
import type { PredictionOutput, AnalysisOutput } from '@/types';

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
    
    // It's good practice to run these in parallel if they are independent
    const [predictionResult, analysisResult] = await Promise.all([
      predictMarketMovement({ candlestickChartDataUri: chartDataUri }),
      analyzeCandlestickChart({ chartDataUri: chartDataUri })
    ]);

    return {
      prediction: predictionResult.prediction,
      analysis: analysisResult, // The whole output which includes trend, patterns, summary
      imagePreviewUrl: chartDataUri, // Send back for preview
    };
  } catch (error) {
    console.error('AI analysis failed:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred during AI analysis.',
    };
  }
}
