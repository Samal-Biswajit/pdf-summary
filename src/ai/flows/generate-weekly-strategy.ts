'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a 7-day actionable strategy based on the content of a PDF document.
 *
 * - generateWeeklyStrategy -  A function that takes PDF content as input and returns a 7-day strategy.
 * - GenerateWeeklyStrategyInput - The input type for the generateWeeklyStrategy function.
 * - GenerateWeeklyStrategyOutput - The return type for the generateWeeklyStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWeeklyStrategyInputSchema = z.object({
  pdfText: z.string().describe('The extracted text content from the PDF document.'),
});
export type GenerateWeeklyStrategyInput = z.infer<typeof GenerateWeeklyStrategyInputSchema>;

const GenerateWeeklyStrategyOutputSchema = z.object({
  weeklyStrategy: z.string().describe('A 7-day actionable strategy derived from the PDF content.'),
});
export type GenerateWeeklyStrategyOutput = z.infer<typeof GenerateWeeklyStrategyOutputSchema>;

export async function generateWeeklyStrategy(input: GenerateWeeklyStrategyInput): Promise<GenerateWeeklyStrategyOutput> {
  return generateWeeklyStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklyStrategyPrompt',
  input: {schema: GenerateWeeklyStrategyInputSchema},
  output: {schema: GenerateWeeklyStrategyOutputSchema},
  prompt: `You are an expert in creating actionable weekly strategies based on document content.

  Analyze the following PDF content and generate a detailed 7-day strategy that the user can implement.

  PDF Content: {{{pdfText}}}
  `,
});

const generateWeeklyStrategyFlow = ai.defineFlow(
  {
    name: 'generateWeeklyStrategyFlow',
    inputSchema: GenerateWeeklyStrategyInputSchema,
    outputSchema: GenerateWeeklyStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
