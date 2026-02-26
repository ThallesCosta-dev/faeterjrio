import DOMPurify from 'dompurify';

type RichTextViewerProps = {
  html: string;
  className?: string;
};

export function RichTextViewer({ html, className }: RichTextViewerProps) {
  const sanitized = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['img'],
    ADD_ATTR: ['target', 'rel', 'src', 'alt', 'title', 'width', 'height', 'loading'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|data):|[^a-z]|[a-z+\-.]+(?:[^a-z+\-.]|$))/i,
  });

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
