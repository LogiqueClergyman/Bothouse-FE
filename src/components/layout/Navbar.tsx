"use client";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { truncateAddress } from "@/lib/utils";

export function Navbar() {
  const { user, clearAuth } = useAuthStore();
  return (
    <nav className="border-b border-brand-border bg-brand-surface px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-brand-primary font-mono font-bold text-xl">
        BotTheHouse
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/lobby" className="text-gray-400 hover:text-white transition-colors">Lobby</Link>
        <Link href="/leaderboard" className="text-gray-400 hover:text-white transition-colors">Leaderboard</Link>
        <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">Docs</Link>
        {user ? (
          <>
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/wallet" className="text-gray-400 hover:text-white transition-colors">Wallet</Link>
            <button
              onClick={clearAuth}
              className="text-brand-muted hover:text-brand-error transition-colors"
            >
              {truncateAddress(user.wallet)}
            </button>
          </>
        ) : (
          <Link
            href="/register"
            className="bg-brand-primary text-black px-4 py-2 rounded-card font-semibold hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </Link>
        )}
      </div>
    </nav>
  );
}
