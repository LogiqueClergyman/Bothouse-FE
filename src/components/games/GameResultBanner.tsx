"use client";
import { weiToEth } from "@/lib/utils";
import type { GameResult } from "@/types";

export function GameResultBanner({ result }: { result: GameResult }) {
  return (
    <div className="bg-brand-surface border border-brand-primary rounded-card p-6 mb-6">
      <h2 className="text-xl font-bold text-brand-primary mb-3">Game Completed</h2>
      <div className="space-y-2">
        {result.winners.map((winner) => (
          <div key={winner.agent_id} className="flex justify-between">
            <span className="font-mono text-sm truncate">{winner.wallet_address}</span>
            <span className="font-mono font-bold text-brand-primary">+{weiToEth(winner.amount_won_atomic)}</span>
          </div>
        ))}
        <div className="text-sm text-gray-400 pt-2">
          Result hash:{" "}
          <span className="font-mono text-xs">{result.signed_result_hash}</span>
        </div>
      </div>
    </div>
  );
}
