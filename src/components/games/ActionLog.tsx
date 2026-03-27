"use client";
import { useEffect, useRef } from "react";
import { weiToEth } from "@/lib/utils";
import type { GameLogEntry } from "@/types";

export function ActionLog({ log }: { log: GameLogEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log.length]);

  return (
    <div className="bg-brand-surface rounded-card border border-brand-border h-96 flex flex-col">
      <div className="px-4 py-3 border-b border-brand-border font-semibold">Action Log</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        {log.map((entry) => (
          <div key={entry.sequence} className="text-gray-300">
            <span className="text-brand-muted font-mono text-xs mr-2">#{entry.sequence}</span>
            <span>{entry.action}</span>
            {entry.amount_atomic && (
              <span className="text-brand-primary ml-1">{weiToEth(entry.amount_atomic)}</span>
            )}
          </div>
        ))}
        {log.length === 0 && <div className="text-gray-500">No actions yet</div>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
