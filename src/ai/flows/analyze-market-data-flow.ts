
'use server';
/**
 * @fileOverview Analyzes structured market data using ICT concepts,
 * potentially considering active trading sessions.
 *
 * - analyzeMarketData - A function that provides conceptual ICT analysis on market data.
 * - AnalyzeMarketDataInput - The input type for the analyzeMarketData function.
 * - AnalyzeMarketDataOutput - The return type for the analyzeMarketData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TradingSessionEnum = z.enum([
  "None/Overlap",
  "Asia",
  "London Open",
  "London Close",
  "New York AM",
  "New York PM"
]).optional();

const AnalyzeMarketDataInputSchema = z.object({
  assetSymbol: z.string().describe("The trading symbol, e.g., BTC/USD"),
  currentPrice: z.number().describe("The current price of the asset."),
  recentHigh: z.number().describe("The most recent significant high price."),
  recentLow: z.number().describe("The most recent significant low price."),
  marketTrendDescription: z.string().describe("A brief description of the current observed trend by the user, e.g., 'short-term uptrend, consolidating near highs', 'strong downtrend after breaking support'."),
  keyLevelsDescription: z.string().optional().describe("User's description of any nearby key support/resistance, order blocks or FVGs visually identified or known, e.g., 'approaching daily order block at 50000', 'FVG present between 48000-48200'."),
  activeTradingSession: TradingSessionEnum.describe("The current active trading session as perceived by the user, e.g., 'London Open', 'New York AM'. This helps contextualize potential session-specific liquidity events or patterns like the Silver Bullet.")
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
  // The input schema for the prompt remains AnalyzeMarketDataInputSchema.
  // We will pass additional derived boolean properties (isNewYorkAMSession, isLondonOpenSession)
  // in the actual data object to the prompt function, and Handlebars will be able to access them.
  input: {schema: AnalyzeMarketDataInputSchema},
  output: {schema: AnalyzeMarketDataOutputSchema},
  prompt: `You are an expert trading analyst specializing in Inner Circle Trader (ICT) concepts, including session-based setups like the "Silver Bullet".
Analyze the provided market data for asset {{{assetSymbol}}}. Current price is {{{currentPrice}}}. The recent significant high was {{{recentHigh}}} and recent low was {{{recentLow}}}.
The user describes the current trend as: "{{{marketTrendDescription}}}".
The user notes the following key levels: "{{{keyLevelsDescription}}}".
{{#if activeTradingSession}}The user indicates the current trading session is: **{{{activeTradingSession}}}**.{{/if}}

Based on this information and core ICT principles (Liquidity Pools, Market Structure shifts (CHoCH/BOS), Order Blocks, Fair Value Gaps (FVG), Smart Money Reversals (SMR), MMXM concepts, Power of 3 - Accumulation, Manipulation, Distribution):
1.  Determine a conceptual short-term BIAS (Bullish, Bearish, Neutral). Consider the potential current phase of AMD if clues are present.
2.  Provide 2-3 KEY OBSERVATIONS from an ICT perspective.
    - Consider potential liquidity targets (buy-side liquidity above recentHigh, sell-side liquidity below recentLow).
    - How does current price relate to described key zones and recent highs/lows?
    {{#if activeTradingSession}}
    - If the session is 'London Open' or 'New York AM', briefly mention common liquidity phenomena (e.g., Judas swing to take out prior session high/low, then reversal).
    {{/if}}
3.  Suggest what an ICT trader might be looking for NEXT as a conceptual focus.
    {{#if activeTradingSession}}
      {{#if isNewYorkAMSession}}
      - Given the New York AM session context, an ICT trader might be particularly watchful for a "Silver Bullet" setup. This typically involves:
        1. A clear sweep of liquidity (e.g., taking out an early session high/low or a previous day's high/low).
        2. Followed by a strong displacement in the opposite direction, creating a Fair Value Gap (FVG).
        3. An entry is often considered on a retracement into this FVG, targeting liquidity in the direction of the displacement.
        Conceptually, monitor for such a sequence if broader HTF bias aligns. What specific liquidity level might be targeted for a sweep in this session? What direction would displacement need to be to align with HTF bias?
      {{else if isLondonOpenSession}}
      - During the London Open, traders often look for initial manipulation (Judas Swing) that takes liquidity from the Asian session range, followed by a reversal and expansion. If a "Silver Bullet" type setup is sought:
        1. Look for a sweep of Asian session high/low or early London liquidity.
        2. A subsequent displacement creating an FVG.
        3. Potential entry on retracement to the FVG.
        What liquidity might be targeted? How does this align with overall market structure?
      {{else}}
      - For example, a specific type of market structure shift, reaction at an FVG or OB, or a sweep of liquidity.
      {{/if}}
    {{else}}
    - For example, a specific type of market structure shift, reaction at an FVG or OB, or a sweep of liquidity.
    {{/if}}
4.  State your CONFIDENCE (Low, Medium, High) in this conceptual analysis.

Focus on conceptual interpretations and educational descriptions of ICT patterns if applicable. Do not give financial advice or specific trade signals. Ensure output is in valid JSON.
`,
});

const analyzeMarketDataFlow = ai.defineFlow(
  {
    name: 'analyzeMarketDataFlow',
    inputSchema: AnalyzeMarketDataInputSchema,
    outputSchema: AnalyzeMarketDataOutputSchema,
  },
  async input => {
    const isNewYorkAMSession = input.activeTradingSession === "New York AM";
    const isLondonOpenSession = input.activeTradingSession === "London Open";

    const {output} = await prompt({
      ...input,
      isNewYorkAMSession,
      isLondonOpenSession,
    });
    return output!;
  }
);

