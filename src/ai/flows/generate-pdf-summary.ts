'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a concise summary of a PDF document.
 *
 * - generatePdfSummary - The main function to generate the PDF summary.
 * - GeneratePdfSummaryInput - The input type for the generatePdfSummary function.
 * - GeneratePdfSummaryOutput - The output type for the generatePdfSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePdfSummaryInputSchema = z.object({
  pdfText: z.string().describe('The extracted text content from the PDF document.'),
});
export type GeneratePdfSummaryInput = z.infer<typeof GeneratePdfSummaryInputSchema>;

const GeneratePdfSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the PDF document, formatted in markdown.'),
});
export type GeneratePdfSummaryOutput = z.infer<typeof GeneratePdfSummaryOutputSchema>;

export async function generatePdfSummary(input: GeneratePdfSummaryInput): Promise<GeneratePdfSummaryOutput> {
  return generatePdfSummaryFlow(input);
}

const pdfSummaryPrompt = ai.definePrompt({
  name: 'pdfSummaryPrompt',
  input: {schema: GeneratePdfSummaryInputSchema},
  output: {schema: GeneratePdfSummaryOutputSchema},
  prompt: `Summarize the following PDF content in a concise manner. The output should be formatted in markdown, with a main heading for the summary and subheadings for key sections. Use paragraphs and lists to structure the content for readability.

PDF Content:
{{{pdfText}}}`, 
});

const generatePdfSummaryFlow = ai.defineFlow(
  {
    name: 'generatePdfSummaryFlow',
    inputSchema: GeneratePdfSummaryInputSchema,
    outputSchema: GeneratePdfSummaryOutputSchema,
  },
  async input => {
    const {output} = await pdfSummaryPrompt(input);
    return output!;
  }
);
