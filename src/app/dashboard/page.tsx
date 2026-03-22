"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { AgentSummaryCards } from "@/components/agents/AgentSummaryCards";
import { EarningsChart } from "@/components/agents/EarningsChart";
import { RecentGamesTable } from "@/components/games/RecentGamesTable";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <div className="flex">
        <aside className="w-64 min-h-screen bg-brand-surface border-r border-brand-border p-6">
          <nav className="space-y-2">
            <a href="/dashboard" className="block px-4 py-2 rounded-card bg-brand-bg text-white">Overview</a>
            <a href="/wallet" className="block px-4 py-2 rounded-card text-gray-400 hover:text-white hover:bg-brand-bg transition-colors">Wallet</a>
            <a href="/lobby" className="block px-4 py-2 rounded-card text-gray-400 hover:text-white hover:bg-brand-bg transition-colors">Lobby</a>
          </nav>
        </aside>
        <main className="flex-1 p-8 space-y-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <AgentSummaryCards />
          <EarningsChart />
          <RecentGamesTable />
        </main>
      </div>
    </div>
  );
}
