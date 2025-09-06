'use client';

import { useState } from 'react';
import { FileText, Loader2, Sparkles } from 'lucide-react';

import { generatePdfSummary } from '@/ai/flows/generate-pdf-summary';
import { generateWeeklyStrategy } from '@/ai/flows/generate-weekly-strategy';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';

import PdfUploader from '@/components/pdf-uploader';
import OutputDisplay from '@/components/output-display';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type AppState = 'initial' | 'loading' | 'results' | 'error';

export default function Home() {
  const [summary, setSummary] = useState('');
  const [strategy, setStrategy] = useState('');
  const [quiz, setQuiz] = useState('');
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

      if (summaryRes.summary && strategyRes.weeklyStrategy && quizRes.quizQuestions) {
        setSummary(summaryRes.summary);
        setStrategy(strategyRes.weeklyStrategy);
        setQuiz(quizRes.quizQuestions);
        setAppState('results');
      } else {
        throw new Error('One or more AI generation steps failed.');
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
    setQuiz('');
    setErrorMessage('');
    setAppState('initial');
  };

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingState />;
      case 'results':
        return (
          <OutputDisplay
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
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl shadow-md">
              <FileText size={28} className="text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-slate-800 dark:text-slate-100">
              PDF Insights
            </h1>
          </div>
          <p className="max-w-2xl text-muted-foreground md:text-lg">
            Upload a PDF to instantly generate a concise summary, an actionable
            weekly plan, and a helpful quiz.
          </p>
        </header>

        <div className="w-full">{renderContent()}</div>

        <footer className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PDF Insights. Powered by Gemini.</p>
        </footer>
      </div>
    </main>
  );
}

const LoadingState = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex items-center space-x-2 text-primary">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-xl font-semibold font-headline">
            Analyzing your document...
          </p>
        </div>
        <p className="text-muted-foreground">
          This may take a moment. We're generating your summary, strategy, and
          quiz.
        </p>
      </div>
      <div className="space-y-6 mt-8">
        <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ message, onReset }: { message: string, onReset: () => void }) => (
    <Card className="border-destructive">
        <CardContent className="p-6 text-center">
            <h3 className="text-xl font-headline font-semibold text-destructive mb-2">Analysis Failed</h3>
            <p className="text-muted-foreground mb-4">{message}</p>
            <button onClick={onReset} className="text-sm font-semibold text-primary hover:underline">
                Upload another file
            </button>
        </CardContent>
    </Card>
);
