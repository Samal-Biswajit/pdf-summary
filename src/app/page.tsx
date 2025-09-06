'use client';

import { useState } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';

import { generatePdfSummary } from '@/ai/flows/generate-pdf-summary';
import { generateWeeklyStrategy } from '@/ai/flows/generate-weekly-strategy';
import { generateQuizQuestions, type GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';

import PdfUploader from '@/components/pdf-uploader';
import OutputDisplay from '@/components/output-display';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type AppState = 'initial' | 'loading' | 'results' | 'error';
type QuizData = GenerateQuizQuestionsOutput['quiz'];


export default function Home() {
  const [summary, setSummary] = useState('');
  const [strategy, setStrategy] = useState('');
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [appState, setAppState] = useState<AppState>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const handleTextExtracted = async (text: string) => {
    if (!text) {
      setErrorMessage('Could not extract text from the PDF. It might be empty or image-based.');
      setAppState('error');
      return;
    }

    setAppState('loading');
    setErrorMessage('');

    try {
      const [summaryRes, strategyRes, quizRes] = await Promise.all([
        generatePdfSummary({ pdfText: text }),
        generateWeeklyStrategy({ pdfText: text }),
        generateQuizQuestions({ pdfText: text }),
      ]);

      if (summaryRes.summary && strategyRes.weeklyStrategy && quizRes.quiz) {
        setSummary(summaryRes.summary);
        setStrategy(strategyRes.weeklyStrategy);
        setQuiz(quizRes.quiz);
        setAppState('results');
      } else {
        throw new Error('One or more AI generation steps failed to return content.');
      }
    } catch (e) {
      console.error(e);
      const error = e instanceof Error ? e.message : 'An unknown error occurred.';
      setErrorMessage(
        `An error occurred while analyzing the document: ${error}. Please try again.`
      );
      setAppState('error');
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was a problem generating insights from your document.',
      });
    }
  };

  const handleReset = () => {
    setSummary('');
    setStrategy('');
    setQuiz(null);
    setErrorMessage('');
    setAppState('initial');
  };

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingState />;
      case 'results':
        return (
          quiz && <OutputDisplay
            summary={summary}
            strategy={strategy}
            quiz={quiz}
            onReset={handleReset}
          />
        );
      case 'error':
        return (
          <ErrorState message={errorMessage} onReset={handleReset} />
        );
      case 'initial':
      default:
        return (
          <PdfUploader
            onTextExtracted={handleTextExtracted}
            setIsLoading={(isLoading) => setAppState(isLoading ? 'loading' : 'initial')}
          />
        );
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex flex-col items-center text-center mb-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-lg">
              <BookOpen size={24} className="text-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
              PDF Insights
            </h1>
          </div>
          <p className="max-w-2xl text-muted-foreground md:text-lg">
            Upload a PDF to instantly generate a concise summary, an actionable
            weekly plan, and a helpful quiz.
          </p>
        </header>

        <div className="w-full min-h-[500px] flex items-center justify-center">{renderContent()}</div>

        <footer className="text-center text-sm text-muted-foreground mt-10">
          <p>&copy; {new Date().getFullYear()} PDF Insights. Powered by Gemini.</p>
        </footer>
      </div>
    </main>
  );
}

const LoadingState = () => (
  <Card className="w-full border-none shadow-none">
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex items-center space-x-3 text-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-lg font-semibold font-headline">
            Analyzing your document...
          </p>
        </div>
        <p className="text-muted-foreground max-w-md">
          This may take a moment. We're reading your document and generating a summary, a weekly strategy, and a custom quiz just for you.
        </p>
      </div>
      <div className="space-y-6 mt-10">
        <div className="space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
         <div className="space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ message, onReset }: { message: string, onReset: () => void }) => (
    <Card className="border-destructive/50 bg-destructive/5 w-full">
        <CardContent className="p-8 text-center">
            <h3 className="text-xl font-headline font-semibold text-destructive mb-2">Analysis Failed</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{message}</p>
            <Button onClick={onReset} variant="destructive" className="bg-destructive/90">
                Upload another file
            </Button>
        </CardContent>
    </Card>
);
