import { config } from 'dotenv';
config();

import '@/ai/flows/generate-weekly-strategy.ts';
import '@/ai/flows/generate-quiz-questions.ts';
import '@/ai/flows/generate-pdf-summary.ts';