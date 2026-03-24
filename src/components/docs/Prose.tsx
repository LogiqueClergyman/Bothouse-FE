import React from "react";

export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        "prose prose-invert prose-headings:text-white prose-a:text-brand-primary prose-code:text-brand-primary prose-pre:bg-brand-surface prose-pre:border prose-pre:border-brand-border max-w-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
