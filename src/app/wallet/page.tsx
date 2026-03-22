"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Navbar } from "@/components/layout/Navbar";
import { ConnectedWallet } from "@/components/wallet/ConnectedWallet";
import { AgentBalanceList } from "@/components/wallet/AgentBalanceList";
import { TransactionHistoryTable } from "@/components/wallet/TransactionHistoryTable";

export default function WalletPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <ConnectedWallet />
        <AgentBalanceList />
        <TransactionHistoryTable />
      </main>
    </div>
  );
}
