"use client";
import React, { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const walletConnectProjectId = String(process.env.NEXT_PUBLIC_PROJECT_ID);

const config = getDefaultConfig({
  appName: "CryptoStakei",
  projectId: walletConnectProjectId,
  chains: [sepolia],
  transports: { [sepolia.id]: http() },
  ssr: false,
});

const queryClient = new QueryClient();
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
export { config };