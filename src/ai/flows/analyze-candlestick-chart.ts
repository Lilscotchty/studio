
'use server';

/**
 * @fileOverview Analyzes candlestick chart images to identify patterns, trends, and basic ICT elements.
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

const ICTElementSchema = z.object({
  type: z.enum([
    "Order Block (Bullish)", 
    "Order Block (Bearish)", 
    "Fair Value Gap (Bullish)", 
    "Fair Value Gap (Bearish)", 
    "Liquidity Pool (Buy-side)", 
    "Liquidity Pool (Sell-side)"
  ]).describe("The type of ICT element identified."),
  location_description: z.string().describe("A textual description of where this element is visually located on the chart, e.g., 'around the recent swing low', 'the large green candle near the top'.")
});

const AnalyzeCandlestickChartOutputSchema = z.object({
  trend: z.string().describe('The identified trend in the candlestick chart.'),
  patterns: z.array(z.string()).describe('The candlestick patterns identified in the chart.'),
  summary: z.string().describe('A summary of the analysis of the candlestick chart.'),
  ictElements: z.array(ICTElementSchema).optional().describe("Key ICT elements identified visually on the chart, such as Order Blocks or Fair Value Gaps."),
  marketStructureAnalysis: z.string().optional().describe("Observations on market structure like Break of Structure (BOS) or Change of Character (CHoCH), if visually discernible."),
  potentialAMDCycle: z.object({
    phase: z.enum(["Accumulation", "Manipulation", "Distribution (Markup)", "Distribution (Markdown)", "Unclear"]).optional().describe("The potential AMD phase observed or suggested by the chart."),
    reasoning: z.string().optional().describe("Brief reasoning for the potential AMD phase identification, e.g., 'Shows signs of a range after a downtrend, potential accumulation', 'Sharp wick below prior lows before strong up-move, suggests manipulation (stop hunt)'.")
  }).optional().describe("A conceptual observation about a potential Accumulation, Manipulation, Distribution (AMD) cycle phase suggested by the chart's price action."),
});
export type AnalyzeCandlestickChartOutput = z.infer<typeof AnalyzeCandlestickChartOutputSchema>;

export async function analyzeCandlestickChart(input: AnalyzeCandlestickChartInput): Promise<AnalyzeCandlestickChartOutput> {
  return analyzeCandlestickChartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCandlestickChartPrompt',
  input: {schema: AnalyzeCandlestickChartInputSchema},
  output: {schema: AnalyzeCandlestickChartOutputSchema},
  prompt: `You are an expert financial analyst specializing in candlestick chart pattern recognition and Inner Circle Trader (ICT) concepts, including the Power of 3 (Accumulation, Manipulation, Distribution - AMD).

You will analyze the provided candlestick chart image. Your goal is to identify and describe the following:
1.  Overall Trend: Determine the prevailing market trend (e.g., Uptrend, Downtrend, Sideways).
2.  Candlestick Patterns: Identify any significant candlestick patterns visible (e.g., Hammer, Engulfing, Doji). List them.
3.  ICT Elements: Visually identify and describe key ICT elements. For each element found, specify its type and provide a brief description of its location on the chart. Types to consider:
    - Order Block (Bullish)
    - Order Block (Bearish)
    - Fair Value Gap (Bullish)
    - Fair Value Gap (Bearish)
    - Liquidity Pool (Buy-side) - e.g., above clear swing highs or equal highs
    - Liquidity Pool (Sell-side) - e.g., below clear swing lows or equal lows
4.  Market Structure: Briefly comment on any visible market structure features like a Break of Structure (BOS) or a Change of Character (CHoCH). For example, "Potential BOS to the upside if the recent high is broken," or "CHoCH observed as the previous swing low was violated."
5.  Potential AMD Cycle Observation: Based on the visual price action, suggest if the chart might be part of an Accumulation, Manipulation, or Distribution (Markup/Markdown) phase. Provide a brief reasoning. Consider elements like:
    - Consolidation/ranging after a trend (potential Accumulation).
    - Sharp moves that raid liquidity (sweeps above/below obvious highs/lows) followed by reversals (potential Manipulation).
    - Strong, sustained directional moves after a consolidation or manipulation (potential Distribution - Markup/Markdown).
    If unclear, state "Unclear".
6.  Summary: Provide a concise overall summary of your analysis based on all the above points.

Analyze the following candlestick chart:

{{media url=chartDataUri}}

Output MUST be in JSON format according to the defined output schema. For ictElements, provide a list of objects, each with 'type' and 'location_description'. If no specific ICT elements or market structure features are clearly visible, you may omit those fields or return empty arrays/strings respectively. For potentialAMDCycle, if nothing strongly suggests a phase, you can set phase to "Unclear" or omit the reasoning if no specific clues are visible.`,
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

