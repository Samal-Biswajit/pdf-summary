'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Loader2, XCircle, FileCheck2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

import { Card, CardContent } from '@/components/ui/card';

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
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        return;
      }

      setError(null);
      setIsExtracting(true);
      setIsLoading(true);
      setFileName(file.name);

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

        onTextExtracted(fullText.trim());
      } catch (err) {
        console.error('Error extracting text:', err);
        setError('Failed to process PDF. Please ensure it is a valid file and not corrupted.');
        setIsExtracting(false);
        setIsLoading(false);
        setFileName(null);
      }
    },
    [onTextExtracted, setIsLoading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isExtracting,
  });

  return (
    <Card className="w-full max-w-lg mx-auto border-dashed border-2 hover:border-primary transition-colors duration-300">
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center h-64 rounded-lg cursor-pointer
          ${isDragActive ? 'bg-accent' : 'bg-transparent'}`}
        >
          <input {...getInputProps()} />
          {isExtracting ? (
             <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="font-semibold text-foreground">Extracting text...</p>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          ) : (
            <div className="text-center p-8">
              {fileName ? (
                <>
                  <FileCheck2 className="mx-auto h-12 w-12 text-green-500" />
                  <p className="mt-2 font-semibold text-foreground">{fileName}</p>
                  <p className="text-sm text-muted-foreground">Ready to be analyzed.</p>
                </>
              ) : (
                <>
                  <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-semibold text-foreground">
                    {isDragActive
                      ? 'Drop the PDF here...'
                      : 'Drag & drop a PDF file, or click to select'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Max file size 20MB
                  </p>
                </>
              )}
              {error && (
                <div className="mt-4 flex items-center justify-center gap-2 text-destructive">
                  <XCircle className="h-4 w-4" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
