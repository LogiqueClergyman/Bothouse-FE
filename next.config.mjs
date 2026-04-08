import { createRequire } from "module";
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_ESCROW_ADDRESS: process.env.NEXT_PUBLIC_ESCROW_ADDRESS,
  },
  webpack: (config) => {
    // pino-pretty is an optional dev dependency of pino used by WalletConnect logger.
    // It's not needed at runtime — stub it out to suppress the "module not found" warning.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
    };

    // Force a single instance of @tanstack/react-query.
    // dapp-kit uses CJS require() while our code uses ESM import.
    // Without this, webpack resolves them to separate modules (index.cjs vs index.js),
    // creating two React contexts — QueryClientProvider from one is invisible to the other.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@tanstack/react-query": require.resolve("@tanstack/react-query"),
    };

    return config;
  },
};
export default config;
