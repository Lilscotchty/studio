// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Analyzes candlestick chart images to identify patterns and trends.
 *
 * - analyzeCandlestickChart - A function that handles the candlestick chart analysis process.
 * - AnalyzeCandlestickChartInput - The input type for the analyzeCandlestickChart function.
 * - AnalyzeCandlestickChartOutput - The return type for the analyzeCandlestickChart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCandlestickChartInputSchema = z.object({
  chartDataUri: z
    .string()
    .describe(
      "A photo of a candlestick chart, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCandlestickChartInput = z.infer<typeof AnalyzeCandlestickChartInputSchema>;

const AnalyzeCandlestickChartOutputSchema = z.object({
  trend: z.string().describe('The identified trend in the candlestick chart.'),
  patterns: z.array(z.string()).describe('The candlestick patterns identified in the chart.'),
  summary: z.string().describe('A summary of the analysis of the candlestick chart.'),
});
export type AnalyzeCandlestickChartOutput = z.infer<typeof AnalyzeCandlestickChartOutputSchema>;

export async function analyzeCandlestickChart(input: AnalyzeCandlestickChartInput): Promise<AnalyzeCandlestickChartOutput> {
  return analyzeCandlestickChartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCandlestickChartPrompt',
  input: {schema: AnalyzeCandlestickChartInputSchema},
  output: {schema: AnalyzeCandlestickChartOutputSchema},
  prompt: `You are an expert financial analyst specializing in candlestick chart pattern recognition.

You will analyze the candlestick chart and identify trends, specific candlestick patterns, and provide a summary of your analysis.

Analyze the following candlestick chart:

{{media url=chartDataUri}}

Output the trend, patterns, and summary in JSON format.`,
});

const analyzeCandlestickChartFlow = ai.defineFlow(
  {
    name: 'analyzeCandlestickChartFlow',
    inputSchema: AnalyzeCandlestickChartInputSchema,
    outputSchema: AnalyzeCandlestickChartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
