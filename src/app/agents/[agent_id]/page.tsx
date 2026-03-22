import { Navbar } from "@/components/layout/Navbar";
import { createApi } from "@/lib/api";
import { truncateAddress, weiToEth, formatDate } from "@/lib/utils";
import type { Agent, AgentStats } from "@/types";
import { AgentPerformanceChart } from "@/components/agents/AgentPerformanceChart";
import { AgentGameHistory } from "@/components/agents/AgentGameHistory";

async function getAgentData(agentId: string): Promise<{ agent: Agent | null; stats: AgentStats[] }> {
  try {
    const api = createApi();
    const [agent, stats] = await Promise.all([
      api.getAgent(agentId),
      api.getAgentStats(agentId),
    ]);
    return { agent, stats };
  } catch {
    return { agent: null, stats: [] };
  }
}

export default async function AgentDetailPage({ params }: { params: Promise<{ agent_id: string }> }) {
  const { agent_id } = await params;
  const { agent, stats } = await getAgentData(agent_id);

  if (!agent) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="text-gray-400 text-xl">Agent not found</div>
        </main>
      </div>
    );
  }

  const totalStats = stats.reduce((acc, s) => ({
    games_played: acc.games_played + s.games_played,
    games_won: acc.games_won + s.games_won,
    total_wagered_wei: (BigInt(acc.total_wagered_wei) + BigInt(s.total_wagered_wei)).toString(),
    net_profit_wei: (BigInt(acc.net_profit_wei) + BigInt(s.net_profit_wei)).toString(),
  }), { games_played: 0, games_won: 0, total_wagered_wei: "0", net_profit_wei: "0" });

  const winRate = totalStats.games_played > 0 ? totalStats.games_won / totalStats.games_played : 0;

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">{agent.name}</h1>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-400">{truncateAddress(agent.wallet_address)}</span>
            </div>
          </div>
          <div>
            <span className="bg-brand-surface border border-brand-border text-sm px-3 py-1 rounded-full">
              {agent.status}
            </span>
            <div className="text-xs text-gray-400 mt-1 text-right">since {formatDate(agent.created_at)}</div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Games Played" value={totalStats.games_played.toString()} />
          <StatCard label="Win Rate" value={`${(winRate * 100).toFixed(1)}%`} />
          <StatCard label="Net Profit" value={`${weiToEth(totalStats.net_profit_wei)} ETH`} colored />
          <StatCard label="Total Wagered" value={`${weiToEth(totalStats.total_wagered_wei)} ETH`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AgentPerformanceChart agentId={agent.agent_id} />
          <AgentGameHistory agentId={agent.agent_id} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, colored }: { label: string; value: string; colored?: boolean }) {
  return (
    <div className="bg-brand-surface rounded-card p-5 border border-brand-border">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className={`text-2xl font-mono font-bold ${colored ? "text-brand-primary" : "text-white"}`}>{value}</div>
    </div>
  );
}
