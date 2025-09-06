'use client';

import { Copy, Download, RotateCcw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

interface OutputDisplayProps {
  summary: string;
  strategy: string;
  quiz: string;
  onReset: () => void;
}

export default function OutputDisplay({
  summary,
  strategy,
  quiz,
  onReset,
}: OutputDisplayProps) {
  const { toast } = useToast();

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied to Clipboard',
      description: `The ${type} has been copied successfully.`,
    });
  };

  const handleDownload = (content: string, type: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pdf_insights_${type.toLowerCase().replace(' ', '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Download Started',
      description: `Your ${type} is being downloaded.`,
    });
  };

  const renderTabContent = (title: string, content: string) => (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed">
            {content}
          </pre>
        </ScrollArea>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => handleCopy(content, title)}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleDownload(content, title)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="w-full">
      <Tabs defaultValue="summary">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="strategy">Weekly Strategy</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>
          <Button variant="ghost" onClick={onReset} className="text-sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            Analyze Another PDF
          </Button>
        </div>
        <TabsContent value="summary">
          {renderTabContent('Document Summary', summary)}
        </TabsContent>
        <TabsContent value="strategy">
          {renderTabContent('Weekly Strategy', strategy)}
        </TabsContent>
        <TabsContent value="quiz">
          {renderTabContent('Quiz Questions', quiz)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
