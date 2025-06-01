
'use server';
/**
 * @fileOverview Analyzes structured market data using ICT concepts.
 *
 * - analyzeMarketData - A function that provides conceptual ICT analysis on market data.
 * - AnalyzeMarketDataInput - The input type for the analyzeMarketData function.
 * - AnalyzeMarketDataOutput - The return type for the analyzeMarketData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMarketDataInputSchema = z.object({
  assetSymbol: z.string().describe("The trading symbol, e.g., BTC/USD"),
  currentPrice: z.number().describe("The current price of the asset."),
  recentHigh: z.number().describe("The most recent significant high price."),
  recentLow: z.number().describe("The most recent significant low price."),
  marketTrendDescription: z.string().describe("A brief description of the current observed trend by the user, e.g., 'short-term uptrend, consolidating near highs', 'strong downtrend after breaking support'."),
  keyLevelsDescription: z.string().optional().describe("User's description of any nearby key support/resistance, order blocks or FVGs visually identified or known, e.g., 'approaching daily order block at 50000', 'FVG present between 48000-48200'.")
});
export type AnalyzeMarketDataInput = z.infer<typeof AnalyzeMarketDataInputSchema>;

const AnalyzeMarketDataOutputSchema = z.object({
  potentialBias: z.enum(["Bullish", "Bearish", "Neutral"]).describe("The AI's inferred short-term conceptual bias based on the provided context and ICT principles."),
  keyObservations: z.array(z.string()).describe("List of key conceptual observations based on ICT principles, e.g., 'Price approaching potential sell-side liquidity below recentLow', 'Possible manipulation above recentHigh if overall trend is down.'"),
  suggestedFocus: z.string().describe("What an ICT trader might conceptually be looking for next, e.g., 'Look for CHoCH below recentLow if HTF bias is bearish', 'Monitor for SMR at key resistance if price sweeps recentHigh before continuing lower.'"),
  confidence: z.enum(["Low", "Medium", "High"]).describe("Confidence in this conceptual analysis.")
});
export type AnalyzeMarketDataOutput = z.infer<typeof AnalyzeMarketDataOutputSchema>;

export async function analyzeMarketData(input: AnalyzeMarketDataInput): Promise<AnalyzeMarketDataOutput> {
  return analyzeMarketDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketDataPrompt',
  input: {schema: AnalyzeMarketDataInputSchema},
  output: {schema: AnalyzeMarketDataOutputSchema},
  prompt: `You are an expert trading analyst specializing in Inner Circle Trader (ICT) concepts.
Analyze the provided market data for asset {{{assetSymbol}}}. Current price is {{{currentPrice}}}. The recent significant high was {{{recentHigh}}} and recent low was {{{recentLow}}}.
The user describes the current trend as: "{{{marketTrendDescription}}}".
The user notes the following key levels: "{{{keyLevelsDescription}}}".

Based on this information and core ICT principles (Liquidity Pools, Market Structure shifts (CHoCH/BOS), Order Blocks, Fair Value Gaps (FVG), Smart Money Reversals (SMR), MMXM concepts):
1.  Determine a conceptual short-term BIAS (Bullish, Bearish, Neutral).
2.  Provide 2-3 KEY OBSERVATIONS from an ICT perspective. Consider potential liquidity targets (buy-side liquidity above recentHigh, sell-side liquidity below recentLow), and how the current price relates to these levels and described key zones.
3.  Suggest what an ICT trader might be looking for NEXT as a conceptual focus (e.g., a specific type of market structure shift, reaction at an FVG or OB, a sweep of liquidity).
4.  State your CONFIDENCE (Low, Medium, High) in this conceptual analysis.

Focus on conceptual interpretations. Do not give financial advice.

Output MUST be in JSON format according to the defined output schema.
`,
});

const analyzeMarketDataFlow = ai.defineFlow(
  {
    name: 'analyzeMarketDataFlow',
    inputSchema: AnalyzeMarketDataInputSchema,
    outputSchema: AnalyzeMarketDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
