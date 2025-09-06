# **App Name**: PDF Insights

## Core Features:

- PDF Upload and Text Extraction: Allows users to upload PDF documents and extracts text for analysis.
- AI-Powered Summary: Generates a concise summary of the uploaded PDF document using the Gemini 2.5 Pro API. LLM is a tool here because it may decide to focus on some topics over others, to satisfy length constraints.
- Weekly Strategy Generator: Generates a 7-day actionable strategy based on the PDF content using Gemini 2.5 Pro. The LLM is a tool here because it uses reasoning to propose a sequence of activities.
- Quiz Question Generation: Automatically generates quiz questions (MCQs or short-answer) from the PDF content, powered by Gemini 2.5 Pro. The LLM is a tool because the selection of questions involves reasoning.
- Downloadable Outputs: Users can download or copy the generated summary, weekly strategy, and quiz questions.

## Style Guidelines:

- Primary color: A calm, trustworthy blue (#4681C4) reminiscent of academic settings and intellectual work.
- Background color: A very light blue (#EBF4FA), almost white, providing a clean and unobtrusive backdrop for content.
- Accent color: A complementary teal (#377A80), used sparingly for interactive elements and key actions, adds a touch of vibrancy without overwhelming the user.
- Body text: 'PT Sans', a versatile sans-serif for comfortable reading.
- Headline font: 'Space Grotesk', for headlines. If the headline is too long to fit nicely, allow line-wrapping.
- A clean, single-page layout that prioritizes ease of navigation and content consumption. Clear sections for upload, processing, and results.
- Subtle transitions and loading animations to enhance user experience without being distracting. For example, a progress bar during PDF processing.