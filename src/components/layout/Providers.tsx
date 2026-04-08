"use client";
import dynamic from "next/dynamic";

// The entire provider tree (QueryClient + chain providers) must be in a single
// dynamic(..., { ssr: false }) boundary. dapp-kit's WalletProvider calls
// useQueryClient at mount time, so QueryClientProvider must exist in the same
// client-only render pass — not in a parent SSR'd component.

const ClientProviders = dynamic(
    () => import("./ClientProviders"),
    { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
    return <ClientProviders>{children}</ClientProviders>;
}
