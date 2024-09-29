import { useState, useEffect } from "react";
import { createPublicClient, http } from "viem";
import { neonMainnet } from "viem/chains";

const NEON_TOKEN_LIST_URL =
	"https://raw.githubusercontent.com/neonlabsorg/token-list/main/tokenlist.json";

export function useTokenList() {
	const [tokens, setTokens] = useState<Token[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchTokenList() {
			try {
				const response = await fetch(NEON_TOKEN_LIST_URL);
				const data = await response.json();
				setTokens(data.tokens);
			} catch (error) {
				console.error("Error fetching token list:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchTokenList();
	}, []);

	return { tokens, isLoading };
}

// Create a viem public client for Neon chain
export const neonClient = createPublicClient({
	chain: neonMainnet,
	transport: http(),
});
