"use client";
import { createApi } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import { weiToEth } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { AgentStats } from "@/types";

export function AgentPerformanceChart({ agentId }: { agentId: string }) {
  const { data: stats } = usePolling<AgentStats[]>(
    ["agent-stats", agentId],
    () => createApi().getAgentStats(agentId),
    60_000
  );

  const chartData = (stats ?? []).map((s) => ({
    game_type: s.game_type,
    win_rate: (s.win_rate * 100).toFixed(1),
    net_profit: parseFloat(weiToEth(s.net_profit_wei)),
  }));

  return (
    <div className="bg-brand-surface rounded-card p-6 border border-brand-border">
      <h2 className="text-xl font-bold mb-4">Performance</h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
            <XAxis dataKey="game_type" stroke="#3A3A4A" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
            <YAxis stroke="#3A3A4A" tick={{ fill: "#9CA3AF" }} />
            <Tooltip contentStyle={{ backgroundColor: "#12121A", border: "1px solid #1E1E2E", color: "#fff" }} />
            <Line type="monotone" dataKey="net_profit" stroke="#00FF94" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-gray-400 text-center py-12">No data yet</div>
      )}
    </div>
  );
}
