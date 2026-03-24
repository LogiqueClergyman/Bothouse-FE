import React from "react";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  language: string;
  code: string;
  title?: string;
}

export function CodeBlock({ language, code, title }: CodeBlockProps) {
  return (
    <div className="my-4 rounded-card border border-brand-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-brand-surface border-b border-brand-border">
        <div className="flex items-center gap-3">
          {title && <span className="text-sm text-gray-300">{title}</span>}
          <span className="text-xs font-mono text-brand-primary bg-brand-bg px-2 py-0.5 rounded border border-brand-border">
            {language}
          </span>
        </div>
        <CopyButton code={code} />
      </div>
      <pre className="bg-brand-surface overflow-x-auto p-4 m-0">
        <code className="font-mono text-sm text-gray-200 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
