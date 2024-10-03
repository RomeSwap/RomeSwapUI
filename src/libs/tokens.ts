const JUPITER_VERIFIED_TOKEN_LIST_URL =
	"https://tokens.jup.ag/tokens?tags=verified";

const DEFAULT_LOGO_URI =
	"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";

// check logoURI cos there is one token that has local relative path
function isValidLogoURI(uri: string | null | undefined): boolean {
	if (!uri) return false;
	return uri.startsWith("http://") || uri.startsWith("https://");
}

export async function getTokenList(): Promise<Token[]> {
	try {
		const res = await fetch(JUPITER_VERIFIED_TOKEN_LIST_URL, {
			next: {
				revalidate: 3600,
			},
		});
		if (!res.ok) {
			throw new Error(`HTTP Error! status: ${res.status}`);
		}
		const data: { [address: string]: JupiterToken } = await res.json();
		// console.log(data);

		// convert all Jupiter tokens to our token type
		return Object.values(data).map(
			(token: JupiterToken): Token => ({
				address: token.address,
				symbol: token.symbol,
				name: token.name,
				decimals: token.decimals,
				logoURI: isValidLogoURI(token.logoURI)
					? token.logoURI
					: DEFAULT_LOGO_URI,
			}),
		);
	} catch (error) {
		console.error("Error fetching token list:", error);
		throw error; // To handle by the comp
	}
}
