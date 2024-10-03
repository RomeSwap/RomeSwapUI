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
} from "@rainbow-me/rainbowkit/wallets";

const connectors = connectorsForWallets(
	[
		{
			groupName: "Suggested",
			wallets: [metaMaskWallet, coinbaseWallet, walletConnectWallet],
		},
	],
	{ appName: "RainbowKit App", projectId: "YOUR_PROJECT_ID" },
);

const config = createConfig({
	connectors,
	chains: [neonMainnet],
	transports: {
		[neonMainnet.id]: http(),
	},
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
