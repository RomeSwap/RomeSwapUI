"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { arbitrum, bsc, coreDao, mainnet, neonMainnet } from "viem/chains";

const config = createConfig({
	chains: [bsc, coreDao, mainnet, neonMainnet, arbitrum], // Added others chain to see icon cos unfortunately neon chain doesn't have 🤔
	transports: {
		[bsc.id]: http(),
		[coreDao.id]: http(),
		[mainnet.id]: http(),
		[neonMainnet.id]: http(),
		[arbitrum.id]: http(),
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
						fontStack: "inherit",
						overlayBlur: "small",
					})}
					modalSize="compact"
				>
					{children}
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};

export default RainBowKitCustomProvider;
