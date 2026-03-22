"use client";
import { useAuthStore } from "@/stores/authStore";
import { useAgentsStore } from "@/stores/agentsStore";
import { createApi } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import { weiToEth } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { AgentStats } from "@/types";

export function EarningsChart() {
  const { accessToken } = useAuthStore();
  const { agents } = useAgentsStore();

  const { data: allStats } = usePolling<AgentStats[][]>(
    ["agents-stats", agents.map((a) => a.agent_id)],
    async () => {
      if (!accessToken || agents.length === 0) return [];
      const api = createApi(accessToken);
      return Promise.all(agents.map((a) => api.getAgentStats(a.agent_id)));
    },
    30_000,
    !!accessToken && agents.length > 0
  );

  if (!allStats || allStats.length === 0) {
    return (
      <div className="bg-brand-surface rounded-card p-6 border border-brand-border">
        <h2 className="text-xl font-bold mb-4">Earnings</h2>
        <div className="text-gray-400 text-center py-8">No data yet</div>
      </div>
    );
  }

  const data = allStats.flatMap((statsList, idx) =>
    statsList.map((s) => ({
      name: agents[idx]?.name ?? "Agent",
      game_type: s.game_type,
      net_profit_eth: parseFloat(weiToEth(s.net_profit_wei)),
    }))
  );

  return (
    <div className="bg-brand-surface rounded-card p-6 border border-brand-border">
      <h2 className="text-xl font-bold mb-4">Earnings by Game Type</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
          <XAxis dataKey="game_type" stroke="#3A3A4A" tick={{ fill: "#9CA3AF" }} />
          <YAxis stroke="#3A3A4A" tick={{ fill: "#9CA3AF" }} tickFormatter={(v) => `${v} ETH`} />
          <Tooltip
            contentStyle={{ backgroundColor: "#12121A", border: "1px solid #1E1E2E", color: "#fff" }}
          />
          <Line type="monotone" dataKey="net_profit_eth" stroke="#00FF94" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
