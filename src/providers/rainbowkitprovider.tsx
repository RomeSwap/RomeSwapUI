"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { neonMainnet } from "viem/chains";

import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  oktoWallet,
  phantomWallet,
  braveWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { getClient } from "@wagmi/core";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        metaMaskWallet,
        phantomWallet,
        trustWallet,
        coinbaseWallet,
        walletConnectWallet,
        oktoWallet,
        braveWallet,
      ],
    },
  ],
  { appName: "RainbowKit App", projectId: "a23a6c61fc0db163a7e310431e37299f" }
);

export const config = createConfig({
  connectors,
  chains: [neonMainnet],
  transports: {
    [neonMainnet.id]: http(),
  },
  ssr: true,
});

export const wagmiClient = getClient(config, {
  chainId: neonMainnet.id,
});

const queryClient = new QueryClient();

const RainBowKitCustomProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#15F096",
            accentColorForeground: "#141721",
            borderRadius: "medium",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainBowKitCustomProvider;
