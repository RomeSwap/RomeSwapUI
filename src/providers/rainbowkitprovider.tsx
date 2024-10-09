"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { defineChain } from "viem";

import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  oktoWallet,
  phantomWallet,
  braveWallet,
  trustWallet,
  rabbyWallet
} from "@rainbow-me/rainbowkit/wallets";

const neonMainnet = defineChain({
  id: 245_022_934,
  network: "neonMainnet",
  name: "Solana (Neon EVM)",
  nativeCurrency: { name: "NEON", symbol: "NEON", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://neon-mainnet.everstake.one"],
    },
  },
  blockExplorers: {
    default: {
      name: "Neonscan",
      url: "https://neonscan.org",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 206545524,
    },
  },
  testnet: false,
});

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
        rabbyWallet,
        oktoWallet,
        braveWallet,
      ],
    },
  ],
  { appName: "RainbowKit App", projectId: "a23a6c61fc0db163a7e310431e37299f" },
);

export const config = createConfig({
  connectors,
  chains: [neonMainnet],
  transports: {
    [neonMainnet.id]: http(),
  },
  ssr: true,
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
