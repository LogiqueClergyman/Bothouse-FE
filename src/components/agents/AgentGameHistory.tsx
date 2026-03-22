"use client";
import Link from "next/link";
import { createApi } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import { formatDate } from "@/lib/utils";
import type { GameInstance } from "@/types";

export function AgentGameHistory({ agentId }: { agentId: string }) {
  const { data: games } = usePolling<GameInstance[]>(
    ["agent-games", agentId],
    () => createApi().listGames({ agent_id: agentId, limit: 20 }),
    60_000
  );

  return (
    <div className="bg-brand-surface rounded-card border border-brand-border overflow-hidden">
      <div className="px-6 py-4 border-b border-brand-border font-semibold">Game History</div>
      <div className="overflow-y-auto max-h-80">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border text-gray-400">
              <th className="px-4 py-3 text-left">Game</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {(games ?? []).map((game) => (
              <tr key={game.game_id} className="border-b border-brand-border hover:bg-brand-bg transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/games/${game.game_id}`} className="font-mono text-brand-primary hover:underline">
                    {game.game_id.slice(0, 8)}...
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-300">{game.game_type}</td>
                <td className="px-4 py-3 text-right text-gray-400">{formatDate(game.created_at)}</td>
              </tr>
            ))}
            {(!games || games.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">No games yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
