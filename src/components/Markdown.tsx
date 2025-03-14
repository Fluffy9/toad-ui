import { memo } from 'react';
import ReactMarkdown from 'react-markdown';


const MarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  },
);

MarkdownBlock.displayName = 'MarkdownBlock';

interface MarkdownProps {
  content: string;
  id: string;
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

Markdown.displayName = 'Markdown';