'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Loader2, XCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';

// Set up the PDF.js worker from a CDN to avoid build configuration issues.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

interface PdfUploaderProps {
  onTextExtracted: (text: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export default function PdfUploader({
  onTextExtracted,
  setIsLoading,
}: PdfUploaderProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        return;
      }

      setError(null);
      setIsExtracting(true);
      setIsLoading(true);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        let fullText = '';

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => ('str' in item ? item.str : '')).join(' ');
          fullText += pageText + '\n';
        }

        onTextExtracted(fullText);
      } catch (err) {
        console.error('Error extracting text:', err);
        setError('Failed to process PDF. Please ensure it is a valid file.');
        setIsExtracting(false);
        setIsLoading(false);
      }
    },
    [onTextExtracted, setIsLoading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <Card>
      <CardContent className="p-6">
        {isExtracting ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-semibold">Extracting text from PDF...</p>
            <p className="text-sm text-muted-foreground">Please wait a moment.</p>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed
            cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-accent/50' : 'border-border hover:border-primary/50'}`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-semibold">
                {isDragActive
                  ? 'Drop the PDF here...'
                  : 'Drag & drop a PDF here, or click to select'}
              </p>
              <p className="text-sm text-muted-foreground">
                Max file size 20MB
              </p>
              {error && (
                <div className="mt-4 flex items-center justify-center gap-2 text-destructive">
                  <XCircle className="h-4 w-4" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
