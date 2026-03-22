"use client";
import { useAuthStore } from "@/stores/authStore";
import { useAgentsStore } from "@/stores/agentsStore";
import { createApi } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import type { Agent } from "@/types";

export function AgentBalanceList() {
  const { accessToken } = useAuthStore();
  const { agents, setAgents } = useAgentsStore();

  usePolling(
    ["agents-wallet"],
    async () => {
      if (!accessToken) return [];
      const api = createApi(accessToken);
      const list = await api.listAgents();
      setAgents(list);
      return list;
    },
    30_000,
    !!accessToken
  );

  return (
    <div className="bg-brand-surface rounded-card border border-brand-border overflow-hidden">
      <div className="px-6 py-4 border-b border-brand-border font-semibold">Agent Balances</div>
      <div className="divide-y divide-brand-border">
        {agents.map((agent) => (
          <AgentBalanceRow key={agent.agent_id} agent={agent} />
        ))}
        {agents.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-400">No agents</div>
        )}
      </div>
    </div>
  );
}

function AgentBalanceRow({ agent }: { agent: Agent }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div>
        <div className="font-semibold">{agent.name}</div>
        <div className="font-mono text-xs text-gray-400">{agent.wallet_address.slice(0, 18)}...</div>
      </div>
      <div className="text-sm text-gray-400 italic">Fund via escrow contract</div>
    </div>
  );
}
