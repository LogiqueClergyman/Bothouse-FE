import React from "react";

type InfoBoxType = "info" | "warning" | "danger";

interface InfoBoxProps {
  type: InfoBoxType;
  title?: string;
  children: React.ReactNode;
}

const typeStyles: Record<InfoBoxType, { border: string; bg: string; title: string; icon: string }> = {
  info: {
    border: "border-l-brand-primary",
    bg: "bg-brand-surface",
    title: "text-brand-primary",
    icon: "ℹ",
  },
  warning: {
    border: "border-l-brand-warning",
    bg: "bg-brand-surface",
    title: "text-brand-warning",
    icon: "⚠",
  },
  danger: {
    border: "border-l-brand-error",
    bg: "bg-brand-surface",
    title: "text-brand-error",
    icon: "✕",
  },
};

export function InfoBox({ type, title, children }: InfoBoxProps) {
  const styles = typeStyles[type];
  return (
    <div
      className={`border-l-4 ${styles.border} ${styles.bg} rounded-r-card px-4 py-3 my-4`}
    >
      {title && (
        <div className={`font-semibold text-sm mb-1 ${styles.title} flex items-center gap-1`}>
          <span>{styles.icon}</span>
          <span>{title}</span>
        </div>
      )}
      <div className="text-sm text-gray-300">{children}</div>
    </div>
  );
}
