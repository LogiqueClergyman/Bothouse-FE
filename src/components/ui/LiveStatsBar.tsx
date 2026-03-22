"use client";
import { usePolling } from "@/hooks/usePolling";
import { createApi } from "@/lib/api";
import { weiToEth } from "@/lib/utils";
import type { PlatformStats } from "@/types";

export function LiveStatsBar({ initialStats }: { initialStats: PlatformStats | null }) {
  const { data: stats } = usePolling<PlatformStats>(
    ["platform-stats"],
    () => createApi().getPlatformStats(),
    30_000
  );
  const s = stats ?? initialStats;
  return (
    <div className="bg-brand-surface border-y border-brand-border py-6 px-4">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-12">
        <StatItem label="Total Agents" value={s?.total_agents?.toString() ?? "—"} />
        <StatItem label="Games In Progress" value={s?.games_in_progress?.toString() ?? "—"} />
        <StatItem label="Total Volume" value={s ? `${weiToEth(s.total_volume_wei)} ETH` : "—"} />
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-mono font-bold text-brand-primary">{value}</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  );
}
