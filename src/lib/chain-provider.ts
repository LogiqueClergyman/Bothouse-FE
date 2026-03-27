/**
 * chain-provider.ts
 *
 * Chain-agnostic wallet provider bootstrapping.
 * Reads NEXT_PUBLIC_CHAIN_TYPE to select the correct wallet stack at build time.
 *
 * Supported values:
 *   "evm"       → Wagmi + viem (Base / Base Sepolia)
 *   "onechain"  → @onelabs/dapp-kit + @onelabs/sui
 */

export type ChainType = "evm" | "onechain";

export const CHAIN_TYPE: ChainType =
    (process.env.NEXT_PUBLIC_CHAIN_TYPE as ChainType) ?? "evm";

// ─── EVM (Wagmi) ─────────────────────────────────────────────────────────────

export function getEvmConfig() {
    const { createConfig, http } = require("wagmi");
    const { base, baseSepolia } = require("wagmi/chains");
    const { injected } = require("wagmi/connectors");

    const connectors = [injected()];
    if (
        typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_WALLETCONNECT_ID
    ) {
        const { walletConnect } = require("wagmi/connectors");
        connectors.push(
            walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID })
        );
    }

    return createConfig({
        chains: [base, baseSepolia],
        connectors,
        transports: {
            [base.id]: http(),
            [baseSepolia.id]: http(),
        },
        ssr: true,
    });
}

// ─── OneChain (@onelabs/dapp-kit) ────────────────────────────────────────────

export function getOneChainNetworks() {
    const { getFullnodeUrl } = require("@onelabs/sui/client");

    const rpcUrl =
        process.env.NEXT_PUBLIC_ONECHAIN_RPC_URL ??
        "https://rpc-testnet.onelabs.cc:443";

    return [
        {
            id: "onechain-testnet",
            name: "OneChain Testnet",
            rpcUrl,
            explorerUrl: "https://onescan.cc/testnet",
        },
    ];
}

// ─── Chain metadata (for display) ───────────────────────────────────────────

export const CHAIN_NATIVE_TOKEN: Record<ChainType, { symbol: string; decimals: number }> = {
    evm: { symbol: "ETH", decimals: 18 },
    onechain: { symbol: "OCT", decimals: 9 },
};

export function formatAtomicAmount(amount: string, chainType: ChainType = CHAIN_TYPE): string {
    const { decimals, symbol } = CHAIN_NATIVE_TOKEN[chainType];
    const value = BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const whole = value / divisor;
    const frac = value % divisor;
    const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
    return `${whole}${fracStr ? "." + fracStr : ""} ${symbol}`;
}

export function getExplorerTxUrl(txHash: string, chainType: ChainType = CHAIN_TYPE): string {
    switch (chainType) {
        case "evm":
            return `https://sepolia.basescan.org/tx/${txHash}`;
        case "onechain":
            return `https://onescan.cc/testnet/tx/${txHash}`;
    }
}
