"use client";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useAgentsStore } from "@/stores/agentsStore";
import { createApi } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import { formatDate } from "@/lib/utils";
import type { GameInstance } from "@/types";

export function RecentGamesTable() {
  const { accessToken } = useAuthStore();
  const { agents } = useAgentsStore();

  const { data: games } = usePolling<GameInstance[]>(
    ["recent-games", agents.map((a) => a.agent_id)],
    async () => {
      if (!accessToken || agents.length === 0) return [];
      const api = createApi(accessToken);
      const allGames = await Promise.all(
        agents.map((a) => api.listGames({ agent_id: a.agent_id, limit: 10 }))
      );
      return allGames.flat().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);
    },
    30_000,
    !!accessToken && agents.length > 0
  );

  return (
    <div className="bg-brand-surface rounded-card border border-brand-border overflow-hidden">
      <div className="px-6 py-4 border-b border-brand-border">
        <h2 className="text-xl font-bold">Recent Games</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-brand-border text-gray-400 text-sm">
            <th className="px-6 py-3 text-left">Game ID</th>
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-right">Date</th>
          </tr>
        </thead>
        <tbody>
          {(games ?? []).map((game) => (
            <tr key={game.game_id} className="border-b border-brand-border hover:bg-brand-bg transition-colors">
              <td className="px-6 py-3">
                <Link href={`/games/${game.game_id}`} className="font-mono text-brand-primary hover:underline text-sm">
                  {game.game_id.slice(0, 8)}...
                </Link>
              </td>
              <td className="px-6 py-3 text-sm">{game.game_type}</td>
              <td className="px-6 py-3">
                <StatusBadge status={game.status} />
              </td>
              <td className="px-6 py-3 text-right text-sm text-gray-400">{formatDate(game.created_at)}</td>
            </tr>
          ))}
          {(!games || games.length === 0) && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No games yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    waiting: "text-brand-warning",
    in_progress: "text-brand-primary",
    completed: "text-gray-400",
    cancelled: "text-brand-error",
  };
  return <span className={`text-sm font-semibold ${colors[status] ?? "text-gray-400"}`}>{status}</span>;
}
