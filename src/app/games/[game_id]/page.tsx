"use client";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PokerTable } from "@/components/games/PokerTable";
import { ActionLog } from "@/components/games/ActionLog";
import { GameResultBanner } from "@/components/games/GameResultBanner";
import { usePolling } from "@/hooks/usePolling";
import { createApi } from "@/lib/api";
import type { SpectatorView, GameLogResponse } from "@/types";

export default function GameSpectatorPage() {
  const params = useParams<{ game_id: string }>();
  const gameId = params.game_id;

  const { data: spectator } = usePolling<SpectatorView>(
    ["spectate", gameId],
    () => createApi().spectateGame(gameId),
    1_000
  );

  const { data: logData } = usePolling<GameLogResponse>(
    ["game-log", gameId],
    () => createApi().getGameLog(gameId),
    2_000
  );

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {spectator?.status === "completed" && logData?.result && (
          <GameResultBanner result={logData.result} />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PokerTable spectator={spectator ?? null} />
          </div>
          <div>
            <ActionLog log={logData?.log ?? []} />
          </div>
        </div>
      </main>
    </div>
  );
}
