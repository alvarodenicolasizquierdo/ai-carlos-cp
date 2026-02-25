import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe formatting tags only.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'br', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'span', 'div', 'code', 'pre', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: ['class', 'id', 'href', 'target', 'rel'],
  });
}

/**
 * Convert markdown-like content to sanitized HTML.
 * Use this instead of raw regex + dangerouslySetInnerHTML.
 */
export function markdownToSafeHtml(content: string): string {
  const html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
    .replace(/\|/g, ' | ');
  return sanitizeHtml(html);
}
