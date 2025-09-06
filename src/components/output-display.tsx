'use client';

import { BookText, BrainCircuit, ClipboardCheck, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from './markdown-renderer';
import InteractiveQuiz, { type QuizData } from './interactive-quiz';

interface OutputDisplayProps {
  summary: string;
  strategy: string;
  quiz: QuizData;
  onReset: () => void;
}

export default function OutputDisplay({
  summary,
  strategy,
  quiz,
  onReset,
}: OutputDisplayProps) {
  
  return (
    <div className="w-full transition-opacity duration-500 animate-in fade-in">
      <Tabs defaultValue="summary" className="min-h-[600px]">
        <div className="flex justify-between items-start mb-6">
          <TabsList className="bg-muted/80">
            <TabsTrigger value="summary">
              <BookText className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="strategy">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Strategy
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Quiz
            </TabsTrigger>
          </TabsList>
          <Button variant="ghost" onClick={onReset} className="text-sm text-muted-foreground">
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </div>
        
        <TabsContent value="summary">
          <MarkdownRenderer content={summary} />
        </TabsContent>
        <TabsContent value="strategy">
          <MarkdownRenderer content={strategy} />
        </TabsContent>
        <TabsContent value="quiz">
          <InteractiveQuiz quizData={quiz} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
