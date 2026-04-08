"use client";
import { useAuthStore } from "@/stores/authStore";
import { useAgentsStore } from "@/stores/agentsStore";
import { createApi } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import { formatDate } from "@/lib/utils";
import { getExplorerTxUrl } from "@/lib/chain-provider";
import type { Settlement } from "@/types";

export function TransactionHistoryTable() {
  const { accessToken } = useAuthStore();
  const { agents } = useAgentsStore();

  const { data: settlements } = usePolling<Settlement[]>(
    ["settlements", agents.map((a) => a.agent_id)],
    async () => {
      if (!accessToken || agents.length === 0) return [];
      const api = createApi(accessToken);
      const all = await Promise.all(agents.map((a) => api.getAgentSettlementHistory(a.agent_id)));
      return all.flat().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    60_000,
    !!accessToken && agents.length > 0
  );

  return (
    <div className="bg-brand-surface rounded-card border border-brand-border overflow-hidden">
      <div className="px-6 py-4 border-b border-brand-border font-semibold">Transaction History</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border text-gray-400">
              <th className="px-4 py-3 text-left">Game</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Tx Hash</th>
              <th className="px-4 py-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {(settlements ?? []).map((s) => (
              <tr key={s.settlement_id} className="border-b border-brand-border hover:bg-brand-bg transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{s.game_id.slice(0, 8)}...</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${s.status === "confirmed" ? "text-brand-success" : s.status === "failed" ? "text-brand-error" : "text-brand-warning"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {s.tx_hash ? (
                    <a href={getExplorerTxUrl(s.tx_hash)} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-mono text-xs">
                      {s.tx_hash.slice(0, 12)}...
                    </a>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-400">{formatDate(s.created_at)}</td>
              </tr>
            ))}
            {(!settlements || settlements.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No transactions yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
