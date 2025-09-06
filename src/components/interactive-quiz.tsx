'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';

export type QuizData = GenerateQuizQuestionsOutput['quiz'];

interface InteractiveQuizProps {
  quizData: QuizData;
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export default function InteractiveQuiz({ quizData }: InteractiveQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (answerState !== 'unanswered') return;

    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.answerIndex;
    if (isCorrect) {
      setAnswerState('correct');
      setScore(score + 1);
    } else {
      setAnswerState('incorrect');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setAnswerState('unanswered');
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswerState('unanswered');
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold font-headline mb-4">Quiz Completed!</h2>
          <p className="text-lg text-muted-foreground mb-6">
            You scored <span className="font-bold text-primary">{score}</span> out of{' '}
            {quizData.questions.length}.
          </p>
          <Button onClick={handleRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardHeader className="pt-0">
        <CardTitle className="text-2xl font-bold font-headline">{quizData.title}</CardTitle>
        <div className="flex items-center gap-4 pt-2">
            <Progress value={(currentQuestionIndex / quizData.questions.length) * 100} className="w-full" />
            <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Question {currentQuestionIndex + 1} / {quizData.questions.length}
            </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium mb-6">{currentQuestion.question}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = currentQuestion.answerIndex === index;

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={answerState !== 'unanswered'}
                className={cn(
                  'w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between',
                  'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  answerState === 'unanswered' && 'bg-background',
                  isSelected && answerState === 'correct' && 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-300',
                  isSelected && answerState === 'incorrect' && 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-300',
                  answerState !== 'unanswered' && !isSelected && isCorrect && 'bg-green-100 dark:bg-green-900/50 border-green-500',
                  answerState !== 'unanswered' ? 'cursor-not-allowed' : 'cursor-pointer'
                )}
              >
                <span>{option}</span>
                {answerState !== 'unanswered' && isSelected && (isCorrect ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />)}
                {answerState !== 'unanswered' && !isSelected && isCorrect && <Check className="h-5 w-5 text-green-600" />}

              </button>
            );
          })}
        </div>
        {answerState !== 'unanswered' && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg animate-in fade-in">
            <p className="font-semibold">{answerState === 'correct' ? 'Correct!' : 'Incorrect.'}</p>
            <p className="text-sm text-muted-foreground mt-1">{currentQuestion.explanation}</p>
            <Button onClick={handleNextQuestion} className="mt-4 w-full">
              {currentQuestionIndex < quizData.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
