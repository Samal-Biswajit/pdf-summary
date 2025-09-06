'use server';

/**
 * @fileOverview A quiz question generation AI agent.
 *
 * - generateQuizQuestions - A function that handles the quiz question generation process.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  pdfText: z.string().describe('The text extracted from the PDF document.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('An array of 4 multiple-choice options.'),
  answerIndex: z.number().describe('The 0-based index of the correct answer in the options array.'),
  explanation: z.string().describe('A brief explanation for the correct answer.'),
});

const GenerateQuizQuestionsOutputSchema = z.object({
  quiz: z.object({
    title: z.string().describe('A title for the quiz.'),
    questions: z.array(QuizQuestionSchema).describe('An array of 10 quiz questions.'),
  }),
});

export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(
  input: GenerateQuizQuestionsInput
): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an expert educator specializing in generating engaging and challenging quiz questions from documents.

You will use the content of the document provided to generate a quiz with a title and a set of 10 multiple-choice questions that assess the user's understanding of the material. Each question must have exactly 4 options.

Document Content: {{{pdfText}}}`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
