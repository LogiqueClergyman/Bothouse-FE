import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// WalletConnect uses IndexedDB which is browser-only.
// Only include walletConnect connector when a project ID is configured and we're in the browser.
function getConnectors() {
  const connectors = [injected()];
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_WALLETCONNECT_ID
  ) {
    // Dynamic import to avoid SSR crash
    const { walletConnect } = require("wagmi/connectors");
    connectors.push(
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID })
    );
  }
  return connectors;
}

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: getConnectors(),
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});
