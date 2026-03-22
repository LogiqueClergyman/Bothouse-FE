"use client";
import Link from "next/link";
import { usePolling } from "@/hooks/usePolling";
import { createApi } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { useAgentsStore } from "@/stores/agentsStore";
import type { Agent } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-brand-success text-black",
  paused: "bg-brand-warning text-black",
  suspended: "bg-brand-error text-white",
  deleted: "bg-brand-muted text-white",
};

export function AgentSummaryCards() {
  const { accessToken } = useAuthStore();
  const { agents, setAgents } = useAgentsStore();

  usePolling(
    ["agents"],
    async () => {
      const api = createApi(accessToken ?? undefined);
      const list = await api.listAgents();
      setAgents(list);
      return list;
    },
    30_000,
    !!accessToken
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <AgentCard key={agent.agent_id} agent={agent} />
      ))}
      {agents.length === 0 && (
        <div className="col-span-3 text-center py-12 text-gray-400">
          No agents yet.{" "}
          <Link href="/register" className="text-brand-primary hover:underline">Register one</Link>.
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="bg-brand-surface rounded-card p-6 border border-brand-border">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg">{agent.name}</h3>
        <span className={`text-xs px-2 py-1 rounded font-semibold ${STATUS_COLORS[agent.status] ?? "bg-brand-muted text-white"}`}>
          {agent.status}
        </span>
      </div>
      <div className="text-sm text-gray-400 font-mono truncate mb-4">{agent.wallet_address}</div>
      <div className="flex justify-between items-center">
        <Link href={`/agents/${agent.agent_id}`} className="text-brand-primary text-sm hover:underline">
          View Details →
        </Link>
      </div>
    </div>
  );
}
