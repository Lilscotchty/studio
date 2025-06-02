
'use server';
/**
 * @fileOverview Analyzes structured market data using ICT concepts,
 * potentially considering active trading sessions, and provides conceptual guidance.
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

export const AnalyzeMarketDataInputSchema = z.object({
  assetSymbol: z.string().describe("The trading symbol, e.g., BTC/USD"),
  currentPrice: z.number().describe("The current price of the asset."),
  recentHigh: z.number().describe("The most recent significant high price."),
  recentLow: z.number().describe("The most recent significant low price."),
  marketTrendDescription: z.string().describe("A brief description of the current observed trend by the user, e.g., 'short-term uptrend, consolidating near highs', 'strong downtrend after breaking support'."),
  keyLevelsDescription: z.string().optional().describe("User's description of any nearby key support/resistance, order blocks or FVGs visually identified or known, e.g., 'approaching daily order block at 50000', 'FVG present between 48000-48200'."),
  activeTradingSession: TradingSessionEnum.describe("The current active trading session as perceived by the user, e.g., 'London Open', 'New York AM'. This helps contextualize potential session-specific liquidity events or patterns like the Silver Bullet.")
});
export type AnalyzeMarketDataInput = z.infer<typeof AnalyzeMarketDataInputSchema>;

export const AnalyzeMarketDataOutputSchema = z.object({
  potentialBias: z.enum(["Bullish", "Bearish", "Neutral"]).describe("The AI's inferred short-term conceptual bias based on the provided context and ICT principles."),
  keyObservations: z.array(z.string()).describe("List of key conceptual observations based on ICT principles, e.g., 'Price approaching potential sell-side liquidity below recentLow', 'Possible manipulation above recentHigh if overall trend is down.'"),
  suggestedFocusICT: z.string().describe("What an ICT trader might conceptually be looking for next, e.g., 'Look for CHoCH below recentLow if HTF bias is bearish', 'Monitor for SMR at key resistance if price sweeps recentHigh before continuing lower.'"),
  confidence: z.enum(["Low", "Medium", "High"]).describe("Confidence in this conceptual analysis."),
  
  // New fields for non-ICT user guidance
  suggestedActionDirection: z.enum(["Buy", "Sell", "Consider Holding/Neutral", "Avoid/Wait"]).describe("A general suggested action direction based on the analysis. This is conceptual and not financial advice."),
  potentialEntryZone: z.string().optional().describe("A conceptual price range or level for potential entry, e.g., 'around 49500-49800', or 'on a pullback to the support near 1.2345'. This is conceptual and not financial advice."),
  potentialTakeProfitZone: z.string().optional().describe("A conceptual price range for potential take profit, e.g., 'targeting the recent high around 52000', or 'towards the next resistance at 1.2500'. This is conceptual and not financial advice."),
  potentialStopLossLevel: z.string().optional().describe("A conceptual price level for stop loss, e.g., 'below the recent low of 48000', or 'just above the identified resistance at 1.2250'. This is conceptual and not financial advice."),
  conceptualTimeframe: z.string().optional().describe("A general conceptual timeframe for the idea, e.g., 'Intraday (within the day)', 'Short-term (few hours to a day)', 'Swing (few days)'. This is conceptual and not financial advice."),
  reasoningForNonICTUser: z.string().describe("A simplified explanation for the suggested action, avoiding complex ICT jargon, suitable for a beginner. This is conceptual and not financial advice.")
});
export type AnalyzeMarketDataOutput = z.infer<typeof AnalyzeMarketDataOutputSchema>;

export async function analyzeMarketData(input: AnalyzeMarketDataInput): Promise<AnalyzeMarketDataOutput> {
  return analyzeMarketDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketDataPrompt',
  input: {schema: AnalyzeMarketDataInputSchema}, // Will pass derived booleans in the data object
  output: {schema: AnalyzeMarketDataOutputSchema},
  prompt: `You are an expert trading analyst. Your goal is to provide two types of analysis based on the provided market data for asset {{{assetSymbol}}}:
1.  **ICT-Specific Analysis**: For traders familiar with Inner Circle Trader (ICT) concepts.
2.  **Simplified Guidance**: For users less familiar with ICT, offering conceptual direction, potential price zones, and simplified reasoning.

**ALL OUTPUT IS FOR EDUCATIONAL AND CONCEPTUAL PURPOSES ONLY AND IS NOT FINANCIAL ADVICE.**

Market Data:
- Current Price: {{{currentPrice}}}
- Recent Significant High: {{{recentHigh}}}
- Recent Significant Low: {{{recentLow}}}
- User's Trend Description: "{{{marketTrendDescription}}}"
- User's Key Levels Description: "{{{keyLevelsDescription}}}"
{{#if activeTradingSession}}- User's Perceived Trading Session: **{{{activeTradingSession}}}**.{{/if}}

**Part 1: ICT-Specific Analysis**
Based on core ICT principles (Liquidity Pools, Market Structure shifts (CHoCH/BOS), Order Blocks, Fair Value Gaps (FVG), Smart Money Reversals (SMR), MMXM, Power of 3 - AMD):
- Determine a conceptual short-term BIAS (Bullish, Bearish, Neutral).
- Provide 2-3 KEY OBSERVATIONS from an ICT perspective.
  - Consider potential liquidity targets.
  - How does current price relate to described key zones and recent highs/lows?
  {{#if activeTradingSession}}- If the session is 'London Open' or 'New York AM', briefly mention common liquidity phenomena (e.g., Judas swing).{{/if}}
- Suggest what an ICT trader might be looking for NEXT as a conceptual focus (suggestedFocusICT).
  {{#if isNewYorkAMSession}}- Given New York AM, mention conceptual "Silver Bullet" considerations: liquidity sweep, displacement creating FVG, retracement to FVG.{{/if}}
  {{#if isLondonOpenSession}}- Given London Open, mention conceptual Judas Swing from Asian range, then reversal/expansion, potential FVG entry.{{/if}}
- State your CONFIDENCE (Low, Medium, High) in this ICT-specific conceptual analysis.

**Part 2: Simplified Guidance (Conceptual & Educational - NOT FINANCIAL ADVICE)**
Based on the overall analysis (including your ICT insights, but explained simply):
- **suggestedActionDirection**: What general direction might be considered? (Buy, Sell, Consider Holding/Neutral, Avoid/Wait).
- **potentialEntryZone**: If action is Buy/Sell, what is a conceptual price area for entry? (e.g., "around current price if X happens", "on a pullback to X level"). If Neutral/Avoid, this might be N/A.
- **potentialTakeProfitZone**: If action is Buy/Sell, what is a conceptual target area? (e.g., "towards recent high Y", "near resistance Z"). If Neutral/Avoid, this might be N/A.
- **potentialStopLossLevel**: If action is Buy/Sell, what is a conceptual level for a stop loss? (e.g., "below recent low A", "above resistance B"). If Neutral/Avoid, this might be N/A.
- **conceptualTimeframe**: What's a general, conceptual timeframe for this idea? (e.g., "Intraday", "Short-term (few hours to a day)", "Swing (few days)").
- **reasoningForNonICTUser**: Explain the suggestion in simple terms, avoiding ICT jargon. Focus on basic concepts like trend, support/resistance, and momentum if applicable. For example, "The trend appears to be upward, and the price is near a support level, suggesting a potential bounce." or "The price is at a strong resistance level after a long upward move, suggesting caution or potential for a pullback."

**IMPORTANT**: Reiterate that all suggestions in Part 2 are conceptual, for educational understanding of market dynamics, and ARE NOT financial advice or direct trade signals. The user must do their own research and consider their risk tolerance.

Output MUST be in valid JSON.
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

    // Ensure activeTradingSession is not "None/Overlap" when passing to prompt if it's the default
    const effectiveInput = {
      ...input,
      activeTradingSession: input.activeTradingSession === "None/Overlap" ? undefined : input.activeTradingSession,
      isNewYorkAMSession,
      isLondonOpenSession,
    };
    
    const {output} = await prompt(effectiveInput);
    return output!;
  }
);

// Ensure types are exported if they are used elsewhere (they are, in src/types/index.ts)
// export type { AnalyzeMarketDataInput, AnalyzeMarketDataOutput };
// The above export is not needed as schema types are already exported.
// However, if these schemas were not exported directly, you would export the inferred types.
// For example: export type AnalyzeMarketDataInput = z.infer<typeof AnalyzeMarketDataInputSchema>;
// export type AnalyzeMarketDataOutput = z.infer<typeof AnalyzeMarketDataOutputSchema>;
// But since the schema objects themselves are exported, this is fine.

```