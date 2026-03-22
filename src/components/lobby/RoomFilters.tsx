"use client";
import { useLobbyStore } from "@/stores/lobbyStore";

const GAME_TYPES = ["texas_holdem_v1"];
const STATUSES = ["open", "starting", "in_progress", "completed"];

export function RoomFilters() {
  const { filters, setFilters } = useLobbyStore();
  return (
    <div className="flex gap-4 mb-6">
      <select
        value={filters.game_type ?? ""}
        onChange={(e) => setFilters({ game_type: e.target.value || undefined })}
        className="bg-brand-surface border border-brand-border rounded-input px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
      >
        <option value="">All Game Types</option>
        {GAME_TYPES.map((gt) => (
          <option key={gt} value={gt}>{gt}</option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value })}
        className="bg-brand-surface border border-brand-border rounded-input px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
