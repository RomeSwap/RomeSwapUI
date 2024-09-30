import { createPublicClient, http } from "viem";
import { neonMainnet } from "viem/chains";

const NEON_TOKEN_LIST_URL =
	"https://raw.githubusercontent.com/neonlabsorg/token-list/main/tokenlist.json";

export async function useTokenList(): Promise<Token[]> {
	try {
		const res = await fetch(NEON_TOKEN_LIST_URL, {
			next: {
				revalidate: 3600,
			},
		}); // Caching
		if (!res.ok) {
			throw new Error(`HTTP Error! status: ${res.status}`);
		}
		const data = await res.json();
		return data.tokens as Token[];
	} catch (error) {
		console.error("Error fetching token list:", error);
		return [];
	}
}

// Create a viem public client for Neon chain
export const neonClient = createPublicClient({
	chain: neonMainnet,
	transport: http(),
});
