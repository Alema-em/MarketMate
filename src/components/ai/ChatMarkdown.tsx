"use client";

import type { ReactNode } from "react";

/**
 * Lightweight markdown renderer for AI replies (bold, code, lists, headings).
 */
export function ChatMarkdown({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <div className="min-w-0 space-y-3 break-words text-sm leading-relaxed text-foreground/95">
      {blocks.map((block, i) => (
        <Block key={i} text={block.trim()} />
      ))}
    </div>
  );
}

function Block({ text }: { text: string }) {
  if (!text) return null;

  if (text.startsWith("### ")) {
    return (
      <h4 className="font-semibold text-foreground">
        {inlineFormat(text.slice(4))}
      </h4>
    );
  }
  if (text.startsWith("## ")) {
    return (
      <h3 className="font-semibold text-foreground">
        {inlineFormat(text.slice(3))}
      </h3>
    );
  }

  const lines = text.split("\n");
  const bulletPattern = /^[-*\u2022]\s/;
  const isBulletList = lines.every(
    (l) => !l.trim() || bulletPattern.test(l.trim())
  );
  if (isBulletList && lines.some((l) => bulletPattern.test(l.trim()))) {
    return (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">
        {lines
          .filter((l) => bulletPattern.test(l.trim()))
          .map((l, i) => (
            <li key={i}>
              {inlineFormat(l.replace(/^[-*\u2022]\s+/, ""))}
            </li>
          ))}
      </ul>
    );
  }

  const isNumbered = lines.every(
    (l) => !l.trim() || /^\d+\.\s/.test(l.trim())
  );
  if (isNumbered && lines.some((l) => /^\d+\.\s/.test(l.trim()))) {
    return (
      <ol className="list-decimal space-y-1.5 pl-5 marker:text-muted">
        {lines
          .filter((l) => /^\d+\.\s/.test(l.trim()))
          .map((l, i) => (
            <li key={i}>{inlineFormat(l.replace(/^\d+\.\s+/, ""))}</li>
          ))}
      </ol>
    );
  }

  return <p>{inlineFormat(text.replace(/\n/g, " "))}</p>;
}

function inlineFormat(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-xs text-accent"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
