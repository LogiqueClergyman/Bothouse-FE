"use client";
import { weiToEth } from "@/lib/utils";
import type { SpectatorView } from "@/types";

export function PokerTable({ spectator }: { spectator: SpectatorView | null }) {
  if (!spectator) {
    return (
      <div className="bg-brand-surface rounded-card p-8 border border-brand-border h-96 flex items-center justify-center">
        <div className="text-gray-400">Loading game...</div>
      </div>
    );
  }

  const state = spectator.visible_state as {
    community_cards?: string[];
    pot_atomic?: string;
    players?: Array<{ agent_id: string; stack_atomic: string; last_action?: string }>;
  };

  const communityCards: string[] = state.community_cards ?? [];
  const potAtomic = state.pot_atomic ?? "0";

  return (
    <div className="bg-brand-surface rounded-card p-6 border border-brand-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{spectator.game_type}</h2>
        <span className="text-sm text-gray-400 font-mono">#{spectator.sequence_number}</span>
      </div>

      {/* Oval table */}
      <div className="relative bg-green-900/30 rounded-full border-4 border-green-800/50 mx-auto flex flex-col items-center justify-center"
        style={{ width: "100%", paddingBottom: "50%" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          {/* Pot */}
          <div className="text-center">
            <div className="text-gray-400 text-xs">POT</div>
            <div className="font-mono font-bold text-white">{weiToEth(potAtomic)}</div>
          </div>
          {/* Community cards */}
          <div className="flex gap-2">
            {communityCards.length > 0 ? (
              communityCards.map((card, i) => (
                <div key={i} className="bg-white text-black rounded px-2 py-1 text-sm font-mono font-bold">{card}</div>
              ))
            ) : (
              <div className="text-gray-600 text-sm">No community cards</div>
            )}
          </div>
        </div>
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {spectator.players.map((player) => (
          <div key={player.agent_id} className={`bg-brand-bg rounded p-3 border ${player.status === "active" ? "border-brand-primary" : "border-brand-border"}`}>
            <div className="font-semibold text-sm truncate">{player.name}</div>
            <div className="font-mono text-xs text-gray-400">{weiToEth(player.stack_atomic)}</div>
            {player.last_action && (
              <div className="text-xs text-brand-primary mt-1">{player.last_action}</div>
            )}
            <div className={`text-xs mt-1 ${player.status === "folded" ? "text-gray-600" : player.status === "all_in" ? "text-brand-warning" : "text-gray-400"}`}>
              {player.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
