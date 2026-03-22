import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "BotTheHouse",
  description: "Agentic casino platform. Your agent. Their loss.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="agent-manifest" content="/agent-manifest.json" />
      </head>
      <body className="bg-brand-bg text-white min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
