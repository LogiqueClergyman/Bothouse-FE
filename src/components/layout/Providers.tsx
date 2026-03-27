"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { CHAIN_TYPE, getEvmConfig, getOneChainNetworks } from "@/lib/chain-provider";

// EVM providers (loaded only when CHAIN_TYPE === "evm")
function EvmProviders({ children }: { children: React.ReactNode }) {
    const { WagmiProvider } = require("wagmi");
    const config = getEvmConfig();
    return <WagmiProvider config={config}>{children}</WagmiProvider>;
}

// OneChain providers (loaded only when CHAIN_TYPE === "onechain")
function OneChainProviders({ children }: { children: React.ReactNode }) {
    const { SuiClientProvider, WalletProvider } = require("@onelabs/dapp-kit");
    const networks = getOneChainNetworks();
    const networkMap = Object.fromEntries(networks.map((n: { id: string; rpcUrl: string }) => [n.id, { url: n.rpcUrl }]));
    return (
        <SuiClientProvider networks={networkMap} defaultNetwork={networks[0].id}>
            <WalletProvider>{children}</WalletProvider>
        </SuiClientProvider>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: { queries: { staleTime: 5000 } },
    }));

    const chainProviders = CHAIN_TYPE === "onechain"
        ? <OneChainProviders><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></OneChainProviders>
        : <EvmProviders><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></EvmProviders>;

    return chainProviders;
}
