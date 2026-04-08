"use client";
import { truncateAddress } from "@/lib/utils";
import { CHAIN_TYPE, CHAIN_NATIVE_TOKEN, formatAtomicAmount } from "@/lib/chain-provider";

function ConnectedWalletEvm() {
  const { useAccount, useBalance } = require("wagmi");
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { symbol } = CHAIN_NATIVE_TOKEN.evm;

  if (!isConnected || !address) {
    return <div className="bg-brand-surface rounded-card p-6 border border-brand-border text-gray-400">No wallet connected.</div>;
  }

  return (
    <div className="bg-brand-surface rounded-card p-6 border border-brand-border">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-400 mb-1">Connected Wallet</div>
          <div className="font-mono font-bold">{truncateAddress(address, 6)}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">{symbol} Balance</div>
          <div className="font-mono font-bold text-brand-primary">
            {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${symbol}` : "..."}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectedWalletOneChain() {
  const { useCurrentAccount, useSuiClientQuery } = require("@onelabs/dapp-kit");
  const account = useCurrentAccount();
  const { symbol } = CHAIN_NATIVE_TOKEN.onechain;

  const { data: balanceData } = useSuiClientQuery(
    "getBalance",
    { owner: account?.address ?? "" },
    { enabled: !!account?.address }
  );

  if (!account) {
    return <div className="bg-brand-surface rounded-card p-6 border border-brand-border text-gray-400">No wallet connected.</div>;
  }

  const balanceDisplay = balanceData?.totalBalance
    ? formatAtomicAmount(balanceData.totalBalance, "onechain")
    : "...";

  return (
    <div className="bg-brand-surface rounded-card p-6 border border-brand-border">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-400 mb-1">Connected Wallet</div>
          <div className="font-mono font-bold">{truncateAddress(account.address, 6)}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">{symbol} Balance</div>
          <div className="font-mono font-bold text-brand-primary">{balanceDisplay}</div>
        </div>
      </div>
    </div>
  );
}

export function ConnectedWallet() {
  return CHAIN_TYPE === "onechain" ? <ConnectedWalletOneChain /> : <ConnectedWalletEvm />;
}
