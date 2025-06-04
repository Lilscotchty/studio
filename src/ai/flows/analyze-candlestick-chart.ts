
'use server';

/**
 * @fileOverview Analyzes candlestick chart images to identify patterns, trends, basic ICT elements,
 * and apply a conceptual Daily Bias determination framework based on visual information.
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

const DailyBiasReasoningSchema = z.object({
  drawOnLiquidityAnalysis: z.string().optional().describe("Visual interpretation of the current draw on liquidity (IRL to ERL or ERL to IRL). Example: 'Chart suggests price tapped an internal FVG (IRL) and may now be seeking external range liquidity like the visible swing high.'"),
  timeBasedLiquidityAnalysis: z.string().optional().describe("Visual observations regarding previous significant candle highs/lows. Example: 'Price shows displacement above what appears to be the previous major daily candle's high, suggesting continuation.' or 'A sweep above the prior candle's high without displacement, potential reversal.'"),
  ltfConfirmationOutlook: z.string().optional().describe("Conceptual LTF structure to look for that would align with the inferred daily bias. Example: 'If bias is bullish, look for LTF accumulation patterns or a break of structure upwards after a pullback.'"),
  openingPriceConfluence: z.string().optional().describe("Observations about how price is reacting relative to visually apparent opening price levels (if discernible). Example: 'Price is currently trading below what might be the weekly open, aligning with a bullish bias if entries are sought at a discount.'"),
});

const AnalyzeCandlestickChartOutputSchema = z.object({
  trend: z.string().describe('The identified trend in the candlestick chart.'),
  patterns: z.array(z.string()).describe('The candlestick patterns identified in the chart.'),
  summary: z.string().describe('A summary of the analysis of the candlestick chart, incorporating daily bias insights.'),
  ictElements: z.array(ICTElementSchema).optional().describe("Key ICT elements identified visually on the chart, such as Order Blocks or Fair Value Gaps."),
  marketStructureAnalysis: z.string().optional().describe("Observations on market structure like Break of Structure (BOS) or Change of Character (CHoCH), if visually discernible."),
  potentialAMDCycle: z.object({
    phase: z.enum(["Accumulation", "Manipulation", "Distribution (Markup)", "Distribution (Markdown)", "Unclear"]).optional().describe("The potential AMD phase observed or suggested by the chart."),
    reasoning: z.string().optional().describe("Brief reasoning for the potential AMD phase identification.")
  }).optional().describe("A conceptual observation about a potential Accumulation, Manipulation, Distribution (AMD) cycle phase suggested by the chart's price action."),
  inferredDailyBias: z.enum(["Bullish", "Bearish", "Neutral", "Unclear"]).optional().describe("The overall daily bias inferred from the visual analysis using the structured Daily Bias Determination framework."),
  dailyBiasReasoning: DailyBiasReasoningSchema.optional().describe("Detailed reasoning for the inferred daily bias based on visual interpretation of the chart according to the Daily Bias Determination steps.")
});
export type AnalyzeCandlestickChartOutput = z.infer<typeof AnalyzeCandlestickChartOutputSchema>;

export async function analyzeCandlestickChart(input: AnalyzeCandlestickChartInput): Promise<AnalyzeCandlestickChartOutput> {
  return analyzeCandlestickChartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCandlestickChartPrompt',
  input: {schema: AnalyzeCandlestickChartInputSchema},
  output: {schema: AnalyzeCandlestickChartOutputSchema},
  prompt: `You are an expert financial analyst specializing in candlestick chart pattern recognition, Inner Circle Trader (ICT) concepts, and determining Daily Market Bias.

Analyze the provided candlestick chart image. Your goal is to perform a comprehensive analysis, including determining a conceptual Daily Bias.

**Analysis Steps:**

1.  **Overall Trend:** Determine the prevailing market trend visually (e.g., Uptrend, Downtrend, Sideways).
2.  **Candlestick Patterns:** Identify any significant candlestick patterns visible (e.g., Hammer, Engulfing, Doji). List them.
3.  **ICT Elements:** Visually identify and describe key ICT elements. For each element found, specify its type and provide a brief description of its location. Consider:
    *   Order Block (Bullish/Bearish)
    *   Fair Value Gap (Bullish/Bearish)
    *   Liquidity Pool (Buy-side/Sell-side)
4.  **Market Structure:** Briefly comment on any visible market structure features like a Break of Structure (BOS) or a Change of Character (CHoCH).
5.  **Potential AMD Cycle Observation:** Suggest if the chart might be part of an Accumulation, Manipulation, or Distribution (Markup/Markdown) phase. Provide brief reasoning.

6.  **Daily Bias Determination (Conceptual & Visual):**
    Apply the following framework based *only on the visual information from the chart image*. Since exact numerical data for previous candles or opening prices is not provided, make conceptual observations.
    *   **Step 1: Identify IRL/ERL Draw (Visual):**
        *   Examine the chart. Does price appear to have recently tapped into a visually obvious FVG (IRL) or taken out a significant high/low (ERL)?
        *   Based on this, what is the next *likely* draw on liquidity visually? (e.g., "Price has cleared a visible swing high (ERL), next draw could be a prominent FVG below (IRL)").
        *   Populate \`dailyBiasReasoning.drawOnLiquidityAnalysis\`.
    *   **Step 2: Analyze Time-Based Liquidity (Visual):**
        *   Focus on what appear to be the most recent significant previous weekly or daily candle(s) visible in the chart.
        *   Is price showing clear displacement past these visually apparent highs/lows, or is it sweeping them without strong follow-through?
        *   Example: "The chart shows price strongly breaking above the high of the last large candle, suggesting continuation." or "Price wicked above the prior candle's high and closed lower, indicating a potential sweep and reversal."
        *   Populate \`dailyBiasReasoning.timeBasedLiquidityAnalysis\`.
    *   **Step 3: Look for LTF Structure Confirmation (Conceptual Outlook):**
        *   Based on your inferred HTF bias from steps 1 & 2, what kind of Lower Timeframe (LTF) market structure would conceptually confirm this bias if one were to zoom in (even if the current chart isn't LTF)?
        *   Example: "If the inferred bias is bearish, one might look for LTF distribution patterns or a break of LTF swing lows."
        *   Populate \`dailyBiasReasoning.ltfConfirmationOutlook\`.
    *   **Step 4: Use Opening Prices for Confluence (Visual/Conceptual, Optional):**
        *   Are there any price levels on the chart that *visually resemble* significant opening prices (e.g., a clear consolidation point from which a new major candle might have started)?
        *   How is current price reacting relative to these *visually inferred* opening price levels?
        *   Example: "Price is currently trading above a level that looks like a daily open, which would support a bullish entry if seeking discount."
        *   If no clear visual cues for opening prices exist, state that.
        *   Populate \`dailyBiasReasoning.openingPriceConfluence\`.
    *   **Infer Daily Bias:** Based on the synthesis of all visual information and the daily bias determination steps, state the \`inferredDailyBias\` (Bullish, Bearish, Neutral, or Unclear).

7.  **Summary:** Provide a concise overall summary of your analysis, integrating findings from all the above points, especially the inferred daily bias and its reasoning.

Analyze the following candlestick chart:
{{media url=chartDataUri}}

Output MUST be in JSON format according to the defined output schema. If specific elements (ICT, market structure, AMD phase, or parts of daily bias reasoning) are not clearly discernible from the image, you may omit those fields, return empty arrays/strings, or state "Unclear" or "Not visually apparent". For dailyBiasReasoning, provide textual descriptions for each step.
`,
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

    