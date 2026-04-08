"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CHAIN_TYPE, getEvmConfig, getOneChainNetworks } from "@/lib/chain-provider";

function EvmProviders({ children }: { children: React.ReactNode }) {
    const { WagmiProvider } = require("wagmi");
    const config = getEvmConfig();
    return <WagmiProvider config={config}>{children}</WagmiProvider>;
}

function OneChainProviders({ children }: { children: React.ReactNode }) {
    const { SuiClientProvider, WalletProvider } = require("@onelabs/dapp-kit");
    const networks = getOneChainNetworks();
    const networkMap = Object.fromEntries(
        networks.map((n: { id: string; rpcUrl: string }) => [n.id, { url: n.rpcUrl }])
    );
    return (
        <SuiClientProvider networks={networkMap} defaultNetwork={networks[0].id}>
            <WalletProvider>{children}</WalletProvider>
        </SuiClientProvider>
    );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: { queries: { staleTime: 5000 } },
    }));

    const ChainChildren = CHAIN_TYPE === "onechain"
        ? <OneChainProviders>{children}</OneChainProviders>
        : <EvmProviders>{children}</EvmProviders>;

    return (
        <QueryClientProvider client={queryClient}>
            {ChainChildren}
        </QueryClientProvider>
    );
}
