'use server';

/**
 * @fileOverview Predicts market movement based on candlestick chart analysis.
 *
 * - predictMarketMovement - Predicts market movements from candlestick chart images.
 * - PredictMarketMovementInput - Input type for the predictMarketMovement function.
 * - PredictMarketMovementOutput - Return type for the predictMarketMovement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictMarketMovementInputSchema = z.object({
  candlestickChartDataUri: z
    .string()
    .describe(
      "A photo of a candlestick chart, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PredictMarketMovementInput = z.infer<typeof PredictMarketMovementInputSchema>;

const PredictMarketMovementOutputSchema = z.object({
  prediction: z.object({
    priceTarget: z.number().describe('The predicted price target.'),
    stopLossLevel: z.number().describe('The recommended stop-loss level.'),
    confidenceLevel: z
      .number()
      .describe('The confidence level of the prediction (0-1).'),
    marketDirection: z
      .enum(['UP', 'DOWN', 'NEUTRAL'])
      .describe('Predicted direction of market movement'),
    rationale: z.string().describe('Explanation of why the model made this prediction'),
  }),
});
export type PredictMarketMovementOutput = z.infer<typeof PredictMarketMovementOutputSchema>;

export async function predictMarketMovement(
  input: PredictMarketMovementInput
): Promise<PredictMarketMovementOutput> {
  return predictMarketMovementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictMarketMovementPrompt',
  input: {schema: PredictMarketMovementInputSchema},
  output: {schema: PredictMarketMovementOutputSchema},
  prompt: `You are an expert financial analyst specializing in candlestick pattern analysis. Analyze the provided candlestick chart image and predict future market movements.

Provide a prediction including price target, stop-loss level, confidence level (0-1), predicted direction (UP, DOWN, or NEUTRAL), and a brief rationale.

Candlestick Chart: {{media url=candlestickChartDataUri}}

Consider various technical indicators, chart patterns, and the overall market context to make the most accurate prediction possible.

Output MUST be in JSON format.
`,
});

const predictMarketMovementFlow = ai.defineFlow(
  {
    name: 'predictMarketMovementFlow',
    inputSchema: PredictMarketMovementInputSchema,
    outputSchema: PredictMarketMovementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
