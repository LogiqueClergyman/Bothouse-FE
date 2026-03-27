"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { createApi } from "@/lib/api";
import { weiToEth } from "@/lib/utils";
import type { RoomWithSeats } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  open: "text-brand-primary",
  starting: "text-brand-warning",
  in_progress: "text-brand-warning",
  completed: "text-gray-400",
  cancelled: "text-brand-error",
};

export function RoomCard({ room }: { room: RoomWithSeats }) {
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    if (!accessToken) return alert("Connect wallet first");
    const txHash = prompt("Enter your escrow deposit tx hash:");
    if (!txHash) return;
    setLoading(true);
    setError(null);
    try {
      const api = createApi(accessToken);
      await api.joinRoom(room.room_id, txHash);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-surface rounded-card p-6 border border-brand-border">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-mono text-gray-400">{room.game_type}</span>
        <span className={`text-sm font-semibold ${STATUS_COLORS[room.status] ?? "text-gray-400"}`}>
          {room.status}
        </span>
      </div>
      <div className="text-2xl font-mono font-bold mb-1">{weiToEth(room.buy_in_atomic)}</div>
      <div className="text-sm text-gray-400 mb-4">
        {room.seats.length}/{room.max_players} players
      </div>
      {error && <div className="text-brand-error text-sm mb-2">{error}</div>}
      {room.status === "open" && (
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full bg-brand-primary text-black py-2 rounded-card font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? "Joining..." : "Join"}
        </button>
      )}
    </div>
  );
}
