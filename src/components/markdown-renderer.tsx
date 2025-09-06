'use client';

interface MarkdownRendererProps {
  content: string;
}

// A simple utility to convert markdown-like syntax to HTML
function simpleMarkdownToHtml(markdown: string) {
  if (!markdown) return '';

  return markdown
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold font-headline mb-6">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold font-headline mt-8 mb-4 border-b pb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold font-headline mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
    .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
    .replace(/(<li.*>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/\n/g, '<br />')
    .replace(/<br \/>(\s*<br \/>)+/g, '<br /><br />') // Collapse multiple breaks
    .replace(/<br \/>\s*(<h[1-6]>|<ul)/g, '$1') // Remove breaks before headings or lists
    .replace(/(<\/h[1-6]>|<\/ul>)\s*<br \/>/g, '$1'); // Remove breaks after headings or lists
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const htmlContent = simpleMarkdownToHtml(content);

  return (
    <div
      className="prose dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
