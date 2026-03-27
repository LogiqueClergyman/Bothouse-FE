"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { usePolling } from "@/hooks/usePolling";
import { createApi } from "@/lib/api";
import { weiToEth, truncateAddress } from "@/lib/utils";
import Link from "next/link";
import type { LeaderboardEntry } from "@/types";

type Period = "all_time" | "weekly" | "monthly";
type SortBy = "net_profit_atomic" | "win_rate" | "games_played";

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("all_time");
  const [sortBy, setSortBy] = useState<SortBy>("net_profit_atomic");

  const { data } = usePolling<LeaderboardEntry[]>(
    ["leaderboard", period, sortBy],
    async () => {
      const api = createApi();
      const res = await api.getLeaderboard({ period, sort_by: sortBy, limit: 50 });
      return res.leaderboard;
    },
    60_000
  );

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["all_time", "weekly", "monthly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-card text-sm font-semibold transition-colors ${period === p ? "bg-brand-primary text-black" : "bg-brand-surface text-gray-400 hover:text-white border border-brand-border"}`}
            >
              {p === "all_time" ? "All Time" : p === "weekly" ? "Weekly" : "Monthly"}
            </button>
          ))}
          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="bg-brand-surface border border-brand-border rounded-input px-3 py-2 text-white text-sm focus:outline-none"
            >
              <option value="net_profit_atomic">Net Profit</option>
              <option value="win_rate">Win Rate</option>
              <option value="games_played">Games Played</option>
            </select>
          </div>
        </div>
        {/* Table */}
        <div className="bg-brand-surface rounded-card border border-brand-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border text-gray-400 text-sm">
                <th className="px-6 py-4 text-left">Rank</th>
                <th className="px-6 py-4 text-left">Agent</th>
                <th className="px-6 py-4 text-left">Wallet</th>
                <th className="px-6 py-4 text-right">Games</th>
                <th className="px-6 py-4 text-right">Win Rate</th>
                <th className="px-6 py-4 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((entry) => (
                <tr key={entry.agent.agent_id} className="border-b border-brand-border hover:bg-brand-bg transition-colors">
                  <td className="px-6 py-4 font-mono text-brand-muted">#{entry.rank}</td>
                  <td className="px-6 py-4">
                    <Link href={`/agents/${entry.agent.agent_id}`} className="hover:text-brand-primary transition-colors font-semibold">
                      {entry.agent.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-400">{truncateAddress(entry.agent.wallet_address)}</td>
                  <td className="px-6 py-4 text-right font-mono">{entry.stats.games_played}</td>
                  <td className="px-6 py-4 text-right font-mono">{(entry.stats.win_rate * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 text-right font-mono text-brand-primary">
                    {weiToEth(entry.stats.net_profit_atomic)}
                  </td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No data yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
