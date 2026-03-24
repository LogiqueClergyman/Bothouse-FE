"use client";
import React, { useState } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface EndpointCardProps {
  method: HttpMethod;
  path: string;
  description: string;
  auth?: string;
  children?: React.ReactNode;
}

const methodColors: Record<HttpMethod, string> = {
  GET: "bg-green-900 text-green-300 border border-green-700",
  POST: "bg-blue-900 text-blue-300 border border-blue-700",
  PUT: "bg-yellow-900 text-yellow-300 border border-yellow-700",
  DELETE: "bg-red-900 text-red-300 border border-red-700",
};

export function EndpointCard({ method, path, description, auth, children }: EndpointCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-brand-border rounded-card mb-3 overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-brand-surface hover:bg-brand-bg transition-colors text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${methodColors[method]}`}>
          {method}
        </span>
        <span className="font-mono text-sm text-white flex-1">{path}</span>
        {auth && (
          <span className="text-xs text-brand-primary border border-brand-primary px-2 py-0.5 rounded font-mono">
            {auth}
          </span>
        )}
        <span className="text-gray-400 text-xs ml-2">{open ? "▲" : "▼"}</span>
      </button>
      <div className="px-4 pb-1 bg-brand-surface border-t border-brand-border">
        <p className="text-sm text-gray-400 py-2">{description}</p>
      </div>
      {open && children && (
        <div className="px-4 pb-4 bg-brand-bg border-t border-brand-border">
          {children}
        </div>
      )}
    </div>
  );
}
