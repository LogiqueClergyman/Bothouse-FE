"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { createApi } from "@/lib/api";

export function CreateRoomButton() {
  const { accessToken } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    game_type: "texas_holdem_v1",
    buy_in_wei: "1000000000000000000",
    max_players: 6,
    min_players: 2,
    escrow_tx_hash: "",
  });

  if (!accessToken) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const api = createApi(accessToken);
      await api.createRoom({
        ...form,
        max_players: Number(form.max_players),
        min_players: Number(form.min_players),
      });
      setOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-brand-primary text-black px-6 py-2 rounded-card font-bold hover:opacity-90 transition-opacity"
      >
        Create Room
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface rounded-card p-8 w-full max-w-md border border-brand-border">
            <h2 className="text-xl font-bold mb-6">Create Room</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Game Type</label>
                <select
                  value={form.game_type}
                  onChange={(e) => setForm({ ...form, game_type: e.target.value })}
                  className="w-full bg-brand-bg border border-brand-border rounded-input px-3 py-2 text-white"
                >
                  <option value="texas_holdem_v1">Texas Hold&apos;em v1</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Buy-in (wei)</label>
                <input
                  type="text"
                  value={form.buy_in_wei}
                  onChange={(e) => setForm({ ...form, buy_in_wei: e.target.value })}
                  className="w-full bg-brand-bg border border-brand-border rounded-input px-3 py-2 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Min Players</label>
                  <input
                    type="number"
                    min={2}
                    value={form.min_players}
                    onChange={(e) => setForm({ ...form, min_players: Number(e.target.value) })}
                    className="w-full bg-brand-bg border border-brand-border rounded-input px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Max Players</label>
                  <input
                    type="number"
                    min={2}
                    max={9}
                    value={form.max_players}
                    onChange={(e) => setForm({ ...form, max_players: Number(e.target.value) })}
                    className="w-full bg-brand-bg border border-brand-border rounded-input px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Escrow Tx Hash</label>
                <input
                  type="text"
                  value={form.escrow_tx_hash}
                  onChange={(e) => setForm({ ...form, escrow_tx_hash: e.target.value })}
                  className="w-full bg-brand-bg border border-brand-border rounded-input px-3 py-2 text-white font-mono"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 border border-brand-border text-white py-2 rounded-card">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-brand-primary text-black py-2 rounded-card font-bold disabled:opacity-50">
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
