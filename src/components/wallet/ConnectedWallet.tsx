"use client";
import { useAccount, useBalance } from "wagmi";
import { truncateAddress } from "@/lib/utils";

export function ConnectedWallet() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!isConnected || !address) {
    return (
      <div className="bg-brand-surface rounded-card p-6 border border-brand-border text-gray-400">
        No wallet connected.
      </div>
    );
  }

  return (
    <div className="bg-brand-surface rounded-card p-6 border border-brand-border">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-400 mb-1">Connected Wallet</div>
          <div className="font-mono font-bold">{truncateAddress(address, 6)}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">ETH Balance</div>
          <div className="font-mono font-bold text-brand-primary">
            {balance ? `${parseFloat(balance.formatted).toFixed(4)} ETH` : "..."}
          </div>
        </div>
      </div>
    </div>
  );
}
